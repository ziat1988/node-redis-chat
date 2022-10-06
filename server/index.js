const express= require("express")
const bcrypt = require("bcrypt");
const app = express()
const session = require("express-session");
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const {Server} = require('socket.io')
let RedisStore = require("connect-redis")(session);

const dayjs = require('dayjs')
const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const {createUser,makeUsernameKey} = require("./utils");

const {client:redisClient,set,get,hgetall,hget,zrangewithscore,zadd,exists,smembers} = require("./redis");

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: "thisissecrettoken",
    saveUninitialized: true,
    resave: false,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
});


const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.sendStatus(403);
    }
    next();
};


app.use(sessionMiddleware);

// app.use(function (req, res, next) {
//     if (!req.session) {
//         return next(new Error("oh no")) // handle error
//     }
//     next() // otherwise continue
// })

/*
const authRedis = (req, res, next) => {
    if (!req.session.user) {
        return res.sendStatus(403);
    }
    next();
};



*/
/*
io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
    // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
    // connections, as 'socket.request.res' will be undefined in that case
});
*/

/* init app*/

(async ()=>{

    /** We store a counter for the total users and increment it on each register */
    const totalUsersKeyExist = await exists("total_users");
    console.log(totalUsersKeyExist)
    if(!totalUsersKeyExist){
        // /** This counter is used for the id */
        await set("total_users", 0)

    }

    io.on('connection',socket => {
        //   console.log('a user connected')
        socket.on('disconnect', () => {
          //  console.log('user disconnected');
        });

        socket.on("room.join", (id) => {
            console.log("room join id:",id)
            socket.join(`room:${id}`);
        });

        socket.on('message', async (msg)=>{
            console.log('server recieved message from js:',msg)
            const messageString = JSON.stringify(msg);
            const roomKey = `room:${msg.roomId}`;
            console.log('room key:',roomKey)
            // show.room ?

            /** We've got a new message. Store it in db, then send back to the room. */
            //io.emit('chat event', msg);
            await zadd(roomKey, msg.date, messageString);
            io.in(roomKey).emit("message", messageString)
        })
    })

    io.of("/").adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });

})()



app.use(bodyParser.json());

app.get("/test-create",async (req,res)=>{
    await createUser("tom","123")
    res.send("ok");
})
app.get("/", (req, res) => {
    res.send("hello there");

});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/api/post", async (req, res) => {

    await redisClient.publish("global",req.body.message)

    res.json({ data: "publish ok" });
});
/** The request the client sends to check if it has the user is cached. */
app.get("/api/get-user-session",(req,res)=>{
    const {user} = req.session;
    if(user){
        return res.json(user)
    }
    /* not user in session */
    return res.json(null)
})

/** Fetch messages from a selected room */
app.get("/api/room/:id/messages",auth,async (req,res)=>{
    // TODO: get message for user id in specifique room id with form 1:2
    // TODO:  check room existe
    //const x = await exists('room:1:2');

    const roomId = req.params.id;
    const offset = +req.query.offset || 0;
    const size = +req.query.size || 50;

    console.log(roomId);
    const data = await zrangewithscore(`room:${roomId}`,offset,size);
    return res.json(data)
})

/** Get rooms for the selected user.*/
app.get(`/api/rooms/:userId`,auth, async (req,res)=>{
    const rooms = [];
    const userId = req.params.userId;
    const roomIds = await smembers(`user:${userId}:rooms`);
    console.log(roomIds);

    for (let roomId of roomIds){
        if(+roomId === 0){
            continue;
        }
        const userIds = roomId.split(":");
        const otherUsers = userIds.filter(item=>+item !== +userId);
        const otherId = otherUsers[0];
        //TODO: many users ex groups can be happen
        rooms.push({
            id: roomId,
            names: [await hget(`user:${userIds[0]}`, "username"), await hget(`user:${userIds[1]}`, "username")],
            otherUsers: [{id: otherId,username: await hget(`user:${otherId}`,"username")}]
        })
    }
    console.log('rooms here:',rooms);

    res.json(rooms);
})



/* Login  TODO: Register */

app.post('/api/login',async(req,res)=>{

    // check user in redis BDD
    const {username,password} = req.body;
    const usernameKey = makeUsernameKey(username);
    const userExists = await exists(usernameKey);

    console.log('user login ton tai:',userExists);

    if(userExists){
        const userKey = await get(usernameKey);
        const dataUserExist = await hgetall(userKey);
        try{
            if(await bcrypt.compare(password,dataUserExist.password)){
                const user = { id: userKey.split(":").pop(), username };
                req.session.user = user;
                return res.status(200).json(user);
            }
        }catch (e){

        }
    }

    return res.status(401).json({message: "Invalid username or password"})
});


app.post("/api/logout",auth,(req,res)=>{
    req.session.destroy(()=>{});
    return res.sendStatus(200)
})

const PORT = process.env.PORT || 8000;

server.listen(PORT, function () {
    console.log(`server run in port ${PORT}`);
});
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

const {client:redisClient,set,get,hgetall,zrangewithscore,zadd,exists} = require("./redis");

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
})()

io.on('connection',socket => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat event', msg=>{
        console.log('server recieved message from js:',msg)
        io.emit('chat event', msg);
    })
})

app.use(bodyParser.json());

app.get("/test-create",async (req,res)=>{
    await createUser("solo","123")
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


app.get("/api/messages",auth,async (req,res)=>{
    // TODO: get message for user id in specifique room
    // check room existe
    //const x = await exists('room:1:2');
    const data = await zrangewithscore("room:1:2",0,50);
    return res.json(data)
})

app.post("/api/messages",auth,async (req,res)=>{
    console.log(req.body)
    // check user logged in
    const userLogged= req.session.user;

    const nowTS = dayjs().unix();
    // save msg to DB, need id user in session + id user target
    const objMsg = {
        from:userLogged.id,
        date: nowTS,
        message: req.body.message,
        roomId:"1:2"
    }

    // convert to string
    const stringObjMsg = JSON.stringify(objMsg);
    const result = await zadd("room:1:2",nowTS,stringObjMsg);

    if(result === 1){
        // io broadcast msg
        /*
        io.on("connection", (socket) => {
            socket.broadcast.emit("room:1:2",stringObjMsg);
        });
        */

        io.emit("room:1:2",stringObjMsg);

        return res.json(stringObjMsg);
    }



    return res.status(400).json({message: "Msg can not insert to DB"})


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

        if(await bcrypt.compare(password,dataUserExist.password)){
            const user = { id: userKey.split(":").pop(), username };
            req.session.user = user;
            return res.status(200).json(user);
        }

    }

    return res.status(401).json({message: "Invalid username or password"})
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, function () {
    console.log(`server run in port ${PORT}`);
});
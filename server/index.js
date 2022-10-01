const express= require("express")
const bcrypt = require("bcrypt");
const app = express()
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const {Server} = require('socket.io')

const dayjs = require('dayjs')
const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const {client:redisClient,auth,set,get,hgetall,zrangewithscore,zadd,exists} = require("./redis");
const {createUser,makeUsernameKey} = require("./utils");

/* init app*/

(async ()=>{
    await auth(redisClient)
    /** We store a counter for the total users and increment it on each register */
    const totalUsersKeyExist = await exists("total_users");
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
    await createUser("dang","123")
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

app.get("/api/messages",async (req,res)=>{
    // TODO: get message for user id in specifique room

    // check room existe
    //const x = await exists('room:1:2');
    const data = await zrangewithscore("room:1:2",0,50);
    return res.json(data)
})

app.post("/api/messages",async (req,res)=>{
    console.log(req.body)
    // check user logged in

    const nowTS = dayjs().unix();
    // save msg to DB, need id user in session + id user target
    const objMsg = {
        from:2,
        date: nowTS,
        message: req.body.message,
        roomId:"1:2"
    }

    // convert to string
    const stringObjMsg = JSON.stringify(objMsg);
    const result = await zadd("room:1:2",nowTS,stringObjMsg);

    if(result === 1){
        return res.json({value:stringObjMsg,score: objMsg.date});
    }

    return res.status(400).json({message: "Msg can not insert to DB"})


    // broadcast message
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
            return res.status(200).json(user);
        }

    }

    return res.status(401).json({message: "Invalid username or password"})
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, function () {
    console.log(`server run in port ${PORT}`);
});
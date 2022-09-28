
const express= require("express")
const app = express()
const server = require("http").createServer(app);
const {client,auth,set,get,exists} = require("./redis");

/* init app*/

(async ()=>{
    await auth(client)
    /** We store a counter for the total users and increment it on each register */
    const totalUsersKeyExist = await exists("total_users");
    if(!totalUsersKeyExist){
        // /** This counter is used for the id */
        await set("total_users", 0)
    }
})()

app.get("/", (req, res) => {
    res.send("hello there");
});

app.get("/api", (req, res) => {
    console.log('api call')
    res.json({ message: "Hello from server!" });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, function () {
    console.log(`server run in port ${PORT}`);
});
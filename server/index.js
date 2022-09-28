
const express= require("express")
const app = express()
const server = require("http").createServer(app);
const {client,auth,get} = require("./redis");

/* init app*/

(async ()=>{
    await auth(client)
    const x =  await get("iphone")
    console.log(x)
})()

app.get("/", (req, res) => {
    res.send("hello there");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, function () {
    console.log(`server run in port ${PORT}`);
});
const {client} = require('./redis');

(async()=>{
    const subscriber = client.duplicate();
    await subscriber.connect();


    await subscriber.subscribe("global",(message)=>{
        console.log(message)
    });
})()

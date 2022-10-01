const {client} = require('./redis');

(async()=>{
    const publisher = client.duplicate();
    await publisher.connect();


    await publisher.publish('global', 'hello there');
})()

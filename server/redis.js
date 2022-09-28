require("dotenv").config();
const redis = require("redis");


const auth = (client)=> new Promise((resolve,reject)=>{
    client.connect();
    resolve(true);
    // TODO: auth in prod with password
})
const client = redis.createClient({
    url: process.env.URL_REDIS
});

const get = async function(key){
    return await client.get(key)
}


module.exports = {
    client,
    auth,
    get
}
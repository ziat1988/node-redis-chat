require("dotenv").config();
const redis = require("redis");

const auth = (client)=> new Promise((resolve,reject)=>{
    client.connect();
    client.select(1);
    resolve(true);
    // TODO: auth in prod with password
})
const client = redis.createClient({
    url: process.env.URL_REDIS,

});


const exists = async function (key){
    return await client.exists(key)
}
const get = async function(key){
    return await client.get(key)
}

const set = async function(key,value){
    return await client.set(key,value)
}

const incr = async function (key){
    return await client.incr(key)
}

// Hash
const hset = async function(key,values){
    return await client.hSet(key,values)
}

// SET
const sadd = async function(key,value){
    return await client.sAdd(key,value)
}

module.exports = {
    client,
    auth,
    set,
    get,
    incr,
    hset,
    sadd,
    exists
}
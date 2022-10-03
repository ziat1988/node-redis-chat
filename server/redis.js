require("dotenv").config();
const Redis = require("ioredis");

const client = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    db: 1, // Defaults to 0
})


const exists = async function (key){
    return client.exists(key);
}
const get = async function(key){
    return client.get(key);
}

const set = async function(key,value){
    return client.set(key, value);
}

const incr = function (key){
    return client.incr(key);
}

const hgetall = async function(key){
    return client.hgetall(key);
}

// Hash
const hset = async function(key,values){
    return client.hset(key, values);
}

// SET
const sadd = async function(key,value){
    return client.sadd(key, value);
}

const zadd= async function(key,score,value){
    return client.zadd(key, score, value);
}

// sorted set

const zrangewithscore = async function(key, min=0, max=1){
    return client.zrange(key, min, max);
   // return await client.zRangeByScore(key, min, max)
}

module.exports = {
    client,
    //connectRedis,
    //auth,
    set,
    get,
    incr,
    hset,
    sadd,
    hgetall,
    exists,
    zadd,
    zrangewithscore
}
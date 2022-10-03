const bcrypt = require('bcrypt');

const {incr,set,hset,sadd} = require('./redis')

/** Redis key for the username (for getting the user id) */
const makeUsernameKey = (username) => {
    return `username:${username}`;
};


const createUser = async(username,password)=>{
    const usernameKey = makeUsernameKey(username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const nextId = await incr("total_users");

    console.log('nextid:',nextId);
    const userKey = `user:${nextId}`;
    await set(usernameKey, userKey);
    await hset(userKey, ["username", username, "password", hashedPassword]);

    /**
     * Each user has a set of rooms he is in
     * let's define the default ones
     */
    await sadd(`user:${nextId}:rooms`, `${0}`); // Main room
}

module.exports = {
    createUser,
    makeUsernameKey
}
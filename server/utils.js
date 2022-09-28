const bcrypt = require('bcrypt');

/** Redis key for the username (for getting the user id) */
const makeUsernameKey = (username) => {
    return `username:${username}`;
};


const createUser = async(username,password)=>{
    const usernameKey = makeUsernameKey(username);

}
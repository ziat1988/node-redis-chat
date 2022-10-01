import axios from 'axios';
//axios.defaults.withCredentials = true;

export const login = async(username,password)=>{
    return await axios.post('/api/login',{
        username,
        password
    })

}
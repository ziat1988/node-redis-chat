import {useCallback, useEffect, useState} from 'react'

import {useFetch} from "use-http";
import './reset.css'
import './App.css'
import Login from "./components/Login";
import Chat from "./components/Chat";
import useUserStore from "./store/useUserStore.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const { loading, error, data = null } = useFetch('/api/get-user-session', {}, [])
    const setUser= useUserStore(state=>state.setUser);
    const userLogged = useUserStore(state=>state.userLogged);

    const userLoggedResult = useCallback(()=>{
        setUser(data)
    },[data])

    useEffect(()=>{
        setUser(data);
    },[userLoggedResult])  // data here make error. Maybe need useCallback

    return (
        <div className="App">
            {userLogged ? <Chat /> : <Login />}
        </div>
    )
}

export default App

import {useEffect, useRef, useState} from 'react'
import axios from 'axios';


import './reset.css'
import './App.css'
import Login from "./components/Login";
import Chat from "./components/Chat";
import useUserStore from "./store/useUserStore.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const userLogged = useUserStore(state=>state.userLogged);
    return (
        <div className="App">
            {userLogged ? <Chat /> : <Login />}
        </div>
    )
}

export default App

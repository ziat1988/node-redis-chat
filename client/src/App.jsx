import {useCallback, useEffect, useState} from 'react'

import {useFetch} from "use-http";
import './reset.css'
import './App.css'
import Login from "./components/Login";
import Chat from "./components/Chat";
import useUserStore from "./store/useUserStore.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    BrowserRouter,
    Routes, //replaces "Switch" used till v5
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

function App() {
    const userLogged = useUserStore(state=>state.userLogged);
    console.log('user log trong app:',userLogged)
    return (
        <div className="App">
            {userLogged ? <Navigate to={"chat"} /> : <Navigate to={"/login"}/>}
        </div>
    )
}

export default App

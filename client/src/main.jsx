import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
    BrowserRouter,
    Routes, //replaces "Switch" used till v5
    Route,
    Navigate
} from "react-router-dom";
import Login from "./components/Login/index.jsx";
import Chat from "./components/Chat/index.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path={"*"} element={<App/> } />
            <Route path="/login" element={<Login />}/>
            <Route path="/chat" element={<Chat />} />
        </Routes>
    </BrowserRouter>


)

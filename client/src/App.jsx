import {useCallback, useEffect, useState} from 'react'

import {useFetch} from "use-http";
import './reset.css'
import './App.css'
import Login from "./components/Login";
import Chat from "./components/Chat";
import useUserStore from "./store/useUserStore.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import io from "socket.io-client";


function App() {
    const { loading, error, data = null } = useFetch('/api/get-user-session', {}, [])
    const userLogged = useUserStore(state=>state.userLogged);
    const setUserLogged = useUserStore(state=>state.setUser);
   // const navigate = useNavigate()
    useEffect(()=>{
        setUserLogged(data);

    },[data])

    return (
        <div className="App">
            {/*<div><b>Connection status:</b> {socketConnected ? socket.id + ' connected' : 'Disconnected'}</div>*/}
            {/*<input*/}
            {/*    type="button"*/}
            {/*    style={{ marginTop: 10 }}*/}
            {/*    value={socketConnected ? 'Disconnect' : 'Connect'}*/}
            {/*    onClick={handleSocketConnection} />*/}

            {/*<button className={'btn btn-secondary'} onClick={()=>{setUserLogged('hey there')}}>Change user</button>*/}
            {/*<div>*/}
            {/*    <Link to={'/login'} > Login </Link>*/}
            {/*</div>*/}

            {userLogged ? <Chat /> : <Login />}
        </div>
    )
}

export default App

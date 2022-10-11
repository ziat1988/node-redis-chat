import React, {useContext} from 'react';
import {useFetch} from "use-http";
import useUserStore from "../../store/useUserStore.jsx";
import useRoomStore from "../../store/useRoomStore.jsx";
import { useNavigate } from "react-router-dom";

function Index(props) {

    const{response,post,error} = useFetch();
    const setUser = useUserStore(state=>state.setUser);
    const setRoomCurrent = useRoomStore(state=>state.setRoomCurrent)

    const navigate = useNavigate();
    const handleLogout = async(e)=>{
        //
        await post("/api/logout")
        if(response.ok) {
            console.log(" user has logout")
            setUser(null);
            setRoomCurrent(null);
            navigate("/")
        }
    }

    return (
        <div onClick={handleLogout}>Logout</div>
    );
}

export default Index;
import React from 'react';
import {useFetch} from "use-http";
import useUserStore from "../../store/useUserStore.jsx";

function Index(props) {

    const{response,post,error} = useFetch();
    const setUserLogged = useUserStore(state=>state.setUser);
    const handleLogout = async(e)=>{
        //
        await post("/api/logout")
        if(response.ok) {
            console.log(" user has logout")
            setUserLogged(null);
        }
    }

    return (
        <div onClick={handleLogout}>Logout</div>
    );
}

export default Index;
import React, {useEffect} from 'react';

import {useFetch} from "use-http";
import useUserStore from "../../../../store/useUserStore.jsx";
import ChatListItem from "./ChatListItem.jsx";
import useRoomStore from "../../../../store/useRoomStore.jsx";

function ChatList(props) {
    // fetch all chat existe (all room)
    const setRoomCurrent = useRoomStore(state=>state.setRoomCurrent);
    const userLogged = useUserStore(state=>state.userLogged);
    const{loading,error,response,data=[]} = useFetch(`/api/rooms/${userLogged.id}`,{},[])


    useEffect(()=>{
        if(data.length > 0){
            // TODO: first room will be sort by last message
            setRoomCurrent(data[0].id)
        }else{
            setRoomCurrent(null)
        }
    },[data])

    return (
        <div>
            {data.map(item=><ChatListItem room = {item} key={item.id}/>)}
        </div>
    );
}

export default ChatList;
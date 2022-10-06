import React, {useCallback, useEffect, useState} from 'react';
import {useFetch} from "use-http";

import useUserStore from "../../../store/useUserStore.jsx";
import ChatMessageItem from "./ChatMessageItem.jsx";
import useRoomStore from "../../../store/useRoomStore.jsx";
import useSocket from "../../../hooks/useSocket.jsx";
import useMessageStore from "../../../store/useMessageStore.jsx";


function ChatMessages(props) {
    const [messages,setMessages] = useState([]);
    const newMsg = useMessageStore(state=>state.newMsg);
    const { loading, error, response,get } = useFetch()
    const userLogged = useUserStore(state=>state.userLogged);
    const idRoomCurrent = useRoomStore(state=>state.roomCurrent)
    console.log('id room current:',idRoomCurrent)
    console.log('user current:',userLogged)

    // TODO: determine users in chat: userlogged + other users

    useEffect(()=>{
        async function fetchData(){
            // get id user current  + id other user
            const data = await get(`/api/room/${idRoomCurrent}/messages`);
            if(response.ok){
                setMessages(data)
            }
        }
        fetchData();
    },[idRoomCurrent])


    useEffect(()=>{
        if(newMsg){
            setMessages([...messages,newMsg])
        }

    },[newMsg])

    return (
        <div>
            <ul>
                {messages.length > 0 && messages.map(item=> {
                    const objItem = JSON.parse(item);
                    return <ChatMessageItem userLoggedId = {userLogged.id} data={objItem} key={objItem.date}/>
                })}
            </ul>
        </div>
    );
}

export default ChatMessages;
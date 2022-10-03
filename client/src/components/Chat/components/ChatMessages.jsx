import React, {useCallback, useEffect, useState} from 'react';
import {useFetch} from "use-http";
import io from 'socket.io-client';


import useUserStore from "../../../store/useUserStore.jsx";
import useMessageStore from "../../../store/useMessageStore.jsx";
import ChatMessageItem from "./ChatMessageItem.jsx";

const socket = io("http://localhost:8000");

function ChatMessages(props) {

    const [messages,setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);

    const { loading, error, response,get } = useFetch()

    const userLogged = useUserStore(state=>state.userLogged);

    useEffect(()=>{
        socket.on('connect', () => {
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('room:1:2', function(msg) {
            setMessages(prevMessages=>[...prevMessages,msg])
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };

    },[])




    useEffect(()=>{

        async function fetchData(){
            const data = await get('/api/messages');
            if(response.ok){
                setMessages(data)
            }
        }

        fetchData();
    },[])


    return (
        <div>

            {<p><small> you are {isConnected? 'connected to socket.io' : ' not connected yet!' }</small></p>}
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
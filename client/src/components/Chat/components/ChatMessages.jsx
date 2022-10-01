import React, {useEffect, useState} from 'react';
import ChatMessageItem from "./ChatMessageItem.jsx";
import {useFetch} from "use-http";

import useUserStore from "../../../store/useUserStore.jsx";

import io from 'socket.io-client';
import useMessageStore from "../../../store/useMessageStore.jsx";
const socket = io("http://localhost:8000");

function ChatMessages(props) {
    // TODO request messages from BD
    const [isConnected, setIsConnected] = useState(socket.connected);
    const options = {} // these options accept all native `fetch` options
    // the last argument below [] means it will fire onMount (GET by default)
    const { loading, error, data = [] } = useFetch('/api/messages', options, [])

    const userLogged = useUserStore(state=>state.userLogged);

    const newMsg = useMessageStore(state=>state.newMsg);

    const [newChat,setNewChat] = useState(null)

    useEffect(()=>{
        socket.on('connect', () => {
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('chat event', function(msg) {

        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };

    },[])

    useEffect(()=>{
        setNewChat(newMsg)
    },[newMsg])

    return (
        <div>
            {<p><small> you are {isConnected? 'connected to socket.io' : ' not connected yet!' }</small></p>}
            <ul>
                {data.length > 0 && data.map(item=> <ChatMessageItem userLoggedId = {userLogged.id} data={item} key={item.score}/>)}
                {newChat && <ChatMessageItem userLoggedId={userLogged.id} data={newChat} key={newChat.score}/>}
            </ul>
        </div>
    );
}

export default ChatMessages;
import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import dayjs from "dayjs";
import useUserStore from "../../store/useUserStore.jsx";
import ChatMessages from "./components/ChatMessages.jsx";
import ChatList from "./components/ChatList/ChatList.jsx";
import useRoomStore from "../../store/useRoomStore.jsx";
import Logout from "../Logout";

import TypingArea from "./components/TypingArea/TypingArea.jsx";
import io from "socket.io-client";
import {useFetch} from "use-http";

const ChatWrapper = styled.div`
  border: 1px solid blue;
`

function Index(props) {
    const userLogged = useUserStore(state=>state.userLogged)
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const{loading,error,response,get} = useFetch()

    const [roomCurrent,setRoomCurrent] = useState(null);
    const [messages,setMessages] = useState([]);
    const [newMsg,setNewMsg] = useState(null);
    const [chatList,setChatList] = useState([])


    useEffect(()=>{

        async function fetchData(){
            // get id user current  + id other user
            const data = await get(`/api/rooms/${userLogged.id}`);
            if(response.ok && data.length > 0){
                setChatList(data)
                setRoomCurrent(data[0].id)
            }
        }
        fetchData();

    },[userLogged])

    useEffect(()=>{
        if(!roomCurrent) return;

        async function fetchData(){
            // get id user current  + id other user
            const data = await get(`/api/room/${roomCurrent}/messages`);
            if(response.ok){
                setMessages(data)
            }
        }
        fetchData();

    },[roomCurrent])

    useEffect(() => {
        setSocket(io('http://localhost:8000'));

        return ()=>{
            console.log('unmount chat')
            setSocket(null);
        }
    }, []);


    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log(socket.connected, socket.id)
            setSocketConnected(socket.connected);
        });
        socket.on('disconnect', () => {
           setSocketConnected(socket.connected);
        });

        socket.on('message',(msg)=>{
            //console.log('real time:',msg, "messages list:",messages)
            setNewMsg(msg);
        })

        return ()=>{
            socket.off('connect')
            socket.off('disconnect');
            socket.off('message');
        }

    }, [socket]);

    useEffect(()=>{
        if(roomCurrent){
            socket.emit("room.join",roomCurrent)
        }
    },[roomCurrent])

    useEffect(()=>{
        if(!newMsg) return;
        setMessages([...messages,newMsg])
    },[newMsg])

    return (
        <React.Fragment>
                    <ChatWrapper>
                        <div><b>Connection status:</b> {socketConnected ? socket.id + ' connected' : 'Disconnected'}</div>
                        <Logout />
                        <div className={'row'}>
                            <div className={'col col-md-4'}>
                                <ChatList chatList = {chatList} />
                            </div>
                            <div className={'col col-md-8'}>
                                <ChatMessages messages= {messages} />
                                <TypingArea socket={socket} roomCurrent={roomCurrent}/>
                            </div>
                        </div>
                    </ChatWrapper>

        </React.Fragment>
    );
}

export default Index;
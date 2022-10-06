import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import useUserStore from "../../store/useUserStore.jsx";
import ChatMessages from "./components/ChatMessages.jsx";
import useMessageStore from "../../store/useMessageStore.jsx";
import useSocket from "../../hooks/useSocket.jsx";
import ChatList from "./components/ChatList/ChatList.jsx";
import dayjs from "dayjs";
import useRoomStore from "../../store/useRoomStore.jsx";


const ChatWrapper = styled.div`
  border: 1px solid blue;
`


function Index(props) {
    const userLogged = useUserStore((state)=>state.userLogged)
    const refTexInput = useRef(null)

    const currentRoomId= useRoomStore(state=>state.roomCurrent);
    const [socketRef,connected] = useSocket(currentRoomId);

    useEffect(()=>{
        if(currentRoomId){
            socketRef.current.emit("room.join",currentRoomId);
        }
    },[currentRoomId])
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // construction object msg
        const objMsg = {
            from: +userLogged.id,
            date: dayjs().unix(),
            message: refTexInput.current.value,
            roomId: currentRoomId
        };

        socketRef.current.emit("message",objMsg);

    }

    return (
        <ChatWrapper>
            <h3>Hello {userLogged.username}, id: {userLogged.id} is {connected? 'connected': 'not connected'}</h3>
            <div className={'row'}>
                <div className={'col col-md-4'}>
                    <ChatList />
                </div>
                <div className={'col col-md-8'}>
                    <ChatMessages />
                    <form onSubmit={handleSubmit}>
                        <div className={'mb-3'}>
                            <input className={'form-control'} ref={refTexInput} type={"text"} placeholder={'Aa'}/>
                        </div>
                        <button className={'btn btn-secondary'} type={"submit"}>Send</button>
                    </form>
                </div>
            </div>
        </ChatWrapper>
    );
}

export default Index;
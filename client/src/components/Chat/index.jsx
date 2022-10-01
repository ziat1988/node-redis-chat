import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import useUserStore from "../../store/useUserStore.jsx";
import ChatMessages from "./components/ChatMessages.jsx";
import {useFetch} from "use-http";
import useMessageStore from "../../store/useMessageStore.jsx";

const ChatWrapper = styled.div`
    border: 1px solid blue;
`


function Index(props) {

    const userLogged = useUserStore((state)=>state.userLogged)
    const refTexInput = useRef(null)
    const { get, post, response, loading, error } = useFetch()

    const newMsg = useMessageStore(state=>state.newMsg);
    const setNewMsg = useMessageStore(state=>state.setNewMsg);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(refTexInput.current.value)
        const newMsg = await post('/api/messages', { message:refTexInput.current.value })
        if(response.ok){
            // add new msg to store for re-render
            setNewMsg(newMsg);
            refTexInput.current.value="";
        }
        console.log('newmsg:',newMsg)

    }

    return (
        <ChatWrapper>
            <h3>Hello {userLogged.username}, id: {userLogged.id} </h3>

            <ChatMessages />
            <form onSubmit={handleSubmit}>
                <div className={'mb-3'}>
                <input className={'form-control'} ref={refTexInput} type={"text"} placeholder={'Aa'}/>
                </div>
                <button className={'btn btn-secondary'} type={"submit"}>Send</button>
            </form>
        </ChatWrapper>
    );
}

export default Index;
import React from 'react';

import useUserStore from "../../../store/useUserStore.jsx";
import ChatMessageItem from "./ChatMessageItem.jsx";

function ChatMessages({messages}) {
    const userLogged = useUserStore(state=>state.userLogged);

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
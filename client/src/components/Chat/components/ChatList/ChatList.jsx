import React, {useContext, useEffect, useState} from 'react';

import {useFetch} from "use-http";
import useUserStore from "../../../../store/useUserStore.jsx";
import ChatListItem from "./ChatListItem.jsx";
import useRoomStore from "../../../../store/useRoomStore.jsx";
import {SocketContext} from "../../../../context/socket.js";

function ChatList({chatList}) {
    const userLogged = useUserStore(state=>state.userLogged);

    return (
        <div>
            <p>{userLogged.username}</p>
            {chatList.map(item=><ChatListItem room = {item} key={item.id}/>)}
        </div>
    );
}

export default ChatList;
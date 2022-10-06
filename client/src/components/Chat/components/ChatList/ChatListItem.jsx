import React from 'react';
import {PersonCircle} from 'react-bootstrap-icons';
import useUserStore from "../../../../store/useUserStore.jsx";
import styled from "styled-components";

const ItemChat = styled.div`
  border: 1px solid red;
  cursor: pointer;
`
function ChatListItem({room}) {

    // TODO: group user has many users
    const handleSelectRoom = (e)=>{
        // fetch api to get messages from  this room
        console.log('here',room.id)
    }
    return (
        <ItemChat onClick={handleSelectRoom}>
            <PersonCircle />
            <div>{room.otherUsers[0].username}</div>
        </ItemChat>
    );
}

export default ChatListItem;
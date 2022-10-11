import React from 'react';
import styled from "styled-components";
import dayjs from "dayjs";
const ItemLi = styled.li`
  
  &.left{
    text-align: left;
  }

  &.right{
    text-align: right;
  }
`

// TODO:
const getUserName=(id)=>{
    const users = {
        1: "solo",
        2: "dang",
        3: "tom"
    }

    return users[id]
}

function ChatMessageItem({data,userLoggedId}) {
    const {from,message,roomId,date} = data;
    //console.log('userLogged:',userLoggedId, 'from:',from)
    return (
        <React.Fragment>
            <ItemLi className={+from === +userLoggedId ? 'right' : 'left'}>
                <p> <strong>{getUserName(from)}</strong></p>
                <p> {message}</p>
                <p><small>{dayjs.unix(date).format("DD/MM/YYYY")}</small></p>
            </ItemLi>
        </React.Fragment>
    );
}

export default ChatMessageItem;
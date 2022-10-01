import React from 'react';
import styled from "styled-components";
import useUserStore from "../../../store/useUserStore.jsx";
import dayjs from "dayjs";
const ItemLi = styled.li`
  
  &.left{
    text-align: left;
  }

  &.right{
    text-align: right;
  }
`
function ChatMessageItem({data,userLoggedId}) {
    console.log('data in item:',data)

    const valueObj = JSON.parse(data.value)
    const {from,message,roomId,date} = valueObj;

    console.log(from, userLoggedId)

    return (
        <React.Fragment>
            <ItemLi className={from === userLoggedId ? 'right' : 'left'}>
                {message}
                <p><small>{dayjs.unix(date).format("DD/MM/YYYY")}</small></p>
            </ItemLi>
        </React.Fragment>
    );
}

export default ChatMessageItem;
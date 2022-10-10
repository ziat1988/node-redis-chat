import React, {useContext, useRef} from 'react';
import dayjs from "dayjs";
import useUserStore from "../../../../store/useUserStore.jsx";
function TypingArea({socket,roomCurrent}) {
    const userLogged = useUserStore((state)=>state.userLogged)
    const refTexInput = useRef(null)

    const handleSubmit = async (e)=>{
        e.preventDefault();
        // construction object msg
        const objMsg = {
            from: +userLogged.id,
            date: dayjs().unix(),
            message: refTexInput.current.value,
            roomId: roomCurrent
        };

        socket.emit("message",objMsg);
        refTexInput.current.value="";
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={'mb-3'}>
                <input className={'form-control'} ref={refTexInput} type={"text"} placeholder={'Aa'}/>
            </div>
            <button className={'btn btn-secondary'} type={"submit"}>Send</button>
        </form>
    );
}

export default TypingArea;
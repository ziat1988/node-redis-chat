import {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import useMessageStore from "../store/useMessageStore.jsx";

const useSocket = ()=>{
    const [connected, setConnected] = useState(false);
    /** First of all it's necessary to handle the socket io connection */
    const socketRef = useRef(null);
    const socket = io("http://localhost:8000");

    const setNewMsg = useMessageStore(state=>state.setNewMsg)

    useEffect(()=>{
        socketRef.current = socket

        // Handling connection errors
        socketRef.current.on('connect_error',(err)=>handleError(err))
        socketRef.current.on('connect_failed',(err)=>handleError(err))

        const handleError = (err)=> {
            console.log(err)
        }

        socketRef.current.on('connect', () => {
            setConnected(true);
            console.log('socket ref in hooks:',socketRef)
        });
        socketRef.current.on('disconnect', () => {
            setConnected(false);
        });


        socketRef.current.on('message', function (msg) {
            console.log('this is msg recieve real time:',msg)
            setNewMsg(msg)
        });


        return () => {
            if(socketRef.current){
                socketRef.current.disconnect()
                socketRef.current.off('connect')
                socketRef.current.off('disconnect');
            }

        };
    } ,[])


    return [socketRef,connected];
}


export default useSocket;
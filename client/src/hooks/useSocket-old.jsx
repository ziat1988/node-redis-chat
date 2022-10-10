import {useEffect, useRef, useState} from "react";
import io from "socket.io-client";

/*
const options =  {
   // transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 'Infinity',
    forceNew: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    autoConnect: true,
   // secure: true,
}
*/
const socket = io("http://localhost:8000");

const useSocketOld = ()=>{

    const [connected, setConnected] = useState(socket.connected);
    /** First of all it's necessary to handle the socket io connection */
    const socketRef = useRef(null);
    //const userLogged = useUserStore(state=>state.userLogged)
    socketRef.current = socket;
    console.log('use socket run')
    useEffect(()=>{
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
            console.log('socket will be unmount?')
            setConnected(false);
        });



        return () => {
            console.log('this will be unmount')
            if(socketRef.current){
                socketRef.current.disconnect()
                socketRef.current.off('connect')
                socketRef.current.off('disconnect');
                socketRef.current.off('message');
            }

        };
    } ,[])


    return [socketRef,connected];
}


export default useSocketOld;
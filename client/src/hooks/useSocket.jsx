import {useEffect, useRef, useState} from "react";
import io from "socket.io-client";

const useSocket = (roomId)=>{
    const [connected, setConnected] = useState(false);
    /** First of all it's necessary to handle the socket io connection */
    const socketRef = useRef(null);
    const socket = io("http://localhost:8000");


    useEffect(()=>{
        socketRef.current = socket


        // Handling connection errors
        socketRef.current.on('connect_error',(err)=>handleError(err))
        socketRef.current.on('connect_failed',(err)=>handleError(err))

        const handleError = (err)=> {
            console.log(err)
        }


        socketRef.current.on('message', function (msg) {
            console.log('this is msg recieve real time:',msg)
        });


        return () => {
            if(socketRef.current){
                socketRef.current.disconnect()
            }
            //socket.off('connect');
            //socket.off('disconnect');
        };
    } ,[])

    /*

    useEffect(() => {
        if (socket !== null) {
            socket.connect();
        } else {
            socketRef.current = io("http://localhost:8000");
        }
        setConnected(true);

    }, [socket]);
    */
    /*
    useEffect(()=> {

        socket.on('connect', () => {
            setConnected(true);
        });
        socket.on('disconnect', () => {
            setConnected(false);
        });

        socket.on('message', function (msg) {
            console.log('this is msg recieve real time:',msg)
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };

    },[])
    */

    return [socketRef,connected];
}


export default useSocket;
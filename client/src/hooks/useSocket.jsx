import io from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import useUserStore from "../store/useUserStore.jsx";

const test = io("http://localhost:8000")
const x = io("http://localhost:8000")
const useSocket = (userLogged)=>{

  //  console.log(test);
   // console.log(x)

    const [connected, setConnected] = useState(false);
    const [socket,setSocket] = useState(null)
    //const userLogged = useUserStore(state=>state.userLogged);
  //  const socketRef = useRef(null);
//    const socket = socketRef.current;

    // handle connection first

    useEffect(()=>{
        setSocket(io("http://localhost:8000"))
    },[]) // useEffect will be trigged when socket or userCurrent change


    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('vo day connect')
           // setSocketConnected(socket.connected);
           // subscribeToDateEvent();
        });
        socket.on('disconnect', () => {
           // setSocketConnected(socket.connected);
        });



    }, [socket]);

    /*
    useEffect(()=>{
        console.log('useEffect 2 :',socket)
        socket?.on("connect",()=>{
            setConnected(true)
        })
    },[socketRef.current])
    */


    return [socket,connected]
}

export default useSocket;
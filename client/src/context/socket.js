import io from "socket.io-client";
import React from "react";
//TODO: url in env
export const socket = io("http://localhost:8000");  // option reconnect not work here

export const SocketContext = React.createContext({});

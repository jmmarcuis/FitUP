// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import Messages from '../components/Dashboard/Messages';

// Create Context
type SocketContextType = Socket | null;
const SocketContext = createContext<SocketContextType>(null);

// Custom Hook
export const useMessageContext = () => {
  return useContext(SocketContext);
};


  // Create a custom hook for easy use of the SocketContext
  export const useSocket = (): SocketContextType => {
    return useContext(SocketContext);
  };
  
  // Create the provider component for managing socket connection
  export const MessageProvider: React.FC = ({  }) => {
    const [socket, setSocket] = useState<SocketContextType>(null);
    const token = localStorage.getItem('token'); // Ensure token is stored

    useEffect(() => {
      if (!token) return;
  
      // Initialize Socket.IO client and authenticate using token
      const newSocket = io('http://localhost:5000', {
        query: { token },
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
  
      // Set the socket instance in state
      setSocket(newSocket);
  
      // Log connection and disconnection events
      newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });
  
      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });
  
      // Cleanup the socket instance on component unmount
      return () => {
        newSocket.close();
      };
    }, [token]);
  
    return (
      <SocketContext.Provider value={socket}>
        <Messages/>
      </SocketContext.Provider>
    );
  };
  
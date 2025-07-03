import React, { createContext, useContext, ReactNode } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

interface WebSocketContextType {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent<any> | null;
  readyState: ReadyState;
  connectionStatus: string;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3001",
    {
      onOpen: () => {
        console.log("Connected to WebSocket server");
      },
      onClose: () => {
        console.log("Disconnected from WebSocket server");
      },
      onError: (error) => {
        console.error("WebSocket error:", error);
      },
      shouldReconnect: () => true,
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const value = {
    sendMessage,
    lastMessage,
    readyState,
    connectionStatus,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface WebSocketContextType {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent<string> | null;
  readyState: ReadyState;
  connectionStatus: string;
  connect: (code: string) => void;

  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
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
      shouldReconnect: () => true, // Let the 'connect' boolean handle reconnect logic
    },
    // This is the corrected line:
    socketUrl !== null // Only connect when socketUrl is not null
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const connect = useCallback((code: string) => {
    setSocketUrl(`ws://localhost:3000/ws/${code}`);
  }, []);

  const disconnect = useCallback(() => {
    // Setting the URL to null will trigger the disconnect
    setSocketUrl(null);
  }, []);

  const value = {
    sendMessage,
    lastMessage,
    readyState,
    connectionStatus,
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};

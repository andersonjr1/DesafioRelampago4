import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface WebSocketContextType {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent<string> | null;
  readyState: ReadyState;
  connectionStatus: string;
  connect: () => void;
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

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
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
      shouldReconnect: () => socketUrl !== null,
    },
    socketUrl === null // Don't connect when socketUrl is null
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const connect = useCallback(() => {
    if (socketUrl === null) {
      setSocketUrl("ws://localhost:3000");
    }
  }, [socketUrl]);

  const disconnect = useCallback(() => {
    const ws = getWebSocket();
    if (ws) {
      ws.close();
    }
    setSocketUrl(null);
  }, [getWebSocket]);

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

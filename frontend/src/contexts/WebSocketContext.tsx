import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

// Define the shape of the context value
interface WebSocketContextType {
  sendMessage: (message: string) => void;
  lastMessage: MessageEvent<string> | null;
  readyState: ReadyState;
  connectionStatus: string;
  connect: (code: string, onFailure?: () => void) => void;
  disconnect: () => void;
}

// Create the context
const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// Define the props for the provider component
interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  // useRef to store the number of reconnect attempts
  const reconnectAttempts = useRef(0);
  // useRef to store the failure callback function
  const onFailureCallback = useRef<(() => void) | null>(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        reconnectAttempts.current = 0;
      },
      onClose: () => {},
      onError: (error) => {
        console.error("WebSocket error:", error);
      },
      // This function determines if a reconnect should be attempted
      shouldReconnect: () => {
        if (reconnectAttempts.current < 3) {
          reconnectAttempts.current += 1;
          return true; // Attempt to reconnect
        }
        return false; // Stop reconnecting
      },
      // Set the interval between reconnection attempts to 5 seconds
      reconnectInterval: 5000,
    },
    // Only connect if socketUrl is not null
    socketUrl !== null
  );

  // This effect runs when the readyState changes
  useEffect(() => {
    // Check if the connection is permanently closed after all retries
    if (readyState === ReadyState.CLOSED && reconnectAttempts.current >= 3) {
      // If a failure callback was provided, execute it
      if (onFailureCallback.current) {
        onFailureCallback.current();
      }
      // Reset the callback ref to prevent it from being called again
      onFailureCallback.current = null;
    }
  }, [readyState]);

  // Map ReadyState enum to human-readable status strings
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  // Function to initiate a connection
  const connect = useCallback((code: string, onFailure?: () => void) => {
    // Reset attempts for the new connection
    reconnectAttempts.current = 0;
    // Store the provided callback function in the ref
    onFailureCallback.current = onFailure || null;
    // Set the WebSocket URL to trigger the connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/${code}`;
    setSocketUrl(wsUrl);
  }, []);

  // Function to disconnect
  const disconnect = useCallback(() => {
    // Setting the URL to null will trigger the disconnect in useWebSocket
    setSocketUrl(null);
  }, []);

  // The value provided to consumers of the context
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

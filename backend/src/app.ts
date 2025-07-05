import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer } from "ws";
import url from "url";
import stream from "stream";
import cookieParser from "cookie-parser";
import cookie from "cookie";

import { verifyTokenForWebSocket } from "./utils/verifyTokenForwebSocket";

import { router } from "./routes";
import { config } from "./config";
import cors from "cors";
import { initializeUnoGameService, UnoWebSocket } from "./services/unoGameService";

const app = express();
const PORT = config.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../frontend")));

// Routes
app.use("/api", router);

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Initialize UNO game service
initializeUnoGameService(wss);

// WebSocket authentication function


// Handle WebSocket upgrade
server.on(
  "upgrade",
  async (
    request: http.IncomingMessage,
    socket: stream.Duplex,
    head: Buffer
  ) => {
    const pathname = request.url ? url.parse(request.url).pathname : "";
    const wsPathRegex = /^\/ws\/([a-zA-Z0-9]+)$/;
    const match = pathname?.match(wsPathRegex);

    if (!match) {
      socket.destroy();
      return;
    }
    const roomCode = match[1];

    // Parse cookies for authentication
    const cookies = cookie.parse(request.headers.cookie || "");
    const tokenFromCookie = cookies.token;
    if(tokenFromCookie){
      const clientData = await verifyTokenForWebSocket(tokenFromCookie)

      if (!clientData) {
      console.log("WebSocket authentication failed: Invalid or missing token.");
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      // Cast WebSocket to UnoWebSocket and add custom properties
      const customWs = ws as UnoWebSocket;
      customWs.playerId = clientData.id as string;
      customWs.playerName = clientData.name as string;
      customWs.currentRoomId = roomCode;

      console.log("WebSocket handshake successful. Client authenticated.", {
        playerId: customWs.playerId,
        playerName: customWs.playerName,
        roomCode
      });
      
      wss.emit("connection", customWs, request);
    });
    }
  }
);

// Start server
server.listen(PORT, () => {
  console.log(`HTTP and WebSocket server running: http://localhost:${PORT}`);
});


app.listen(config.PORT, () =>
  console.log(`Servidor rodando na porta ${config.PORT}`)
);

import { WebSocket, WebSocketServer } from "ws";

// Extend WebSocket class to add custom properties
export class UnoWebSocket extends WebSocket {
  playerId!: string;
  playerName!: string;
  currentRoomId!: string;
}

// Types for UNO game
type UnoMessageType =
  | 'CREATE_ROOM'
  | 'JOIN_ROOM'
  | 'DELETE_ROOM'
  | 'START_GAME'
  | 'PLAY_CARD'
  | 'BUY_CARD'
  | 'SKIP_ROUND'
  | 'YELL_UNO'
  | 'ACCUSE_NO_UNO'
  | 'CHOOSE_COLOR'
  | 'RECONNECT'
  | 'DISCONNECT';

type UnoServerMessageType =
  | 'CREATE_ROOM'
  | 'JOIN_ROOM'
  | 'DELETE_ROOM'
  | 'START_GAME'
  | 'UPDATE_ROOM'
  | 'ERROR'
  | 'PLAYER_RECONNECTED'
  | 'PLAYER_DISCONNECTED'
  | 'GAME_FINISHED';

type GameStatus = "WAITING" | "IN_GAME" | "FINISHED";
type GameDirection = "clockwise" | "anticlockwise";
type AdditionalState = "CHOOSING_COLOR" | "PLAYER_DISCONNECTED" | null;

interface Card {
  color: string;
  value: string;
  chosenColor?: string;
}

interface UnoPlayer {
  id: string;
  ws: UnoWebSocket | null;
  name: string;
  cardCount?: number;
  alreadyBought?: boolean;
  isTheirTurn?: boolean;
  disconnected?: boolean;
  yelledUno?: boolean;
  hand?: Card[];
}

interface UnoRoom {
  id: string;
  ownerId: string;
  roomName: string;
  canStart: boolean;
  status?: GameStatus;
  currentCard?: Card;
  gameDirection?: GameDirection;
  currentPlayerId?: string;
  additionalState?: AdditionalState;
  players: Map<string, UnoPlayer>;
}

interface UnoClientMessage {
  type: UnoMessageType;
  payload: any;
}

interface UnoServerMessage {
  type: UnoServerMessageType;
  payload: any;
}

interface RoomStateForApi {
  id: string;
  roomName: string;
  ownerId: string;
  status: GameStatus;
  canStart: boolean;
  currentCard?: Card;
  gameDirection?: GameDirection;
  currentPlayerId?: string;
  additionalState?: AdditionalState;
  players: {
    id: string;
    name: string;
    cardCount: number;
    isTheirTurn: boolean;
    disconnected: boolean;
    yelledUno: boolean;
    alreadyBought: boolean;
    isOnline: boolean;
  }[];
  playerHand?: Card[];
}

// UNO Cards definition
const unoCards: Card[] = [
  // Blue cards
  { color: "blue", value: "0" },
  { color: "blue", value: "1" },
  { color: "blue", value: "2" },
  { color: "blue", value: "3" },
  { color: "blue", value: "4" },
  { color: "blue", value: "5" },
  { color: "blue", value: "6" },
  { color: "blue", value: "7" },
  { color: "blue", value: "8" },
  { color: "blue", value: "9" },
  { color: "blue", value: "Skip" },
  { color: "blue", value: "Reverse" },
  { color: "blue", value: "Draw Two" },
  // Green cards
  { color: "green", value: "0" },
  { color: "green", value: "1" },
  { color: "green", value: "2" },
  { color: "green", value: "3" },
  { color: "green", value: "4" },
  { color: "green", value: "5" },
  { color: "green", value: "6" },
  { color: "green", value: "7" },
  { color: "green", value: "8" },
  { color: "green", value: "9" },
  { color: "green", value: "Skip" },
  { color: "green", value: "Reverse" },
  { color: "green", value: "Draw Two" },
  // Red cards
  { color: "red", value: "0" },
  { color: "red", value: "1" },
  { color: "red", value: "2" },
  { color: "red", value: "3" },
  { color: "red", value: "4" },
  { color: "red", value: "5" },
  { color: "red", value: "6" },
  { color: "red", value: "7" },
  { color: "red", value: "8" },
  { color: "red", value: "9" },
  { color: "red", value: "Skip" },
  { color: "red", value: "Reverse" },
  { color: "red", value: "Draw Two" },
  // Yellow cards
  { color: "yellow", value: "0" },
  { color: "yellow", value: "1" },
  { color: "yellow", value: "2" },
  { color: "yellow", value: "3" },
  { color: "yellow", value: "4" },
  { color: "yellow", value: "5" },
  { color: "yellow", value: "6" },
  { color: "yellow", value: "7" },
  { color: "yellow", value: "8" },
  { color: "yellow", value: "9" },
  { color: "yellow", value: "Skip" },
  { color: "yellow", value: "Reverse" },
  { color: "yellow", value: "Draw Two" },
  // Wild cards
  { color: "black", value: "Wild" },
  { color: "black", value: "Wild Draw Four" },
];

// Game state
const rooms = new Map<string, UnoRoom>();
const playerConnections = new Map<string, UnoWebSocket>();

function getRandomCard(): Card {
  return unoCards[Math.floor(Math.random() * unoCards.length)];
}

function dealCards(count: number): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(getRandomCard());
  }
  return cards;
}

function isValidPlay(card: Card, currentCard: Card): boolean {
  if (card.color === 'black') return true; // Wild cards
  if (currentCard.chosenColor) {
    return card.color === currentCard.chosenColor || card.color === 'black';
  }
  return card.color === currentCard.color || card.value === currentCard.value;
}

function log(message: string, data?: any): void {
  console.log(`[UNO Game Service] ${message}`, data || '');
}

/**
 * Sends a typed message to a UNO WebSocket client
 */
export function sendToUnoClient<T extends UnoServerMessageType>(
  ws: UnoWebSocket,
  type: T,
  payload: any
): void {
  if (ws.readyState !== WebSocket.OPEN) {
    log(`Attempt to send to closed WebSocket`, { playerId: ws.playerId, type, payload });
    return;
  }
  const message = { type, payload };
  ws.send(JSON.stringify(message));
  log(`Message sent to client ${ws.playerName}`, { type, payload });
}

function handlePlayerConnect(ws: UnoWebSocket): void {
  console.log("tentando conectar")
  const roomId = ws.currentRoomId;
  const room = rooms.get(roomId);

  if (!room) {
    log(`Connection attempt to non-existent room: ${roomId}`, { playerId: ws.playerId });
    sendToUnoClient(ws, "ERROR", { message: "Sala não encontrada ou já foi fechada." });
    ws.close();
    return;
  }

  const player = room.players.get(ws.playerId);
  if (player) {
    // Handle reconnection
    const isReconnection = player.ws === null;
    player.ws = ws;
    player.disconnected = false;
    log(`Player ${ws.playerName} connected/reconnected to room ${roomId}`, { playerId: ws.playerId });

    if (isReconnection) {
      // Notify other players about reconnection
      broadcastToRoom(room, {
        type: 'PLAYER_RECONNECTED',
        payload: {
          playerId: ws.playerId,
          playerName: ws.playerName,
          message: `${ws.playerName} reconectou-se!`
        }
      }, ws.playerId);
    }
  } else {
    // New player joining
    if (isPlayerInAnyRoom(ws.playerId)) {
      log(`Player ${ws.playerName} tried to join room ${roomId} but is already in another room`, { playerId: ws.playerId });
      sendToUnoClient(ws, "ERROR", { message: "Você já está em outra sala. Saia da sala atual para poder entrar em uma nova." });
      ws.close();
      return;
    }

    if (room.players.size >= 4) {
      sendToUnoClient(ws, "ERROR", { message: "Sala está cheia" });
      ws.close();
      return;
    }

    if (room.status !== 'WAITING') {
      sendToUnoClient(ws, "ERROR", { message: "Jogo já iniciado" });
      ws.close();
      return;
    }

    const newPlayer: UnoPlayer = {
      id: ws.playerId,
      ws,
      name: ws.playerName,
      disconnected: false
    };

    room.players.set(ws.playerId, newPlayer);
    room.canStart = room.players.size >= 3;
    log(`Player ${ws.playerName} joined room ${roomId}`, { playerId: ws.playerId });
  }

  broadcastRoomState(room);
}

function broadcastRoomState(room: UnoRoom): void {
  log(`Broadcasting room state for room ${room.id}`);
  
  room.players.forEach((player) => {
    if (player.ws && player.ws.readyState === WebSocket.OPEN) {
      const personalRoomState = getRoomStateForApi(room, player.id);
      sendToUnoClient(player.ws, "UPDATE_ROOM", personalRoomState);
    }
  });
}

function broadcastToRoom(room: UnoRoom, message: any, excludePlayerId?: string): void {
  room.players.forEach((player) => {
    if (!player.disconnected && player.id !== excludePlayerId && player.ws && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(message));
    }
  });
}

function isPlayerInAnyRoom(playerId: string): boolean {
  for (const room of rooms.values()) {
    if (room.players.has(playerId)) {
      return true;
    }
  }
  return false;
}

function getNextPlayer(room: UnoRoom): UnoPlayer | null {
  const playerIds = Array.from(room.players.keys());
  const currentIndex = playerIds.findIndex(id => id === room.currentPlayerId);
  if (currentIndex === -1) return null;
  
  const direction = room.gameDirection === 'clockwise' ? 1 : -1;
  let nextIndex = (currentIndex + direction + playerIds.length) % playerIds.length;
  
  // Skip disconnected players
  let attempts = 0;
  while (room.players.get(playerIds[nextIndex])?.disconnected && attempts < playerIds.length) {
    nextIndex = (nextIndex + direction + playerIds.length) % playerIds.length;
    attempts++;
  }
  
  return attempts < playerIds.length ? room.players.get(playerIds[nextIndex]) || null : null;
}

function updatePlayerTurns(room: UnoRoom): void {
  room.players.forEach(player => {
    player.isTheirTurn = player.id === room.currentPlayerId;
    player.alreadyBought = false;
  });
}

function getRoomStateForApi(room: UnoRoom, currentPlayerId?: string): RoomStateForApi {
  const currentPlayer = currentPlayerId ? room.players.get(currentPlayerId) : null;
  
  const state: RoomStateForApi = {
    id: room.id,
    roomName: room.roomName,
    ownerId: room.ownerId,
    status: room.status || 'WAITING',
    canStart: room.canStart,
    currentCard: room.currentCard,
    gameDirection: room.gameDirection,
    currentPlayerId: room.currentPlayerId,
    additionalState: room.additionalState,
    players: Array.from(room.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      cardCount: p.hand ? p.hand.length : 0,
      isTheirTurn: p.isTheirTurn || false,
      disconnected: p.disconnected || false,
      yelledUno: p.yelledUno || false,
      alreadyBought: p.alreadyBought || false,
      isOnline: p.ws !== null
    }))
  };
  
  if (currentPlayer && currentPlayer.hand) {
    state.playerHand = currentPlayer.hand;
  }
  
  return state;
}

function handleClientMessage(ws: UnoWebSocket, data: UnoClientMessage): void {
  const room = rooms.get(ws.currentRoomId);
  if (!room) {
    return sendToUnoClient(ws, "ERROR", { message: "Você não está em uma sala ativa." });
  }

  const player = room.players.get(ws.playerId);
  if (!player) {
    return sendToUnoClient(ws, "ERROR", { message: "Você não é um participante desta sala." });
  }

  switch (data.type) {
    case "START_GAME":
      if (player.id === room.ownerId) handleStartGame(ws, room);
      else sendToUnoClient(ws, "ERROR", { message: "Apenas o dono da sala pode iniciar o jogo." });
      break;
    case "PLAY_CARD":
      handlePlayCard(ws, room, data.payload);
      break;
    case "BUY_CARD":
      handleBuyCard(ws, room);
      break;
    case "SKIP_ROUND":
      handleSkipRound(ws, room);
      break;
    case "YELL_UNO":
      handleYellUno(ws, room);
      break;
    case "CHOOSE_COLOR":
      handleChooseColor(ws, room, data.payload);
      break;
    case "DELETE_ROOM":
      if (player.id === room.ownerId) handleCloseRoom(ws, room);
      else sendToUnoClient(ws, "ERROR", { message: "Apenas o dono da sala pode fechá-la." });
      break;
  }
}

function handleStartGame(ws: UnoWebSocket, room: UnoRoom): void {
  if (room.players.size < 3) {
    sendToUnoClient(ws, "ERROR", { message: "Mínimo de 3 jogadores necessário" });
    return;
  }
  
  // Initialize game
  room.status = 'IN_GAME';
  room.gameDirection = 'clockwise';
  room.additionalState = null;
  
  // Deal 7 cards to each player
  room.players.forEach(player => {
    player.hand = dealCards(7);
    player.alreadyBought = false;
    player.yelledUno = false;
  });
  
  // Choose random starting player
  const playerIds = Array.from(room.players.keys());
  const randomIndex = Math.floor(Math.random() * playerIds.length);
  room.currentPlayerId = playerIds[randomIndex];
  
  // Initial card (cannot be special)
  let initialCard: Card;
  do {
    initialCard = getRandomCard();
  } while (initialCard.color === 'black' || ['Skip', 'Reverse', 'Draw Two'].includes(initialCard.value));
  
  room.currentCard = initialCard;
  updatePlayerTurns(room);
  
  broadcastRoomState(room);
  log(`Game started in room ${room.id}`);
}

function handlePlayCard(ws: UnoWebSocket, room: UnoRoom, payload: { card: Card }): void {
  const player = room.players.get(ws.playerId);
  if (!player) return;
  
  if (room.status !== 'IN_GAME') {
    return sendToUnoClient(ws, "ERROR", { message: "Jogo não está em andamento" });
  }
  
  if (!player.isTheirTurn) {
    return sendToUnoClient(ws, "ERROR", { message: "Não é sua vez" });
  }
  
  const { card } = payload;
  if (!card || !player.hand) {
    return sendToUnoClient(ws, "ERROR", { message: "Carta inválida" });
  }
  
  // Check if player has the card
  const cardIndex = player.hand.findIndex(c => 
    c.color === card.color && c.value === card.value
  );
  
  if (cardIndex === -1) {
    return sendToUnoClient(ws, "ERROR", { message: "Você não possui esta carta" });
  }
  
  // Check if play is valid
  if (!isValidPlay(card, room.currentCard!)) {
    return sendToUnoClient(ws, "ERROR", { message: "Jogada inválida" });
  }
  
  // Remove card from hand
  player.hand.splice(cardIndex, 1);
  player.yelledUno = false;
  
  // Update current card
  room.currentCard = { ...card };
  
  // Check win condition
  if (player.hand.length === 0) {
    room.status = 'FINISHED';
    broadcastToRoom(room, {
      type: 'UPDATE_ROOM',
      payload: {
        winner: player.name,
        ...getRoomStateForApi(room)
      }
    });
    return;
  }
  
  // Apply card effects
  let skipNext = false;
  
  switch (card.value) {
    case 'Skip':
      skipNext = true;
      break;
      
    case 'Reverse':
      room.gameDirection = room.gameDirection === 'clockwise' ? 'anticlockwise' : 'clockwise';
      if (room.players.size === 2) {
        skipNext = true;
      }
      break;
      
    case 'Draw Two': {
      const nextPlayer = getNextPlayer(room);
      if (nextPlayer && nextPlayer.hand) {
        nextPlayer.hand.push(...dealCards(2));
      }
      skipNext = true;
      break;
    }
    
    case 'Wild':
      room.additionalState = 'CHOOSING_COLOR';
      break;
      
    case 'Wild Draw Four': {
      const nextPlayer = getNextPlayer(room);
      if (nextPlayer && nextPlayer.hand) {
        nextPlayer.hand.push(...dealCards(4));
      }
      room.additionalState = 'CHOOSING_COLOR';
      skipNext = true;
      break;
    }
  }
  
  // Advance turn
  if (room.additionalState !== 'CHOOSING_COLOR') {
    let nextPlayer = getNextPlayer(room);
    if (skipNext && nextPlayer) {
      nextPlayer = getNextPlayer(room);
    }
    if (nextPlayer) {
      room.currentPlayerId = nextPlayer.id;
    }
    updatePlayerTurns(room);
  }
  
  broadcastRoomState(room);
}

function handleBuyCard(ws: UnoWebSocket, room: UnoRoom): void {
  const player = room.players.get(ws.playerId);
  if (!player) return;
  
  if (!player.isTheirTurn) {
    return sendToUnoClient(ws, "ERROR", { message: "Não é sua vez" });
  }
  
  if (player.alreadyBought) {
    return sendToUnoClient(ws, "ERROR", { message: "Você já comprou uma carta nesta rodada" });
  }
  
  if (!player.hand) {
    return sendToUnoClient(ws, "ERROR", { message: "Erro no estado do jogo" });
  }

  if (player.yelledUno) {
    player.yelledUno = false;
  }
  
  // Buy card
  const newCard = getRandomCard();
  player.hand.push(newCard);
  player.alreadyBought = true;
  
  broadcastRoomState(room);
}

function handleSkipRound(ws: UnoWebSocket, room: UnoRoom): void {
  const player = room.players.get(ws.playerId);
  if (!player) return;
  
  if (!player.isTheirTurn) {
    return sendToUnoClient(ws, "ERROR", { message: "Não é sua vez" });
  }
  
  if (!player.alreadyBought) {
    return sendToUnoClient(ws, "ERROR", { message: "Você deve comprar uma carta antes de passar a vez" });
  }
  
  // Pass turn
  const nextPlayer = getNextPlayer(room);
  if (nextPlayer) {
    room.currentPlayerId = nextPlayer.id;
  }
  
  updatePlayerTurns(room);
  broadcastRoomState(room);
}

function handleYellUno(ws: UnoWebSocket, room: UnoRoom): void {
  const player = room.players.get(ws.playerId);
  if (!player) return;
  
  if (!player.hand || player.hand.length !== 1) {
    return sendToUnoClient(ws, "ERROR", { message: "Você só pode gritar UNO quando tiver exatamente 1 carta" });
  }
  
  player.yelledUno = true;
  
  broadcastToRoom(room, {
    type: 'UPDATE_ROOM',
    payload: {
      message: `${player.name} gritou UNO!`,
      ...getRoomStateForApi(room)
    }
  });
}

function handleChooseColor(ws: UnoWebSocket, room: UnoRoom, payload: { color: string }): void {
  const player = room.players.get(ws.playerId);
  if (!player) return;
  
  if (!player.isTheirTurn || room.additionalState !== 'CHOOSING_COLOR') {
    return sendToUnoClient(ws, "ERROR", { message: "Não é possível escolher cor agora" });
  }
  
  const { color } = payload;
  if (!['red', 'blue', 'green', 'yellow'].includes(color)) {
    return sendToUnoClient(ws, "ERROR", { message: "Cor inválida" });
  }
  
  if (room.currentCard) {
    room.currentCard.chosenColor = color;
  }
  room.additionalState = null;
  
  // Advance turn
  const nextPlayer = getNextPlayer(room);
  if (nextPlayer) {
    room.currentPlayerId = nextPlayer.id;
  }
  updatePlayerTurns(room);
  
  broadcastRoomState(room);
}

function handleCloseRoom(ws: UnoWebSocket, room: UnoRoom): void {
  log(`Room ${room.id} is being closed by owner ${ws.playerName}`);
  
  broadcastToRoom(room, {
    type: 'DELETE_ROOM',
    payload: { message: `A sala ${room.roomName} foi fechada pelo dono.` }
  });
  
  // Remove player connections
  room.players.forEach(player => {
    if (player.ws) {
      playerConnections.delete(player.ws.playerId);
      player.ws.currentRoomId = "";
    }
  });
  
  rooms.delete(room.id);
}

function handlePlayerDisconnect(ws: UnoWebSocket): void {
  const room = rooms.get(ws.currentRoomId);
  if (!room) return;

  const player = room.players.get(ws.playerId);
  if (player) {
    player.ws = null;
    player.disconnected = true;
    log(`Player ${ws.playerName} disconnected from room ${room.id}`);

    // Notify other players about disconnection
    broadcastToRoom(room, {
      type: 'PLAYER_DISCONNECTED',
      payload: {
        playerId: ws.playerId,
        playerName: ws.playerName,
        message: `${ws.playerName} se desconectou.`
      }
    }, ws.playerId);

    broadcastRoomState(room);
  }
}

// API functions for external use
function createRoomForApi(playerId: string, playerName: string, roomName: string): RoomStateForApi {
  if (isPlayerInAnyRoom(playerId)) {
    throw new Error("Você já está em uma sala.");
  }
  console.log(roomName, playerId, playerName)


  const roomId = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  const room: UnoRoom = {
    id: roomId,
    ownerId: playerId,
    roomName,
    canStart: false,
    status: 'WAITING',
    players: new Map()
  };

  const player: UnoPlayer = {
    id: playerId,
    ws: null,
    name: playerName,
    disconnected: false
  };

  room.players.set(playerId, player);
  rooms.set(roomId, room);
  
  log(`Room ${roomId} created by ${playerName} via API`);
  return getRoomStateForApi(room, playerId);
}

function getAvailableRoomsForApi(): RoomStateForApi[] {
  return Array.from(rooms.values()).map(room => getRoomStateForApi(room));
}

function joinRoomForApi(playerId: string, playerName: string, roomId: string): RoomStateForApi {
  const room = rooms.get(roomId);
  if (!room) {
    throw new Error("Sala não encontrada");
  }
  
  if (room.players.size >= 4) {
    throw new Error("Sala está cheia");
  }
  
  if (room.status !== 'WAITING') {
    throw new Error("Jogo já iniciado");
  }
  
  if (isPlayerInAnyRoom(playerId)) {
    throw new Error("Você já está em uma sala");
  }

  const player: UnoPlayer = {
    id: playerId,
    ws: null,
    name: playerName,
    disconnected: false
  };

  room.players.set(playerId, player);
  room.canStart = room.players.size >= 3;
  
  log(`Player ${playerName} joined room ${roomId} via API`);
  return getRoomStateForApi(room, playerId);
}

/**
 * Initialize the UNO game service with WebSocket server
 */
export function initializeUnoGameService(wss: WebSocketServer): void {
  wss.on("connection", (ws: UnoWebSocket, request: any) => {
    // Extract player info from query parameters or headers
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const roomId = url.pathname.split('/').pop() || '';

    ws.currentRoomId = roomId;
    
    log(`New WebSocket connection for player ${ws.playerName} to room ${roomId}`);
    
    playerConnections.set(ws.playerId, ws);

    if (roomId) {
      handlePlayerConnect(ws);
    }

    ws.on("message", (message) => {
      try {
        const data: UnoClientMessage = JSON.parse(message.toString());
        log("Message received", { playerId : ws.playerId, data });
        handleClientMessage(ws, data);
      } catch (error: any) {
        log("Error parsing JSON message", { playerId: ws.playerId, error: error.message, originalMessage: message.toString() });
      }
    });

    ws.on("close", () => {
      log("Client disconnected", { playerId: ws.playerId });
      playerConnections.delete(ws.playerId);
      handlePlayerDisconnect(ws);
    });

    ws.on("error", (error) => {
      log("WebSocket error", { playerId: ws.playerId, error: error.message });
    });
  });
}

// Export API functions
export {
  createRoomForApi,
  getAvailableRoomsForApi,
  joinRoomForApi,
  UnoRoom,
  UnoPlayer,
  RoomStateForApi
};
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const unoCards = [
  // Cartas Azuis
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
  { color: "blue", value: "Skip" }, // Pular
  { color: "blue", value: "Reverse" }, // Inverter
  { color: "blue", value: "Draw Two" }, // Comprar Duas

  // Cartas Verdes
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

  // Cartas Vermelhas
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

  // Cartas Amarelas
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

  // Cartas Curinga
  { color: "black", value: "Wild" }, // Curinga
  { color: "black", value: "Wild Draw Four" }, // Curinga Comprar Quatro
];

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
// Middleware para parsing JSON
app.use(express.json());
// Define as mensagens que o servidor pode receber.
/**
 * Define os tipos de mensagens que o servidor pode RECEBER de um cliente.
 * Cada tipo corresponde a uma ação que o jogador pode realizar.
 */
type MessageType =
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

// Define as mensagens que o servidor pode enviar.
type ServerMessageType =
  | 'CREATE_ROOM'
  | 'JOIN_ROOM'
  | 'DELETE_ROOM'
  | 'START_GAME'
  // | 'UPDATE_HAND'
  | 'UPDATE_ROOM'
  // | 'UPDATE_PLAYER'
  | 'ERROR';

type GameStatus = "WAITING" | "IN_GAME" | "FINISHED";

type GameDirection = "clockwise" | "anticlockwise";

type AdditionalState = "CHOOSING_COLOR" | "PLAYER_DISCONNECTED" | null;

interface Card {
  color: string;
  value: string;
  chosenColor?: string;
}

interface Player {
  id: string;
  ws: WebSocket;
  name: string;
  cardCount?: number;
  alreadyBought?: boolean;
  isTheirTurn?: boolean;
  disconnected?: boolean;
  yelledUno?: boolean;
  hand?: Card[];
}

interface Room {
  // --- Propriedades da Sala (Lobby) ---
  id: string;
  ownerId: string;
  roomName: string;
  canStart: boolean;

  // --- Propriedades do Jogo ---
  status?: GameStatus;
  currentCard?: Card;
  gameDirection?: GameDirection;
  currentPlayerId?: string;
  additionalState?: AdditionalState;

  // --- Lista de Jogadores ---
  players: Player[];
}

// Armazenar clientes conectados e salas
const rooms = new Map<string, Room>();
const playerConnections = new Map<string, { playerId: string; roomId: string }>();

function generateId(): string {
  return uuidv4();
}

function gerarPlayerName() {
  // Listas de palavras que farão parte do nome
  const adjetivos = ["Rapido", "Sombrio", "Furtivo", "Lendario", "Brutal", "Mistico", "Dourado", "Gelido", "Insano"];
  const substantivos = ["Lobo", "Dragao", "Fantasma", "Cacador", "Mago", "Guerreiro", "Tigre", "Corvo", "Executor"];

  // Escolhe uma palavra aleatória de cada lista
  const adjetivoAleatorio = adjetivos[Math.floor(Math.random() * adjetivos.length)];
  const substantivoAleatorio = substantivos[Math.floor(Math.random() * substantivos.length)];

  // Gera um número aleatório (ex: entre 10 e 99) para dar um toque final
  const numeroAleatorio = Math.floor(Math.random() * 90) + 10;

  // Junta tudo para formar o nome final
  return `${adjetivoAleatorio}${substantivoAleatorio}${numeroAleatorio}`;
}

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

function getNextPlayer(room: Room): Player | null {
  const currentIndex = room.players.findIndex(p => p.id === room.currentPlayerId);
  if (currentIndex === -1) return null;
  
  const direction = room.gameDirection === 'clockwise' ? 1 : -1;
  let nextIndex = (currentIndex + direction + room.players.length) % room.players.length;
  
  // Skip disconnected players
  let attempts = 0;
  while (room.players[nextIndex].disconnected && attempts < room.players.length) {
    nextIndex = (nextIndex + direction + room.players.length) % room.players.length;
    attempts++;
  }
  
  return attempts < room.players.length ? room.players[nextIndex] : null;
}

function broadcastToRoom(room: Room, message: any, excludePlayerId?: string) {
  room.players.forEach(player => {
    if (!player.disconnected && player.id !== excludePlayerId && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(message));
    }
  });
}

function sendToPlayer(player: Player, message: any) {
  if (!player.disconnected && player.ws.readyState === WebSocket.OPEN) {
    player.ws.send(JSON.stringify(message));
  }
}

function updatePlayerTurns(room: Room) {
  room.players.forEach(player => {
    player.isTheirTurn = player.id === room.currentPlayerId;
    player.alreadyBought = false;
  });
}

function checkWinCondition(room: Room): Player | null {
  return room.players.find(player => player.hand && player.hand.length === 0) || null;
}

function getRoomState(room: Room, forPlayer?: Player): any {
  const state = {
    type: 'UPDATE_ROOM',
    room: {
      id: room.id,
      roomName: room.roomName,
      ownerId: room.ownerId,
      status: room.status,
      canStart: room.canStart,
      currentCard: room.currentCard,
      gameDirection: room.gameDirection,
      currentPlayerId: room.currentPlayerId,
      additionalState: room.additionalState,
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        cardCount: p.hand ? p.hand.length : 0,
        isTheirTurn: p.isTheirTurn,
        disconnected: p.disconnected,
        yelledUno: p.yelledUno,
        alreadyBought: p.alreadyBought
      }))
    }
  };
  
  if (forPlayer && forPlayer.hand) {
    (state as any).playerHand = forPlayer.hand;
  }
  
  return state;
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Nova conexão WebSocket estabelecida');

  // Manipular mensagens recebidas
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      const { type, ...payload } = message;
      
      // Encontrar o jogador pela conexão WebSocket
      const playerConnection = playerConnections.get(ws as any);
      let currentPlayer: Player | null = null;
      let currentRoom: Room | null = null;
      
      if (playerConnection) {
        currentRoom = rooms.get(playerConnection.roomId) || null;
        currentPlayer = currentRoom?.players.find(p => p.id === playerConnection.playerId) || null;
      }

      switch (type as MessageType) {
        case 'CREATE_ROOM': {
          const { roomName } = payload;
          const roomId = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
          const playerName = gerarPlayerName()
          if (!roomId || !roomName) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'ID da sala, nome da sala e do jogador são obrigatórios' }));
            return;
          }
          
          // Verificar se a sala já existe
          if (rooms.has(roomId)) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Sala com este ID já existe' }));
            return;
          }
          
          const playerId = generateId();
          
          const player: Player = {
            id: playerId,
            ws,
            name: playerName,
            disconnected: false
          };
          
          const room: Room = {
            id: roomId,
            ownerId: playerId,
            roomName,
            canStart: false,
            status: 'WAITING',
            players: [player]
          };
          
          rooms.set(roomId, room);
          playerConnections.set(ws as any, { playerId, roomId });
          
          ws.send(JSON.stringify({
            type: 'CREATE_ROOM',
            success: true,
            yourId: playerId,
            yourName: playerName,
            room: {
              id: roomId,
              roomName,
              ownerId: playerId,
              players: [{ id: playerId, name: playerName, cardCount: 0 }]
            },
          }));
          break;
        }

        case 'JOIN_ROOM': {
          const { roomId } = payload;
          
          if (!roomId) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'ID da sala é obrigatorio' }));
            return;
          }
          
          const room = rooms.get(roomId);
          if (!room) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Sala não encontrada' }));
            return;
          }
          
          if (room.players.length >= 10) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Sala está cheia' }));
            return;
          }
          
          if (room.status !== 'WAITING') {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogo já iniciado' }));
            return;
          }
          
          const playerName = gerarPlayerName()
          const playerId = generateId();
          const player: Player = {
            id: playerId,
            ws,
            name: playerName,
            disconnected: false
          };
          
          room.players.push(player);
          room.canStart = room.players.length >= 2;
          
          playerConnections.set(ws as any, { playerId, roomId });
          
          ws.send(JSON.stringify({
            type: 'JOIN_ROOM',
            success: true,
            yourId: playerId,
            yourName: playerName,
            room,
          }));
          
          broadcastToRoom(room, getRoomState(room));
          break;
        }

        case 'DELETE_ROOM': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          if (currentPlayer.id !== currentRoom.ownerId) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Apenas o dono pode deletar a sala' }));
            return;
          }
          
          broadcastToRoom(currentRoom, {
            type: 'DELETE_ROOM',
            message: 'Sala foi deletada pelo dono'
          });
          
          // Remover conexões dos jogadores
          currentRoom.players.forEach(player => {
            playerConnections.delete(player.ws as any);
          });
          
          rooms.delete(currentRoom.id);
          break;
        }

        case 'START_GAME': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          if (currentPlayer.id !== currentRoom.ownerId) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Apenas o dono pode iniciar o jogo' }));
            return;
          }
          
          if (currentRoom.players.length < 2) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Mínimo de 2 jogadores necessário' }));
            return;
          }
          
          // Inicializar jogo
          currentRoom.status = 'IN_GAME';
          currentRoom.gameDirection = 'clockwise';
          currentRoom.additionalState = null;
          
          // Dar 7 cartas para cada jogador
          currentRoom.players.forEach(player => {
            player.hand = dealCards(7);
            player.alreadyBought = false;
            player.yelledUno = false;
          });
          
          // Escolher jogador inicial aleatoriamente
          const randomIndex = Math.floor(Math.random() * currentRoom.players.length);
          currentRoom.currentPlayerId = currentRoom.players[randomIndex].id;
          
          // Carta inicial (não pode ser carta especial)
          let initialCard: Card;
          do {
            initialCard = getRandomCard();
          } while (initialCard.color === 'black' || ['Skip', 'Reverse', 'Draw Two'].includes(initialCard.value));
          
          currentRoom.currentCard = initialCard;
          
          updatePlayerTurns(currentRoom);
          
          // Enviar estado do jogo para todos
          currentRoom.players.forEach(player => {
            sendToPlayer(player, getRoomState(currentRoom!, player));
          });
          break;
        }

        case 'PLAY_CARD': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          if (currentRoom.status !== 'IN_GAME') {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogo não está em andamento' }));
            return;
          }
          
          if (!currentPlayer.isTheirTurn) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Não é sua vez' }));
            return;
          }
          
          const { card } = payload;
          if (!card || !currentPlayer.hand) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Carta inválida' }));
            return;
          }
          
          // Verificar se o jogador tem a carta
          const cardIndex = currentPlayer.hand.findIndex(c => 
            c.color === card.color && c.value === card.value
          );
          
          if (cardIndex === -1) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Você não possui esta carta' }));
            return;
          }
          
          // Verificar se a jogada é válida
          if (!isValidPlay(card, currentRoom.currentCard!)) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogada inválida' }));
            return;
          }
          
          // Remover carta da mão
          currentPlayer.hand.splice(cardIndex, 1);
          currentPlayer.yelledUno = false; // Reset UNO status
          
          // Atualizar carta atual
          currentRoom.currentCard = { ...card };
          
          // Verificar vitória
          if (currentPlayer.hand.length === 0) {
            currentRoom.status = 'FINISHED';
            broadcastToRoom(currentRoom, {
              type: 'UPDATE_ROOM',
              winner: currentPlayer.name,
              room: getRoomState(currentRoom).room
            });
            return;
          }
          
          // Aplicar efeitos da carta
          let skipNext = false;
          
          switch (card.value) {
            case 'Skip':
              skipNext = true;
              break;
              
            case 'Reverse':
              currentRoom.gameDirection = currentRoom.gameDirection === 'clockwise' ? 'anticlockwise' : 'clockwise';
              if (currentRoom.players.length === 2) {
                skipNext = true; // Em jogo de 2 jogadores, reverse funciona como skip
              }
              break;
              
            case 'Draw Two': {
              const nextPlayer = getNextPlayer(currentRoom);
              if (nextPlayer && nextPlayer.hand) {
                nextPlayer.hand.push(...dealCards(2));
              }
              skipNext = true;
              break;
            }
            
            case 'Wild':
              currentRoom.additionalState = 'CHOOSING_COLOR';
              break;
              
            case 'Wild Draw Four': {
              const nextPlayer = getNextPlayer(currentRoom);
              if (nextPlayer && nextPlayer.hand) {
                nextPlayer.hand.push(...dealCards(4));
              }
              currentRoom.additionalState = 'CHOOSING_COLOR';
              skipNext = true;
              break;
            }
          }
          
          // Avançar turno
          if (currentRoom.additionalState !== 'CHOOSING_COLOR') {
            let nextPlayer = getNextPlayer(currentRoom);
            if (skipNext && nextPlayer) {
              nextPlayer = getNextPlayer(currentRoom);
            }
            if (nextPlayer) {
              currentRoom.currentPlayerId = nextPlayer.id;
            }
            updatePlayerTurns(currentRoom);
          }
          
          // Broadcast estado atualizado
          currentRoom.players.forEach(player => {
            sendToPlayer(player, getRoomState(currentRoom!, player));
          });
          break;
        }

        case 'BUY_CARD': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          if (!currentPlayer.isTheirTurn) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Não é sua vez' }));
            return;
          }
          
          if (currentPlayer.alreadyBought) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Você já comprou uma carta nesta rodada' }));
            return;
          }
          
          if (!currentPlayer.hand) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Erro no estado do jogo' }));
            return;
          }

          if (currentPlayer.yelledUno){
            currentPlayer.yelledUno = false;
          }
          
          // Comprar carta
          const newCard = getRandomCard();
          currentPlayer.hand.push(newCard);
          currentPlayer.alreadyBought = true;
          
          // // Enviar carta para o jogador
          // sendToPlayer(currentPlayer, {
          //   type: 'UPDATE_PLAYER',
          //   hand: currentPlayer.hand
          // });
          
          // // Atualizar contagem para outros jogadores
          // broadcastToRoom(currentRoom, getRoomState(currentRoom), currentPlayer.id);

          currentRoom.players.forEach(player => {
            sendToPlayer(player, getRoomState(currentRoom!, player));
          });
          break;
        }

        case 'SKIP_ROUND': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          if (!currentPlayer.isTheirTurn) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Não é sua vez' }));
            return;
          }
          
          if (!currentPlayer.alreadyBought) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Você deve comprar uma carta antes de passar a vez' }));
            return;
          }
          
          // Passar turno
          const nextPlayer = getNextPlayer(currentRoom);
          if (nextPlayer) {
            currentRoom.currentPlayerId = nextPlayer.id;
          }
          
          updatePlayerTurns(currentRoom);
          // broadcastToRoom(currentRoom, getRoomState(currentRoom));

          currentRoom.players.forEach(player => {
            sendToPlayer(player, getRoomState(currentRoom!, player));
          });
          break;
        }

        case 'YELL_UNO': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          if (!currentPlayer.hand || currentPlayer.hand.length !== 1) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Você só pode gritar UNO quando tiver exatamente 1 carta' }));
            return;
          }

          if (currentPlayer.yelledUno) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Você já gritou UNO' }));
            return;
          }
          
          currentPlayer.yelledUno = true;
          
          // broadcastToRoom(currentRoom, {
          //   type: 'UPDATE_PLAYER',
          //   playerId: currentPlayer.id,
          //   yelledUno: true,
          //   message: `${currentPlayer.name} gritou UNO!`
          // });

          currentRoom.players.forEach(player => {
            sendToPlayer(player, getRoomState(currentRoom!, player));
          });
          break;
        }

        case 'ACCUSE_NO_UNO': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          const { playerId } = payload;
          const accusedPlayer = currentRoom.players.find(p => p.id === playerId);
          
          if (!accusedPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador acusado não encontrado' }));
            return;
          }
          
          if (!accusedPlayer.hand || accusedPlayer.hand.length !== 1 || accusedPlayer.yelledUno) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Acusação inválida' }));
            return;
          }
          
          // Penalizar jogador acusado
          accusedPlayer.hand.push(...dealCards(2));
          
          // // Enviar mão atualizada para o jogador acusado
          // if (accusedPlayer.ws && !accusedPlayer.disconnected) {
          //   sendToPlayer(accusedPlayer, {
          //     type: 'UPDATE_HAND',
          //     hand: accusedPlayer.hand
          //   });
          // }
          
          // broadcastToRoom(currentRoom, {
          //   type: 'UPDATE_ROOM',
          //   message: `${accusedPlayer.name} foi penalizado por não gritar UNO!`,
          //   room: getRoomState(currentRoom).room
          // });

          currentRoom.players.forEach(player => {
            sendToPlayer(player, getRoomState(currentRoom!, player));
          });
          break;
        }

        case 'CHOOSE_COLOR': {
          if (!currentRoom || !currentPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado em sala' }));
            return;
          }
          
          if (currentRoom.additionalState !== 'CHOOSING_COLOR') {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Não é necessário escolher cor agora' }));
            return;
          }
          
          if (currentPlayer.id !== currentRoom.currentPlayerId) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Apenas o jogador atual pode escolher a cor' }));
            return;
          }
          
          const { color } = payload;
          if (!['red', 'blue', 'green', 'yellow'].includes(color)) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Cor inválida' }));
            return;
          }
          
          // Definir cor escolhida
          if (currentRoom.currentCard) {
            currentRoom.currentCard.chosenColor = color;
          }
          currentRoom.additionalState = null;
          
          // Avançar turno se necessário
          const nextPlayer = getNextPlayer(currentRoom);
          if (nextPlayer) {
            currentRoom.currentPlayerId = nextPlayer.id;
          }
          
          updatePlayerTurns(currentRoom);
          broadcastToRoom(currentRoom, getRoomState(currentRoom));
          break;
        }

        case 'RECONNECT': {
          const { playerId } = payload;
          
          // Procurar jogador em todas as salas
          let foundRoom: Room | null = null;
          let foundPlayer: Player | null = null;
          
          for (const room of rooms.values()) {
            const player = room.players.find(p => p.id === playerId);
            if (player) {
              foundRoom = room;
              foundPlayer = player;
              break;
            }
          }
          
          if (!foundRoom || !foundPlayer) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Jogador não encontrado' }));
            return;
          }
          
          // Reconectar jogador
          foundPlayer.ws = ws;
          foundPlayer.disconnected = false;
          
          playerConnections.set(ws as any, { playerId, roomId: foundRoom.id });
          
          // Enviar estado atual
          sendToPlayer(foundPlayer, getRoomState(foundRoom, foundPlayer));
          
          // Notificar outros jogadores
          broadcastToRoom(foundRoom, {
            type: 'UPDATE_ROOM',
            message: `${foundPlayer.name} reconectou`,
            room: getRoomState(foundRoom).room
          }, foundPlayer.id);
          break;
        }

        default:
          ws.send(JSON.stringify({ type: 'ERROR', message: 'Tipo de mensagem inválido' }));
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Erro interno do servidor' }));
    }
  });

  // Manipular desconexão
  ws.on('close', () => {
    console.log('Conexão WebSocket fechada');
    
    const playerConnection = playerConnections.get(ws as any);
    if (playerConnection) {
      const room = rooms.get(playerConnection.roomId);
      if (room) {
        const player = room.players.find(p => p.id === playerConnection.playerId);
        if (player) {
          player.disconnected = true;
          
          // Verificar se todos os jogadores estão desconectados
          const allDisconnected = room.players.every(p => p.disconnected);
          if (allDisconnected) {
            // Remover sala após 5 minutos
            setTimeout(() => {
              const currentRoom = rooms.get(room.id);
              if (currentRoom && currentRoom.players.every(p => p.disconnected)) {
                rooms.delete(room.id);
                console.log(`Sala ${room.id} removida por inatividade`);
              }
            }, 5 * 60 * 1000); // 5 minutos
          } else {
            // Notificar outros jogadores
            broadcastToRoom(room, {
              type: 'UPDATE_ROOM',
              message: `${player.name} desconectou`,
              room: getRoomState(room).room
            }, player.id);
          }
        }
      }
      
      playerConnections.delete(ws as any);
    }
  });

  // Manipular erros
  ws.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
  });
});

// Configurar porta
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor WebSocket rodando na porta ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🌐 HTTP endpoint: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Encerrando servidor...');
  wss.close(() => {
    server.close(() => {
      console.log('Servidor encerrado.');
      process.exit(0);
    });
  });
});
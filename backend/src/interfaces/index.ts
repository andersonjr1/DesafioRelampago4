// src/interfaces/index.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: JwtPayload;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type GameStatus = "WAITING" | "IN_GAME" | "FINISHED";

type GameDirection = "clockwise" | "counter-clockwise";

type AdditionalState = "CHOOSING_COLOR" | "PLAYER_DISCONNECTED" | null;

interface Card {
  color: string;
  value: string;
  chosenColor?: string;
}

interface Player {
  id: string;
  ws?: WebSocket;
  name: string;
  cardCount?: number;
  alreadyBought?: boolean;
  isTheirTurn?: boolean;
  disconnected?: boolean;
  yelledUno?: boolean;
  hand?: Card[];
}

interface Room {
  id: string;
  ownerId: string;
  roomName: string;
  canStart: boolean;

  status?: GameStatus;
  currentCard?: Card;
  gameDirection?: GameDirection;
  currentPlayerId?: string;
  additionalState?: AdditionalState;

  players: Player[];
}

interface Game {
  id: string;
  gameId: string;
  playerId: string;
  players: Players[];
  winnerId: string;
  date: Date;
}

interface Players {
  playerName: string;
  playerId: string;
}

export { User, ApiResponse, AuthRequest, Room, Game, Players };

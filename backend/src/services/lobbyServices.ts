import {
  getRoomServer,
  setRoomServer,
  getAvailableGameServer,
} from "../repository/lobbyRepository";
import { randomUUID } from "crypto";
import { config } from "../config";

const getGameServerUrl = (serverId: string, roomId: string): string => {
  const protocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
  return `${protocol}://${config.DOMAIN}/ws/game/${serverId}/${roomId}`;
};

const createRoom = async (): Promise<{
  roomId: string;
  serverUrl: string;
} | null> => {
  try {
    const serverId = await getAvailableGameServer();
    if (!serverId) return null;

    const roomId = randomUUID();
    const gameServerUrl = getGameServerUrl(serverId, roomId);

    await setRoomServer(roomId, serverId);

    return { roomId, serverUrl: gameServerUrl };
  } catch (error) {
    throw error;
  }
};

const joinRoom = async (
  roomId: string
): Promise<{ serverUrl: string } | null> => {
  try {
    const serverId = await getRoomServer(roomId);
    if (!serverId) return null;

    const gameServerUrl = getGameServerUrl(serverId, roomId);
    return { serverUrl: gameServerUrl };
  } catch (error) {
    throw error;
  }
};

export { createRoom, joinRoom };

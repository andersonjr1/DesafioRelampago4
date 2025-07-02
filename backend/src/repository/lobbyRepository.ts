import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

const ROOM_MAP_KEY = "room_map";
const GAME_SERVERS_KEY = "available_game_servers";

const getRoomServer = async (roomId: string): Promise<string | null> => {
  try {
    await connectRedis();
    const result = await redisClient.hGet(ROOM_MAP_KEY, roomId);
    return result ?? null;
  } catch (error) {
    throw error;
  }
};

const setRoomServer = async (
  roomId: string,
  serverId: string
): Promise<void> => {
  try {
    await connectRedis();
    await redisClient.hSet(ROOM_MAP_KEY, roomId, serverId);
  } catch (error) {
    throw error;
  }
};

const getAvailableGameServer = async (): Promise<string | null> => {
  try {
    await connectRedis();
    return await redisClient.sRandMember(GAME_SERVERS_KEY);
  } catch (error) {
    throw error;
  }
};

export { getRoomServer, setRoomServer, getAvailableGameServer };

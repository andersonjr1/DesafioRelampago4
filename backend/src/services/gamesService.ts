import { findGamesByPlayerId } from "../repository/gamesRepository";
import type {Game} from "../interfaces"

import { ApiResponse } from "../interfaces";

const getGames = async (
  playerId: string,
): Promise<ApiResponse<{ games: Game[] }>> => {
  try {
    const games = await findGamesByPlayerId(playerId);
    return { success: true, data: { games } };
  } catch (error) {
    throw error;
  }
};

export { getGames };

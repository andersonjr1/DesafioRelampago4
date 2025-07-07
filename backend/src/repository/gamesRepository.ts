// src/repository/gamesRepository.ts
import { pool } from "../db";
import { Game, Players } from "../interfaces";

const insertGame = async (winnerId?: string): Promise<Game | null> => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "INSERT INTO games (winnerId) VALUES ($1) RETURNING id, winnerId, createdAt",
      [winnerId || null]
    );
    
    if (rows[0]) {
      return {
        id: rows[0].id,
        gameId: rows[0].id,
        playerId: "", // Will be populated when getting game with players
        players: [], // Empty array initially
        winnerId: rows[0].winnerId,
        date: rows[0].createdAt
      };
    }
    return null;
  } catch (error) {
    throw error;
  } finally {
    if (client) client.release();
  }
};

const addPlayerToGame = async (gameId: string, playerId: string, isWinner: boolean = false): Promise<boolean> => {
  let client;
  try {
    client = await pool.connect();
    await client.query(
      "INSERT INTO gamePlayers (gameId, playerId, isWinner) VALUES ($1, $2, $3)",
      [gameId, playerId, isWinner]
    );
    return true;
  } catch (error) {
    throw error;
  } finally {
    if (client) client.release();
  }
};

const findGameById = async (gameId: string): Promise<Game | null> => {
  let client;
  try {
    client = await pool.connect();
    
    // Get game details with all players
    const { rows } = await client.query(
      `SELECT 
        g.id as game_id,
        g.winnerId,
        g.createdAt,
        gp.playerId,
        u.name as playerName,
        gp.isWinner
      FROM games g
      LEFT JOIN gamePlayers gp ON g.id = gp.gameId
      LEFT JOIN users u ON gp.playerId = u.id
      WHERE g.id = $1
      ORDER BY gp.createdAt`,
      [gameId]
    );
    
    if (rows.length === 0) return null;
    
    const gameData = rows[0];
    const players: Players[] = rows.map(row => ({
      playerName: row.playername,
      playerId: row.playerid
    }));
    
    return {
      id: gameData.game_id,
      gameId: gameData.game_id,
      playerId: gameData.playerid || "",
      players: players, // Now correctly an array
      winnerId: gameData.winnerid,
      date: gameData.createdat
    };
  } catch (error) {
    throw error;
  } finally {
    if (client) client.release();
  }
};

const findGamesByPlayerId = async (playerId: string): Promise<Game[]> => {
  let client;
  try {
    client = await pool.connect();
    
    const { rows } = await client.query(
      `SELECT DISTINCT
        g.id as game_id,
        g.winnerId,
        g.createdAt,
        gp.playerId,
        u.name as playerName
      FROM games g
      INNER JOIN gamePlayers gp ON g.id = gp.gameId
      LEFT JOIN users u ON gp.playerId = u.id
      WHERE g.id IN (
        SELECT gameId FROM gamePlayers WHERE playerId = $1
      )
      ORDER BY g.createdAt DESC`,
      [playerId]
    );
    
    // Group by game_id to handle multiple players per game
    const gamesMap = new Map<string, { game: Omit<Game, 'players'>, players: Players[] }>();
    
    rows.forEach(row => {
      if (!gamesMap.has(row.game_id)) {
        gamesMap.set(row.game_id, {
          game: {
            id: row.game_id,
            gameId: row.game_id,
            playerId: row.playerid,
            winnerId: row.winnerid,
            date: row.createdat
          },
          players: []
        });
      }
      
      // Add player to the game's players array
      const gameEntry = gamesMap.get(row.game_id)!;
      gameEntry.players.push({
        playerName: row.playername,
        playerId: row.playerid
      });
    });
    
    // Convert map to array of Game objects
    return Array.from(gamesMap.values()).map(entry => ({
      ...entry.game,
      players: entry.players
    }));
  } catch (error) {
    throw error;
  } finally {
    if (client) client.release();
  }
};

const updateGameWinner = async (gameId: string, winnerId: string): Promise<boolean> => {
  let client;
  try {
    client = await pool.connect();
    
    // Update the game winner
    await client.query(
      "UPDATE games SET winnerId = $1, updatedAt = NOW() WHERE id = $2",
      [winnerId, gameId]
    );
    
    // Update the player as winner in gamePlayers
    await client.query(
      "UPDATE gamePlayers SET isWinner = TRUE WHERE gameId = $1 AND playerId = $2",
      [gameId, winnerId]
    );
    
    return true;
  } catch (error) {
    throw error;
  } finally {
    if (client) client.release();
  }
};

export {
  insertGame,
  addPlayerToGame,
  findGameById,
  findGamesByPlayerId,
  updateGameWinner
};
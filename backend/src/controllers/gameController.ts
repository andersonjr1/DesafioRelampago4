import { Response } from "express";
import * as gameService from "../services/gamesService";
import { AuthRequest } from "../interfaces/index";

export const getGames = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.user!;

  try {
    const games = await gameService.getGames(id);
    res.status(200).json(games);
  } catch (error: any) {
    console.error("Erro ao criar sala:", error);
    res.status(400).json({ message: error.message });
    return;
  }
};

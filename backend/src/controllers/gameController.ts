import { Request, Response } from "express";
import * as gameService from "../services/gamesService";
import { AuthRequest } from "../interfaces/index";

export const getGames = (req: AuthRequest, res: Response): void => {
  const { id, name } = req.user!;

  try {
    console.log(gameService.getGames(id));
  } catch (error: any) {
    console.error("Erro ao criar sala:", error);
    res.status(400).json({ message: error.message });
    return;
  }
};
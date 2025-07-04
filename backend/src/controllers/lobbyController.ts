import { Request, Response } from "express";
import * as unoGameService from "../services/unoGameService";
import { AuthRequest } from "../interfaces/index";

export const createRoom = (req: AuthRequest, res: Response): Response => {
  // O middleware `protect` já garante que `req.user` existe.
  const { userId, username } = req.user!;

  try {
    const { roomName } = req.body;
    
    if (!roomName) {
      return res.status(400).json({ message: "Nome da sala é obrigatório" });
    }

    const room = unoGameService.createRoomForApi(userId, username, roomName);
    return res.status(201).json(room);
  } catch (error: any) {
    console.error("Erro ao criar sala:", error);
    return res.status(400).json({ message: error.message });
  }
};

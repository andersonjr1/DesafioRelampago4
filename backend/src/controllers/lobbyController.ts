import { Request, Response } from "express";
import * as unoGameService from "../services/unoGameService";
import { AuthRequest } from "../interfaces/index";

export const createRoom = (req: AuthRequest, res: Response): void => {
  const { userId, username } = req.user!;

  try {
    const { roomName } = req.body;
    
    if (!roomName) {
      res.status(400).json({ message: "Nome da sala é obrigatório" });
      return 
    }

    const room = unoGameService.createRoomForApi(userId, username, roomName);
    res.status(201).json(room);
    return 
  } catch (error: any) {
    console.error("Erro ao criar sala:", error);
    res.status(400).json({ message: error.message });
    return;
  }
};

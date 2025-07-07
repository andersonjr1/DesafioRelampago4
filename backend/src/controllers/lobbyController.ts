import { Request, Response } from "express";
import * as unoGameService from "../services/unoGameService";
import { AuthRequest } from "../interfaces/index";

export const createRoom = (req: AuthRequest, res: Response): void => {
  const { id, name } = req.user!;

  try {
    const { roomName } = req.body;

    if (!roomName) {
      res.status(400).json({ message: "Nome da sala é obrigatório" });
      return 
    }

    const room = unoGameService.createRoomForApi(id, name, roomName);
    res.status(201).json(room);
    return 
  } catch (error: any) {
    console.error("Erro ao criar sala:", error);
    res.status(400).json({ message: error.message });
    return;
  }
};

export const isPlayerDisconnected = (req: AuthRequest, res: Response): void => {
  const { id, name } = req.user!;
  try {
    const roomId = unoGameService.isPlayerDisconnectedForApi(id);
    if(roomId){
      res.status(200).json({ message: "Jogador está em uma sala em jogo", roomId });
      return;
    }
    res.status(200).json({ message: "Jogador não está em uma sala" });
  } catch (error: any) {
    console.error("Erro ao verificar se o jogador está desconectado:", error);
    res.status(500).json({ message: error.message });
    return;
  }
}

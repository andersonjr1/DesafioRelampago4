import { Request, Response } from "express";
import * as lobbyServices from "../services/lobbyServices";

const createRoom = async (req: Request, res: Response) => {
  try {
    const result = await lobbyServices.createRoom();
    if (!result) {
      res
        .status(503)
        .json({ error: "Nenhum servidor de jogo disponível no momento" });
      return;
    }
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar sala" });
  }
};

const enterRoom = async (req: Request, res: Response) => {
  const { roomId } = req.body;

  if (!roomId) {
    res.status(400).json({ error: "Id da sala é obrigatório" });
    return;
  }

  try {
    const result = await lobbyServices.joinRoom(roomId);
    if (!result) {
      res.status(404).json({ error: "Sala não encontrada" });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao entrar na sala" });
  }
};

export { createRoom, enterRoom };

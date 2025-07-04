import { Response } from "express";
import { AuthRequest } from "../interfaces/index";
import * as lobbyServices from "../services/lobbyServices";

const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomName } = req.body;
    const user = req.user;

    if (!roomName) {
      res.status(400).json({ error: "Nome da sala é obrigatório" });
      return;
    }

    const result = await lobbyServices.createRoom(
      roomName,
      user?.userId,
      user?.name
    );

    if (typeof result === "string") {
      res.status(400).json({ error: result });
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor ao criar sala" });
  }
};

export { createRoom };

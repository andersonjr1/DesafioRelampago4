// src/controllers/usersController.ts
import { Request, Response } from "express";
import * as usersServices from "../services/usersServices";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await usersServices.registerUser(name, email, password);
    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.status(201).json({ data: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export { register };

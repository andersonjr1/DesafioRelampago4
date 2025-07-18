// src/controllers/authController.ts
import { Request, Response } from "express";
import * as authServices from "../services/authServices";
import { AuthRequest } from "../interfaces/index";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.authenticateUser(email, password);

    if (!result.success) {
      res.status(401).json({ error: result.error });
      return;
    }

    res.cookie("token", result.data?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ message: "Autenticado com sucesso", data: result.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const logout = (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const checkLogin = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  res.status(200).json({
    data: req.user,
  });
};

export { login, logout, checkLogin };

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

interface AuthRequest extends Request {
  user?: JwtPayload;
}

const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    {
      res.status(400).json({ error: "Token de sessão ausente" });
      return;
    }
  }

  jwt.verify(
    token,
    config.SECRET_KEY,
    (
      err: jwt.VerifyErrors | null,
      user: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        res.cookie("token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: new Date(0),
        });
        res.status(401).json({ error: "Token de sessão inválido" });
        return;
      }
      req.user = user as JwtPayload;
      next();
    }
  );
};

export { authenticateToken };

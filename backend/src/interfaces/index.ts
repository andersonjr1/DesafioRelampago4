// src/interfaces/index.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: JwtPayload;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export { User, ApiResponse, AuthRequest };

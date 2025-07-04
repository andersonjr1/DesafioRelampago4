// src/services/authServices.ts
import jwt from "jsonwebtoken";
import { comparePassword } from "../utils/comparePassword";
import * as repository from "../repository/usersRepository";
import { ApiResponse } from "../interfaces";
import { config } from "../config";

const authenticateUser = async (
  email: string,
  password: string
): Promise<ApiResponse<{ token: string }>> => {
  try {
    const user = await repository.findByEmail(email);
    if (!user) return { success: false, error: "Credenciais inválidas" };

    const valid = await comparePassword(password, user.password);
    if (!valid) return { success: false, error: "Credenciais inválidas" };

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      config.SECRET_KEY,
      { expiresIn: "24h" }
    );
    return { success: true, data: { token } };
  } catch (error) {
    throw error;
  }
};

export { authenticateUser };

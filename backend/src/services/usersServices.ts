// src/services/usersServices.ts
import * as repository from "../repository/usersRepository";
import { hashPassword } from "../utils/hashPassword";
import { ApiResponse } from "../interfaces";

const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<{ id: string; name: string; email: string }>> => {
  try {
    const existing = await repository.findByEmail(email);
    if (existing) return { success: false, error: "E-mail já cadastrado" };

    const hashedPassword = await hashPassword(password);
    const user = await repository.insertUser(name, email, hashedPassword);

    if (!user) return { success: false, error: "Erro ao cadastrar o usuário" };

    return { success: true, data: user };
  } catch (error) {
    throw error;
  }
};

export { registerUser };

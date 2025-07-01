// src/utils/comparePassword.ts
import bcrypt from "bcrypt";

async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Erro ao comparar senha:", error);
    throw new Error("Erro ao comparar senha");
  }
}

export { comparePassword };

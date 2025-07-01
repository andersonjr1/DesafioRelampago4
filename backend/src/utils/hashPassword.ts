// src/utils/hashPassword.ts
import bcrypt from "bcrypt";

async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Falha na geração do hash da senha:", error);
    throw new Error("Erro ao gerar hash da senha");
  }
}

export { hashPassword };

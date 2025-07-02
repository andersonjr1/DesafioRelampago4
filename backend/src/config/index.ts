// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();

const config = {
  DOMAIN: process.env.DOMAIN || "localhost",
  PORT: process.env.PORT || "3000",
  SECRET_KEY: process.env.SECRET_KEY || "secreta123",
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
};

export { config };

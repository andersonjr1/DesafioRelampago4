// src/utils/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { config } from "./config";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(config.PORT, () =>
  console.log(`Servidor rodando na porta ${config.PORT}`)
);

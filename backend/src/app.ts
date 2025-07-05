// src/utils/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { config } from "./config";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(router);

app.listen(config.PORT, () =>
  console.log(`Servidor rodando na porta ${config.PORT}`)
);

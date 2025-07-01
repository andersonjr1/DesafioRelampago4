// src/db/index.ts
import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: Number(config.DB_PORT),
});

export { pool };

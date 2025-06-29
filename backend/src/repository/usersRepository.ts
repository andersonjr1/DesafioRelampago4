// src/repository/usersRepository.ts
import { pool } from "../db";
import { User } from "../interfaces";

const findByEmail = async (email: string): Promise<User | null> => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  } finally {
    if (client) client.release();
  }
};

const insertUser = async (
  name: string,
  email: string,
  password: string
): Promise<User | null> => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, password]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  } finally {
    if (client) client.release();
  }
};

export { findByEmail, insertUser };

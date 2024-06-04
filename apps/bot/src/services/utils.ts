import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { env } from "../env";
const { Pool } = pkg;
const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

export function db() {
  return drizzle(pool);
}

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

export type DbConfig = { db: string };
const dbConfig: DbConfig = { db: process.env.PUBLIC_DB_URL || "./flows.db" };
export function db() {
  const sqlite = new Database(dbConfig.db);
  return drizzle(sqlite);
}

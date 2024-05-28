import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

export const sqliteDB = new Database('./../../flows.db');
console.log(sqliteDB);
export const db = drizzle(sqliteDB);

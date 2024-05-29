import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { PUBLIC_DB_URL } from '$env/static/public';

console.log(`${PUBLIC_DB_URL}/flows.db`);
export const sqliteDB = new Database(`${PUBLIC_DB_URL}`);
export const db = drizzle(sqliteDB);

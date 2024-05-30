import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { PUBLIC_DB_URL } from '$env/static/public';

export type DbConfig = { db: string };
const dbConfig: DbConfig = { db: `${PUBLIC_DB_URL}` };
export function db() {
	const sqlite = new Database(dbConfig.db);
	return drizzle(sqlite);
}

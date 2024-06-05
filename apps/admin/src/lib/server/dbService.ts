import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
	host: env.DB_HOST || '127.0.0.1',
	port: Number(env.DB_PORT) || 5432,
	user: env.DB_USER || 'ff_admin',
	password: env.DB_PASSWORD || 'admin',
	database: env.DB_DATABASE || 'ff'
});

export function db() {
	return drizzle(pool);
}

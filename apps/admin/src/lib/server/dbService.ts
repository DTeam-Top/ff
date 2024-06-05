import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/node-postgres';

import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
	host: env.PRIVATE_DB_HOST || '127.0.0.1',
	port: Number(env.PRIVATE_DB_PORT) || 5432,
	user: env.PRIVATE_DB_USER || 'ff_admin',
	password: env.PRIVATE_DB_PASSWORD || 'admin',
	database: env.PRIVATE_DB_DATABASE || 'ff'
});

export function db() {
	return drizzle(pool);
}

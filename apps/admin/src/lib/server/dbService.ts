import {
	PRIVATE_DB_DATABASE,
	PRIVATE_DB_HOST,
	PRIVATE_DB_PASSWORD,
	PRIVATE_DB_PORT,
	PRIVATE_DB_USER
} from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';

import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
	host: PRIVATE_DB_HOST || '127.0.0.1',
	port: Number(PRIVATE_DB_PORT) || 5432,
	user: PRIVATE_DB_USER || 'ff_admin',
	password: PRIVATE_DB_PASSWORD || 'admin',
	database: PRIVATE_DB_DATABASE || 'ff'
});

export function db() {
	return drizzle(pool);
}

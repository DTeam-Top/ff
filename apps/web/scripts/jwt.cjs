//import { sign } from 'hono/jwt';
const { sign } = require('hono/jwt');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'SuPeRpaSsW0rd';
const payload = { fid: '0', time: Date.now() };
sign(payload, JWT_SECRET).then((token) => {
	console.log(`jwt = ${token}`);
});

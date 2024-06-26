import { Hono } from 'hono';
import { apiKeyRouter } from './apikeyApi';
import { commissionRouter } from './commissionApi';
import { flowsRouter } from './flowApi';
import { tracesRouter } from './traceApi';
import { neynarRouter } from './neynarApi';
import { jwt } from 'hono/jwt';
import { env } from '$env/dynamic/private';
import { publicRouter } from './publicApi';
import { frameRouter } from './frameApi';
import { commonRouter } from './commonApi';

//secret api, need api_key
export const secretApi = new Hono()
	.route('/api/s/apikeys', apiKeyRouter)
	.route('/api/s/commissions', commissionRouter)
	.route('/api/s/flows', flowsRouter)
	.route('/api/s/traces', tracesRouter);

//public api, need jwt
export const publicApi = new Hono()
	.use('*', (c, next) => {
		const jwtMiddleware = jwt({
			secret: env.JWT_SECRET?.toString() || 'SuPeRpaSsW0rd'
		});
		return jwtMiddleware(c, next);
	})
	.route('/api/p', publicRouter);

//common api
export const commonApi = new Hono().route('/api/c', neynarRouter).route('/api/c', commonRouter);

//frame api, need jwt
export const frameApi = new Hono()
	.use('*', (c, next) => {
		const jwtMiddleware = jwt({
			secret: env.JWT_SECRET?.toString() || 'SuPeRpaSsW0rd'
		});

		return jwtMiddleware(c, next);
	})
	.route('/api/f', frameRouter);

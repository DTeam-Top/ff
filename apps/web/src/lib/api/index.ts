import { Hono } from 'hono';
import { apiKeyRouter } from './apikeyApi';
import { commissionRouter } from './commissionApi';
import { flowsRouter } from './flowApi';
import { tracesRouter } from './traceApi';
import { neynarRouter } from './neynarApi';

export const api = new Hono()
	.route('/api/apikeys', apiKeyRouter)
	.route('/api/commissions', commissionRouter)
	.route('/api/flows', flowsRouter)
	.route('/api', neynarRouter)
	.route('/api/traces', tracesRouter);

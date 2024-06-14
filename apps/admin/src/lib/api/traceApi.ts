import { createTracePayment, getTraces } from '$lib/server/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { idRequest, updateTxRequest } from './requests';
import { logger } from 'hono/logger';

export const router = new Hono()
	.use(logger())
	.post(
		'/update-tx/:id',
		zValidator('param', idRequest),
		zValidator('json', updateTxRequest),
		async (c) => {
			try {
				const { id } = c.req.param(); //flow id
				const { cast, paymentTx, amount } = c.req.valid('json');

				await createTracePayment(id, cast, paymentTx, amount);

				return c.json({ message: 'Success' });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (e: any) {
				return c.json({ message: e.code + ': ' + e.message }, 500);
			}
		}
	)
	.get('/list/:id', zValidator('param', idRequest), async (c) => {
		try {
			const { id } = c.req.param(); //flow id
			const { caster } = c.req.query();
			const result = await getTraces(id, caster);

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

export const traceApi = new Hono().route('/api/traces', router);

export type Router = typeof router;

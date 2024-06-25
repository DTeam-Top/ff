import { createTracePayment } from '$lib/server/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { idRequest, updateTxRequest } from './requests';

export const frameRouter = new Hono()
	.use(logger())
	.post(
		'/traces/update-tx/:id',
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
	);

import { createTracePayment, getTraces } from '$lib/db/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { idRequest, updateTxRequest } from './requests';

export const router = new Hono()

	.post(
		'/update-tx/:id',
		zValidator('param', idRequest),
		zValidator('json', updateTxRequest),
		async (c) => {
			try {
				const { id } = c.req.param(); //flow id
				const { cast, paymentTx, amount } = c.req.valid('json');

				console.log(id, cast, paymentTx, amount);

				await createTracePayment(Number(id), cast, paymentTx, amount);

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
			const result = await getTraces(Number(id), caster);
			console.log(caster);

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

export const traceApi = new Hono().route('/api/traces', router);

export type Router = typeof router;

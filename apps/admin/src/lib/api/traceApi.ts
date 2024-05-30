import { createTracePayment } from '$lib/db/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { idRequest, shareRequest, updateTxRequest } from './requests';

export const router = new Hono()
	.post(
		'/share/:id',
		zValidator('param', idRequest),
		zValidator('json', shareRequest),
		async (c) => {
			try {
				const { id } = c.req.param(); //flow id
				const { parentCast, fid } = c.req.valid('json');

				console.log(parentCast, fid, id);

				//create flow, publish cast

				//await share(Number(id));

				return c.json({ message: 'Success' });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (e: any) {
				return c.json({ message: e.code + ': ' + e.message }, 500);
			}
		}
	)
	.post(
		'/update-tx/:id',
		zValidator('param', idRequest),
		zValidator('json', updateTxRequest),
		async (c) => {
			try {
				const { id } = c.req.param(); //flow id
				const { cast, paymentTx, amount } = c.req.valid('json');

				console.log(id, cast, paymentTx, amount);

				await createTracePayment(id, cast, paymentTx, amount);

				return c.json({ message: 'Success' });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (e: any) {
				return c.json({ message: e.code + ': ' + e.message }, 500);
			}
		}
	);

export const traceApi = new Hono().route('/api/traces', router);

export type Router = typeof router;

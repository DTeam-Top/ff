import { createTracePayment, existTraceByFlow, insertTrace } from '$lib/db/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { idRequest, shareRequest, traceRequest, updateTxRequest } from './requests';

export const router = new Hono()
	.post('/', zValidator('json', traceRequest), async (c) => {
		try {
			const { cast, flow, parentCast, caster } = c.req.valid('json');
			if (!cast || !flow || !caster) {
				throw c.json({ message: 'Need cast, flow, caster' }, 400);
			}

			const isExist = await existTraceByFlow(flow);
			if (isExist) {
				return c.json({ message: 'existed' });
			}

			await insertTrace({ cast, flow, parentCast, caster });

			return c.json({ message: 'Insert success' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
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
				//create payment

				await createTracePayment(id, cast, paymentTx, amount);

				return c.json({ message: 'Success' });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (e: any) {
				return c.json({ message: e.code + ': ' + e.message }, 500);
			}
		}
	);

// .get('/list', async (c) => {
// 	try {
// 		const { creator } = c.req.query();
// 		const result = await getFlowList(Number(creator));

// 		return c.json(result);
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	} catch (e: any) {
// 		return c.json({ message: e.code + ': ' + e.message }, 500);
// 	}
// })
// .post('/delete/:id', zValidator('param', deleteRequest), async (c) => {
// 	try {
// 		const { id } = c.req.param();
// 		await deleteFlow(Number(id));

// 		return c.json({ message: 'Success' });
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	} catch (e: any) {
// 		return c.json({ message: e.code + ': ' + e.message }, 500);
// 	}
// })
// .get('/get/:id', zValidator('param', deleteRequest), async (c) => {
// 	try {
// 		const { id } = c.req.param();
// 		const result = await getFlowById(Number(id));

// 		return c.json(result);
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	} catch (e: any) {
// 		return c.json({ message: e.code + ': ' + e.message }, 500);
// 	}
// });

export const traceApi = new Hono().route('/api/trace', router);

export type Router = typeof router;

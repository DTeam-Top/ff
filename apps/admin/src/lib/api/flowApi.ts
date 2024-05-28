import { getFlowList, upsertFlow, deleteFlow, getFlowById, shareFlow } from '$lib/db/flowService';
import { createTracePayment } from '$lib/db/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
export const FlowRequest = z.object({
	name: z.string(),
	cover: z.string(),
	creator: z.number(),
	input: z.object({
		price: z.string(),
		nft: z.string()
	}),
	id: z.number().optional()
});

export const getRequest = z.object({
	creator: z.number()
});

export const DeleteRequest = z.object({
	id: z.string()
});

export const ParamRequest = z.object({
	name: z.string()
});

export const ShareRequest = z.object({
	parentCast: z.string(),
	fid: z.number()
});

export const UpdateTxRequest = z.object({
	cast: z.string(),
	paymentTx: z.string(),
	amount: z.string()
});

export const router = new Hono()
	.post('/', zValidator('json', FlowRequest), async (c) => {
		try {
			const { name, cover, creator, input, id } = c.req.valid('json');
			if (!name || !creator || !input) {
				throw c.json({ message: 'Need name, creator, input' }, 400);
			}

			const result = await upsertFlow({ name, cover, creator, input, id });

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/list', async (c) => {
		try {
			const { creator } = c.req.query();
			const result = await getFlowList(Number(creator));

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post('/delete/:id', zValidator('param', DeleteRequest), async (c) => {
		try {
			const { id } = c.req.param();
			await deleteFlow(Number(id));

			return c.json({ message: 'Success' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/get/:id', zValidator('param', DeleteRequest), async (c) => {
		try {
			const { id } = c.req.param();
			const result = await getFlowById(Number(id));

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post(
		'/share/:id',
		zValidator('param', DeleteRequest),
		zValidator('json', ShareRequest),
		async (c) => {
			try {
				const { id } = c.req.param(); //flow id
				const { parentCast, fid } = c.req.valid('json');

				console.log(parentCast, fid);

				//create flow, publish cast

				await shareFlow(Number(id));

				return c.json({ message: 'Success' });
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (e: any) {
				return c.json({ message: e.code + ': ' + e.message }, 500);
			}
		}
	)
	.post(
		'/update-tx/:id',
		zValidator('param', DeleteRequest),
		zValidator('json', UpdateTxRequest),
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

export const flowApi = new Hono().route('/api/flow', router);

export type Router = typeof router;

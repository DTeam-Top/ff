import { getFlowList, upsertFlow, deleteFlow, getFlowById } from '$lib/db/flowService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { flowRequest, idRequest } from './requests';

export const router = new Hono()
	.post('/', zValidator('json', flowRequest), async (c) => {
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
	.post('/delete/:id', zValidator('param', idRequest), async (c) => {
		try {
			const { id } = c.req.param();
			await deleteFlow(Number(id));

			return c.json({ message: 'Success' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/get/:id', zValidator('param', idRequest), async (c) => {
		try {
			const { id } = c.req.param();
			const result = await getFlowById(Number(id));

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

export const flowApi = new Hono().route('/api/flow', router);

export type Router = typeof router;

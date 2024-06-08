import {
	getFlowList,
	upsertFlow,
	deleteFlow,
	getFlowById,
	getStatics,
	publishFlow
} from '$lib/server/flowService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { fidRequest, flowRequest, idRequest } from './requests';

export const router = new Hono()
	.post('/', zValidator('json', flowRequest), async (c) => {
		try {
			const { name, cover, creator, input, id } = c.req.valid('json');
			if (!name || !creator || !input || !cover) {
				throw c.json({ message: 'Need name, creator, input , cover' }, 400);
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
			const { creator, hasTraced } = c.req.query();
			const result = await getFlowList(Number(creator), hasTraced === 'true');

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post('/delete/:id', zValidator('param', idRequest), async (c) => {
		try {
			const { id } = c.req.param();
			await deleteFlow(id);

			return c.json({ message: 'Success' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/get/:id', zValidator('param', idRequest), async (c) => {
		try {
			const { id } = c.req.param();
			const result = await getFlowById(id);

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/statics/:fid', async (c) => {
		try {
			const { fid } = c.req.param();
			const result = await getStatics(Number(fid));

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post('/publish/:id', zValidator('param', idRequest), async (c) => {
		try {
			const { id } = c.req.param();
			await publishFlow(id);

			return c.json({ message: 'Success' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

export const flowApi = new Hono().route('/api/flows', router);

export type Router = typeof router;

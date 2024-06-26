import {
	getFlowList,
	upsertFlow,
	deleteFlow,
	getStatics,
	publishFlow
} from '$lib/server/flowService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { flowRequest, idRequest } from './requests';
import { logger } from 'hono/logger';

export const flowsRouter = new Hono()
	.use(logger())
	.post('/', zValidator('json', flowRequest), async (c) => {
		try {
			const { name, cover, creator, input, id, seller } = c.req.valid('json');
			if (!name || !creator || !input || !cover) {
				throw c.json({ message: 'Need name, creator, input , cover' }, 400);
			}

			const result = await upsertFlow({ name, cover, creator, input, id, seller });

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/list', async (c) => {
		try {
			const { creator, hasTraced, offset, max, status } = c.req.query();
			const result = await getFlowList(
				Number(creator),
				Number(status),
				Number(offset),
				Number(max),
				hasTraced === 'true'
			);

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
	.get('/statistic/:fid', async (c) => {
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

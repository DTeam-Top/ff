import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { flowRequest } from './requests';
import { logger } from 'hono/logger';
import { upsertFlow } from '$lib/server/flowService';

export const publicRouter = new Hono()
	.use(logger())
	.post('/flows', zValidator('json', flowRequest), async (c) => {
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
	});

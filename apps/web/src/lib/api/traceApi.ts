import { getTraces } from '$lib/server/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { idRequest } from './requests';
import { logger } from 'hono/logger';

export const tracesRouter = new Hono()
	.use(logger())
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

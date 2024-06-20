import { getStatics } from '$lib/server/flowService';
import { getAllTraces } from '$lib/server/traceService';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

export const commonRouter = new Hono()
	.use(logger())
	.get('/statics', async (c) => {
		try {
			const result = await getStatics(0);

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/browse', async (c) => {
		try {
			const { offset, max } = c.req.query();
			const result = await getAllTraces(Number(offset), Number(max));

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

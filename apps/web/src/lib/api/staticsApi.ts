import { getStatics } from '$lib/server/flowService';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

export const staticsRouter = new Hono().use(logger()).get('/statics', async (c) => {
	try {
		const result = await getStatics(0);

		return c.json(result);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		return c.json({ message: e.code + ': ' + e.message }, 500);
	}
});

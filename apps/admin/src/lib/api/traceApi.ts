import { existTraceByFlow, insertTrace } from '$lib/db/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
export const TraceRequest = z.object({
	cast: z.string(),
	flow: z.number(),
	parentCast: z.string().optional(),
	caster: z.number()
});

export const getRequest = z.object({
	creator: z.number()
});

export const deleteRequest = z.object({
	id: z.string()
});

export const ParamRequest = z.object({
	name: z.string()
});

export const router = new Hono().post('/', zValidator('json', TraceRequest), async (c) => {
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
});

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

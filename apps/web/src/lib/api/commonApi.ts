import { getFlowById, getStatics } from '$lib/server/flowService';
import { getAllTraces } from '$lib/server/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { idRequest, verfiyUserRequest } from './requests';
import { STATUS_PUBLISHED } from '$lib/server/serverConsts';
import { statusMessagePipe } from '$lib/server/utils';
import { env } from '$env/dynamic/private';
import { sign } from 'hono/jwt';

export const commonRouter = new Hono()
	.use(logger())
	.get('/statistic', async (c) => {
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
	})
	.get('/flows/get/:id', zValidator('param', idRequest), async (c) => {
		try {
			const { id } = c.req.param();
			const { type } = c.req.query();
			const result = await getFlowById(id);
			if (type !== 'edit' && result && result.status !== STATUS_PUBLISHED) {
				return c.json({ message: statusMessagePipe(result.status) }, 500);
			}
			return c.json(result);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post('/generate', zValidator('json', verfiyUserRequest), async (c) => {
		try {
			const { fid, signerUuid } = c.req.valid('json');

			const payload = {
				fid: fid,
				uuid: signerUuid,
				time: Date.now()
			};
			const apiKey = await sign(payload, env.JWT_SECRET);
			return c.json({ apiKey: apiKey });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

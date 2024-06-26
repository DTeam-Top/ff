import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { apiKeyRequest, apiKeyUpdateRequest, fidRequest } from './requests';
import { logger } from 'hono/logger';
import { getApikeyList, insertApikey, updateApikey } from '../server/apikeyService';
import { env } from '$env/dynamic/private';
import { sign } from 'hono/jwt';

export const apiKeyRouter = new Hono()
	.use(logger())

	.get('/list/:fid', zValidator('param', fidRequest), async (c) => {
		try {
			const { fid } = c.req.param(); //

			const { offset, max } = c.req.query();
			const result = await getApikeyList(fid, Number(offset), Number(max));

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post('/update/:fid', zValidator('json', apiKeyUpdateRequest), async (c) => {
		try {
			const { fid } = c.req.param();
			const { disabled } = c.req.valid('json');

			const result = await updateApikey(Number(fid), disabled);

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post('/', zValidator('json', apiKeyRequest), async (c) => {
		try {
			const { fid } = c.req.valid('json');
			const payload = {
				fid: fid,
				time: Date.now()
			};

			const apiKey = await sign(payload, env.JWT_SECRET);
			await insertApikey(fid, apiKey);

			return c.json({ message: 'Success', apiKey: apiKey });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

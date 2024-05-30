import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { fidRequest } from './requests';
import { getCommissionList } from '$lib/db/commissionService';

export const router = new Hono().get('/:fid', zValidator('param', fidRequest), async (c) => {
	try {
		const { fid } = c.req.param(); //

		const result = await getCommissionList(fid);

		return c.json(result);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		return c.json({ message: e.code + ': ' + e.message }, 500);
	}
});

export const commissionApi = new Hono().route('/api/commissions', router);

export type Router = typeof router;

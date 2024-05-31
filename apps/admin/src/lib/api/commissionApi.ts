import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { fidRequest, withdrawRequest } from './requests';
import { getCommissionList, withdraw } from '$lib/db/commissionService';

export const router = new Hono()
	.get('/:fid', zValidator('param', fidRequest), async (c) => {
		try {
			const { fid } = c.req.param(); //

			const result = await getCommissionList(fid);

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.post('/withdraw', zValidator('json', withdrawRequest), async (c) => {
		try {
			const { address, fid } = c.req.valid('json');
			await withdraw(address, fid);

			return c.json({ message: 'Success' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	});

export const commissionApi = new Hono().route('/api/commissions', router);

export type Router = typeof router;

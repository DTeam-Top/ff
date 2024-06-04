import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { fidRequest, withdrawRequest } from './requests';
import { getCommissionList, getHistoryList, withdraw } from '$lib/server/commissionService';

export const router = new Hono()
	.get('/:fid', zValidator('param', fidRequest), async (c) => {
		try {
			const { fid } = c.req.param(); //

			const { offset, max } = c.req.query();
			const result = await getCommissionList(fid, Number(offset), Number(max));

			return c.json(result);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			return c.json({ message: e.code + ': ' + e.message }, 500);
		}
	})
	.get('/history/:fid', zValidator('param', fidRequest), async (c) => {
		try {
			const { fid } = c.req.param(); //

			const { offset, max } = c.req.query();
			const result = await getHistoryList(fid, Number(offset), Number(max));

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

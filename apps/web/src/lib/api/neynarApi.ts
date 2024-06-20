import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { userRequest, verfiyUserRequest } from './requests';
import { lookupSigner, lookupUserByFid } from '$lib/server/neynarClient';
import { logger } from 'hono/logger';

export const neynarRouter = new Hono()
	.use(logger())
	.post('/verify-user', zValidator('json', verfiyUserRequest), async (c) => {
		const { fid, signerUuid } = c.req.valid('json');
		if (!fid || !signerUuid) {
			throw c.json({ message: 'Need fid, signerUuid' }, 400);
		}
		let isVerifiedUser = false;
		try {
			const signer = await lookupSigner(signerUuid);

			if (!signer) {
				throw c.json({ message: 'Signer not found' }, 404);
			}

			if (signer.fid?.toString() === fid) {
				isVerifiedUser = true;
			} else {
				throw c.json({ message: 'Invalid signerUuid' }, 404);
			}

			return c.json({ isVerifiedUser: isVerifiedUser, message: 'Success' });
		} catch (e) {
			console.log(e);
			throw c.json({ message: 'Error occured' }, 500);
		}
	})
	.get('/user/:fid', zValidator('param', userRequest), async (c) => {
		const { fid } = c.req.valid('param');
		if (!fid) {
			throw c.json({ message: 'Need fid' }, 400);
		}
		try {
			const user = await lookupUserByFid(parseInt(fid));

			if (!user) {
				throw c.json({ message: 'User not found' }, 404);
			}

			return c.json(user);
		} catch (e) {
			console.log(e);
			throw c.json({ message: 'Error occured' }, 500);
		}
	});

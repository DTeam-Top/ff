import { createCast, lookupSigner, lookupUserByFid } from '$lib/clients';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const verfiyUserRequest = z.object({
	fid: z.string(),
	signerUuid: z.string()
});
const paramRequest = z.object({
	fid: z.string()
});

const castRequest = z.object({
	fid: z.string(),
	signerUuid: z.string(),
	frameUrl: z.string(),
	content: z.string()
});

export const router = new Hono()
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
	.get('/user/:fid', zValidator('param', paramRequest), async (c) => {
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
	})
	.post('/publish', zValidator('json', castRequest), async (c) => {
		const { fid, signerUuid, frameUrl, content } = c.req.valid('json');
		console.log('publis---', { fid, signerUuid, frameUrl, content });
		if (!fid || !signerUuid || !frameUrl) {
			throw c.json({ message: 'Need fid, signerUuid, frameUrl' }, 400);
		}
		try {
			const cast = await createCast(signerUuid, content, frameUrl);

			return c.json(cast);
		} catch (e) {
			console.log(e);
			throw c.json({ message: 'Error occured' }, 500);
		}
	});

export const neynarApi = new Hono().route('/api', router);

export type Router = typeof router;

import { insertTrace } from '$lib/server/traceService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { castRequest, userRequest, verfiyUserRequest } from './requests';
import { createCast, lookupSigner, lookupUserByFid } from '$lib/server/neynarClient';

export const router = new Hono()
	.post('/verify-user', zValidator('json', verfiyUserRequest), async (c) => {
		const { fid, signerUuid } = c.req.valid('json');
		if (!fid || !signerUuid) {
			throw c.json({ message: 'Need fid, signerUuid' }, 400);
		}
		let isVerifiedUser = false;
		try {
			console.log(new Date(), 'verify-user', fid, signerUuid);
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
	})
	.post('/publish', zValidator('json', castRequest), async (c) => {
		const { fid, signerUuid, frameUrl, content, flowId } = c.req.valid('json');
		if (!fid || !signerUuid || !frameUrl) {
			throw c.json({ message: 'Need fid, signerUuid, frameUrl' }, 400);
		}
		try {
			const cast = await createCast(signerUuid, content, frameUrl);
			// todo delete it
			await insertTrace({
				cast: `${cast.cast.author.fid}_${cast.cast.hash}`,
				flow: flowId,
				parentCast: undefined,
				caster: Number(fid)
			});

			return c.json(cast);
		} catch (e) {
			console.log(e);
			throw c.json({ message: 'Error occured' }, 500);
		}
	});

export const neynarApi = new Hono().route('/api', router);

export type Router = typeof router;

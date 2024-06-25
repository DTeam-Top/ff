import { env } from '$env/dynamic/private';
import { verifyAuth } from '$lib/server/apikeyService';
import { lookupSigner } from '$lib/server/neynarClient';
import type { Handle } from '@sveltejs/kit';
import { verify } from 'hono/jwt';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/s/')) {
		const auth = event.request.headers.get('Authorization')?.split(' ')[1] || '';
		let accessInValid = !auth;
		if (auth) {
			const payload = await verify(auth, env.JWT_SECRET);
			accessInValid = !payload;
			if (payload) {
				try {
					const signer = await lookupSigner(payload.uuid);
					accessInValid = !signer || signer.fid?.toString() !== payload.fid;
				} catch (e) {
					accessInValid = true;
				}
			}
		}

		if (accessInValid) {
			return new Response('Unauthorized for backend api', { status: 401 });
		}
	}

	if (event.url.pathname.startsWith('/api/p/')) {
		const auth = event.request.headers.get('Authorization')?.split(' ')[1] || '';
		const verified = await verifyAuth(auth);
		if (!verified) {
			return new Response('Unauthorized', { status: 401 });
		}
	}

	const response = await resolve(event);
	return response;
};

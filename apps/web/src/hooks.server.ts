import { verifyAuth } from '$lib/server/apikeyService';
import { lookupSigner } from '$lib/server/neynarClient';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/s/')) {
		const uuKey = event.request.headers.get('uu_key');
		let accessInValid = !uuKey;
		if (uuKey) {
			const userData = uuKey.split('_');
			try {
				const signer = await lookupSigner(userData[1]);
				accessInValid = !signer || signer.fid?.toString() !== userData[0];
			} catch (e) {
				accessInValid = true;
			}
		}

		if (accessInValid) {
			return new Response('Unauthorized', { status: 401 });
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

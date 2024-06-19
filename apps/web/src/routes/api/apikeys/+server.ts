import { apikeyApi } from '$lib/api/apikeyApi';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => {
	return apikeyApi.fetch(request);
};
export const POST: RequestHandler = ({ request }) => apikeyApi.fetch(request);

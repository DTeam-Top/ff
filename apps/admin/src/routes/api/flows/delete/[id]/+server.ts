import { flowApi } from '$lib/api/flowApi';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => {
	return flowApi.fetch(request);
};
export const POST: RequestHandler = ({ request }) => flowApi.fetch(request);

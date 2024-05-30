import { traceApi } from '$lib/api/traceApi';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => {
	return traceApi.fetch(request);
};
export const POST: RequestHandler = ({ request }) => traceApi.fetch(request);

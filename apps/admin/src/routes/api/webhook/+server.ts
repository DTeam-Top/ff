import { webhookApi } from '$lib/api/webhook';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => {
	return webhookApi.fetch(request);
};
export const POST: RequestHandler = ({ request }) => webhookApi.fetch(request);

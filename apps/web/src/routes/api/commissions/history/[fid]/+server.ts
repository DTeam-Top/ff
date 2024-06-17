import { commissionApi } from '$lib/api/commissionApi';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => {
	return commissionApi.fetch(request);
};
export const POST: RequestHandler = ({ request }) => commissionApi.fetch(request);

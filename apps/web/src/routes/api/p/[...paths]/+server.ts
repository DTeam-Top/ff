import { publicApi } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => publicApi.fetch(request);
export const POST: RequestHandler = ({ request }) => publicApi.fetch(request);

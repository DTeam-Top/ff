import { frameApi } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => frameApi.fetch(request);
export const POST: RequestHandler = ({ request }) => frameApi.fetch(request);

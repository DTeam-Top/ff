import { secretApi } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => secretApi.fetch(request);
export const POST: RequestHandler = ({ request }) => secretApi.fetch(request);

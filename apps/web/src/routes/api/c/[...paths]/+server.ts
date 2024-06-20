import { commonApi } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => commonApi.fetch(request);
export const POST: RequestHandler = ({ request }) => commonApi.fetch(request);

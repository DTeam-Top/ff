import { frameApi } from "$lib/api/frameApi";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request }) => {
  return frameApi.fetch(request);
};
export const POST: RequestHandler = ({ request }) => frameApi.fetch(request);

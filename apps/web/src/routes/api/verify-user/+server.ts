import { neynarApi } from "$lib/api/neynarApi";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request }) => {
  return neynarApi.fetch(request);
};
export const POST: RequestHandler = ({ request }) => neynarApi.fetch(request);

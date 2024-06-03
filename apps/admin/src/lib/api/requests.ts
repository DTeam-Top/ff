import { z } from 'zod';

export const flowRequest = z.object({
	name: z.string(),
	cover: z.string(),
	creator: z.number(),
	input: z.object({
		price: z.string(),
		nft: z.string()
	}),
	id: z.number().optional()
});

export const getRequest = z.object({
	creator: z.number()
});

export const idRequest = z.object({
	id: z.string()
});

export const withdrawRequest = z.object({
	address: z.string(),
	fid: z.number()
});

export const paramRequest = z.object({
	name: z.string()
});

export const traceRequest = z.object({
	cast: z.string(),
	flow: z.number(),
	parentCast: z.string().optional(),
	caster: z.number()
});

export const shareRequest = z.object({
	parentCast: z.string(),
	fid: z.number()
});

export const updateTxRequest = z.object({
	cast: z.string(),
	paymentTx: z.string(),
	amount: z.string()
});

export const verfiyUserRequest = z.object({
	fid: z.string(),
	signerUuid: z.string()
});
export const fidRequest = z.object({
	fid: z.string()
});

export const userRequest = z.object({
	fid: z.string()
});

export const castRequest = z.object({
	fid: z.number(),
	signerUuid: z.string(),
	frameUrl: z.string(),
	content: z.string(),
	flowId: z.number()
});

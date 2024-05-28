import { LOGGER } from '$lib/db/constant';
import { flows } from 'dbdomain';
import { db } from './dbService';
import { eq } from 'drizzle-orm';
export type Flow = {
	id: number | undefined;
	name: string;
	cover: string | undefined;
	input: { price: string };
	creator: number;
};

const logger = LOGGER.child({ from: 'db' });

export const upsertFlow = async (flow: Flow) => {
	logger.info(flow);
	try {
		if (flow.id) {
			await db
				.update(flows)
				.set({
					name: flow.name,
					cover: flow.cover,
					input: flow.input,
					creator: flow.creator
				})
				.where(eq(flows.id, flow.id));
		} else {
			await db.insert(flows).values({
				name: flow.name,
				cover: flow.cover,
				input: flow.input,
				creator: flow.creator,
				createdAt: new Date()
			});
		}
		const result = await db.select().from(flows).where(eq(flows.name, flow.name));
		return result.length > 0 ? result[0] : null;
	} catch (e: any) {
		logger.error(e);
		throw e;
		//return null;
	}
};

export const getFlowList = async (creator: number) => {
	const result = await db.select().from(flows).where(eq(flows.creator, creator));
	return result;
};

export const deleteFlow = async (id: number) => {
	const result = await db.delete(flows).where(eq(flows.id, id));
	return result;
};

export const getFlowById = async (id: number) => {
	const result = await db.select().from(flows).where(eq(flows.id, id));
	return result;
};

export const shareFlow = async (id: number) => {
	let share;
	const result = await db.select().from(flows).where(eq(flows.id, id));
	console.log(result, id);
	if (result.length > 0) {
		const flow = result[0];
		console.log(flow, id);

		share = await db
			.insert(flows)
			.values({
				name: `share ${flow.name} at ${new Date().getTime()} `,
				cover: flow.cover,
				input: flow.input,
				creator: flow.creator,
				createdAt: new Date()
			})
			.returning();
		console.log('share', share);
	}

	return share;
};

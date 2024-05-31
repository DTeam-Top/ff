import { LOGGER } from '$lib/db/constant';
import { flows, tracePayments, traces } from 'dbdomain';
import { db } from './dbService';
import { count, countDistinct, eq } from 'drizzle-orm';
export type Flow = {
	id: number | undefined;
	name: string;
	cover: string | undefined;
	input: { price: string; nft: string };
	creator: number;
};

const logger = LOGGER.child({ from: 'db' });

export const upsertFlow = async (flow: Flow) => {
	logger.info(flow);
	let result;
	try {
		if (flow.id) {
			result = await db()
				.update(flows)
				.set({
					name: flow.name,
					cover: flow.cover,
					input: flow.input,
					creator: flow.creator
				})
				.where(eq(flows.id, flow.id))
				.returning();
		} else {
			result = await db()
				.insert(flows)
				.values({
					name: flow.name,
					cover: flow.cover,
					input: flow.input,
					creator: Number(flow.creator),
					createdAt: new Date()
				})
				.returning();
		}
		console.log(result);

		return result.length > 0 ? result[0] : null;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.error(e);
		throw e;
		//return null;
	}
};

export const getFlowList = async (creator: number) => {
	const result = await db().select().from(flows).where(eq(flows.creator, creator));
	return result;
};

export const deleteFlow = async (id: number) => {
	const result = await db().delete(flows).where(eq(flows.id, id));
	return result;
};

export const getFlowById = async (id: number) => {
	const result = await db().select().from(flows).where(eq(flows.id, id));
	return result.length > 0 ? result[0] : null;
};

export const getStatics = async (fid: number | undefined) => {
	const runData = await db()
		.select({ value: count() })
		.from(flows)
		.where(fid ? eq(flows.creator, fid) : undefined);
	const publishData = await db()
		.select({ value: count() })
		.from(traces)
		.where(fid ? eq(traces.caster, fid) : undefined);
	const dealedData = await db()
		.select({ value: count() })
		.from(tracePayments)
		.leftJoin(traces, eq(traces.id, tracePayments.trace))
		.where(fid ? eq(traces.caster, fid) : undefined);

	const fidCount = await db()
		.select({ value: countDistinct(traces.caster) })
		.from(traces);

	return {
		banner: [
			{ title: 'Published', count: runData[0].value },
			{ title: 'Running', count: publishData[0].value },
			{ title: 'Dealed', count: dealedData[0].value }
		],
		card: [
			{ title: 'Unique fids', count: fidCount[0].value, color: '#fee4cb' },
			{ title: 'Trade volume', count: dealedData[0].value, color: '#d1d5db' }
		]
	};
};

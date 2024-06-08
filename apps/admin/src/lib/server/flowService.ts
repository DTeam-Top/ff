import { db } from '$lib/server/dbService';
import { LOGGER, STATUS_PUBLISHED } from '$lib/server/serverConsts';
import { flows, tracePayments, traces } from 'dbdomain';
import { count, countDistinct, eq, sql } from 'drizzle-orm';

export type Flow = {
	id?: string;
	name: string;
	cover?: string;
	input: { price: string; address: string };
	creator: number;
};

const logger = LOGGER.child({ from: 'db flowService' });

export const upsertFlow = async (flow: Flow) => {
	logger.info(flow);
	console.log(flow);
	let result;
	try {
		if (flow.id !== 'uuid') {
			result = await db()
				.update(flows)
				.set({
					name: flow.name,
					cover: flow.cover,
					input: flow.input,
					creator: flow.creator
				})
				.where(eq(flows.id, flow.id!))
				.returning();
		} else {
			result = await db()
				.insert(flows)
				.values({
					name: flow.name,
					cover: flow.cover!,
					input: flow.input,
					creator: Number(flow.creator),
					createdAt: Date.now()
				})
				.returning();
		}
		console.log(result);

		return result.length > 0 ? result[0] : null;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.error(e);
		throw e;
	}
};

export const getFlowList = async (creator: number, hasTraced: boolean) => {
	console.log(hasTraced);
	if (hasTraced) {
		return await db()
			.select({
				id: flows.id,
				name: flows.name,
				cover: flows.cover,
				createdAt: flows.createdAt,
				input: flows.input,
				traceCount: count(traces.id),
				paymentCount: count(tracePayments.id)
			})
			.from(flows)
			.leftJoin(traces, eq(traces.flow, flows.id))
			.leftJoin(tracePayments, eq(tracePayments.trace, traces.id))
			.where(eq(flows.creator, creator))
			.groupBy(flows.id)
			.having(sql`${count(traces.id)} > 0`);
	} else {
		return await db()
			.select({
				id: flows.id,
				name: flows.name,
				cover: flows.cover,
				createdAt: flows.createdAt,
				input: flows.input,
				traceCount: count(traces.id),
				paymentCount: count(tracePayments.id)
			})
			.from(flows)
			.leftJoin(traces, eq(traces.flow, flows.id))
			.leftJoin(tracePayments, eq(tracePayments.trace, traces.id))
			.where(eq(flows.creator, creator))
			.groupBy(flows.id);
	}
};

export const deleteFlow = async (id: string) => {
	const result = await db().delete(flows).where(eq(flows.id, id));
	return result;
};

export const getFlowById = async (id: string) => {
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

export const publishFlow = async (flowId: string) => {
	await db().update(flows).set({ status: STATUS_PUBLISHED }).where(eq(flows.id, flowId));
};

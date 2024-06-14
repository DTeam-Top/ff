import { db } from '$lib/server/dbService';
import { LOGGER, STATUS_PUBLISHED } from '$lib/server/serverConsts';
import { flows, tracePayments, traces } from 'dbdomain';
import { count, countDistinct, eq, sql, and, ne } from 'drizzle-orm';

export type Flow = {
	id?: string;
	name: string;
	cover?: string;
	input: {
		price: string;
		addressList: { type: string; address: string; amount?: string; tokenId?: string }[];
	};
	creator: number;
	seller: string;
};

const logger = LOGGER.child({ from: 'db flowService' });

export const upsertFlow = async (flow: Flow) => {
	logger.info(flow);
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
					createdAt: Date.now(),
					seller: flow.seller
				})
				.returning();
		}

		return result.length > 0 ? result[0] : null;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.error(e);
		throw e;
	}
};

export const getFlowList = async (
	creator: number,
	status: number,
	offset: number,
	max: number,
	hasTraced: boolean
) => {
	let total = [];
	let list = [];
	if (hasTraced) {
		total = await db()
			.select({
				count: sql`count(distinct(flows.id))`.mapWith(Number)
			})
			.from(flows)
			.rightJoin(traces, eq(traces.flow, flows.id))
			.where(and(eq(flows.creator, creator), eq(flows.status, status)));
		list = await db()
			.select({
				id: flows.id,
				name: flows.name,
				cover: flows.cover,
				createdAt: flows.createdAt,
				input: flows.input,
				traceCount: count(traces.id),
				status: flows.status,
				paymentCount: count(tracePayments.id)
			})
			.from(flows)
			.leftJoin(traces, eq(traces.flow, flows.id))
			.leftJoin(tracePayments, eq(tracePayments.trace, traces.id))
			.where(and(eq(flows.creator, creator), eq(flows.status, status)))
			.groupBy(flows.id)
			.having(sql`${count(traces.id)} > 0`)
			.limit(max)
			.offset(offset);
	} else {
		total = await db()
			.select({
				count: count(flows.id)
			})
			.from(flows)
			.where(and(eq(flows.creator, creator), eq(flows.status, status)));

		list = await db()
			.select({
				id: flows.id,
				name: flows.name,
				cover: flows.cover,
				createdAt: flows.createdAt,
				input: flows.input,
				status: flows.status,
				traceCount: count(traces.id),
				paymentCount: count(tracePayments.id)
			})
			.from(flows)
			.leftJoin(traces, eq(traces.flow, flows.id))
			.leftJoin(tracePayments, eq(tracePayments.trace, traces.id))
			.where(and(eq(flows.creator, creator), eq(flows.status, status)))
			.groupBy(flows.id)
			.limit(max)
			.offset(offset);
	}
	return { total: total[0].count, list };
};

export const deleteFlow = async (id: string) => {
	const result = await db().delete(flows).where(eq(flows.id, id));
	return result;
};

export const getFlowById = async (id: string) => {
	const result = await db()
		.select({
			id: flows.id,
			name: flows.name,
			cover: flows.cover,
			createdAt: flows.createdAt,
			input: flows.input,
			status: flows.status,
			traceCount: count(traces.id),
			paymentCount: count(tracePayments.id),
			seller: flows.seller
		})
		.from(flows)
		.leftJoin(traces, eq(traces.flow, flows.id))
		.leftJoin(tracePayments, eq(tracePayments.trace, traces.id))
		.where(eq(flows.id, id))
		.groupBy(flows.id);
	return result.length > 0 ? result[0] : null;
};

export const getStatics = async (fid: number | undefined) => {
	const runData = await db()
		.select({ value: count() })
		.from(flows)
		.where(and(fid ? eq(flows.creator, fid) : undefined, eq(flows.status, 1)));

	const dealedData = await db()
		.select({ value: count() })
		.from(flows)
		.where(and(fid ? eq(flows.creator, fid) : undefined, eq(flows.status, 3)));

	const fidCount = await db().execute<{ value: number }>(
		sql`select count(distinct(fid)) from ((select  distinct(caster) as fid from traces) union (select distinct(creator) as fid from flows)) as fids;`
	);
	console.log(fidCount.rows[0]);
	const totalData = await db()
		.select({ value: count() })
		.from(tracePayments)
		.innerJoin(traces, eq(traces.id, tracePayments.trace))
		.where(fid ? eq(traces.caster, fid) : undefined);

	return {
		banner: [
			{ title: 'Running Flows', count: runData[0].value },
			{ title: 'Dealed Flows', count: dealedData[0].value }
		],
		card: [
			{ title: 'Total Volume', count: totalData[0].value, color: '#d1d5db' },
			{ title: 'Unique Fids', count: fidCount.rows[0].count, color: '#fee4cb' }
		]
	};
};

export const publishFlow = async (flowId: string) => {
	await db().update(flows).set({ status: STATUS_PUBLISHED }).where(eq(flows.id, flowId));
};

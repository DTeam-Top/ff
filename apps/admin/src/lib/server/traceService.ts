import { parseEther } from 'ethers';
import { flows, tracePayments, traces } from 'dbdomain';

import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/dbService';
import { LOGGER } from '$lib/server/serverConsts';
export type Trace = {
	cast: string;
	flow: string;
	parentCast: string | undefined;
	caster: number;
};

const logger = LOGGER.child({ from: 'db' });

export const insertTrace = async (trace: Trace) => {
	logger.info(trace);
	try {
		await db().insert(traces).values({
			cast: trace.cast,
			flow: trace.flow,
			parentCast: trace.parentCast,
			caster: trace.caster,
			createdAt: Date.now()
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.error(e);
		throw e;
	}
};

export const existTraceByFlow = async (flow: string) => {
	const result = await db().select().from(traces).where(eq(traces.flow, flow));
	return result.length > 0;
};

export const createTracePayment = async (
	flow: string,
	cast: string,
	paymentTx: string,
	amount: string
) => {
	try {
		const result = await db()
			.select()
			.from(traces)
			.where(and(eq(traces.flow, flow), eq(traces.cast, cast)));
		if (result.length > 0) {
			const trace = result[0];
			await db()
				.insert(tracePayments)
				.values({
					trace: trace.id,
					amount: parseEther(`${amount}`),
					paymentTx: paymentTx
				});
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.error(e);
		throw e;
	}

	return;
};

export const getTraces = async (flow: string, caster: string) => {
	const result = await db()
		.select({
			name: flows.name,
			cover: flows.cover,
			input: flows.input,
			creator: flows.creator,
			id: flows.id,
			cast: traces.cast,
			traceTime: traces.createdAt,
			paymentTx: tracePayments.paymentTx,
			paymentTs: tracePayments.paymentTs
		})
		.from(traces)
		.leftJoin(flows, eq(traces.flow, flows.id))
		.leftJoin(tracePayments, eq(tracePayments.trace, traces.id))
		.where(and(eq(traces.flow, flow), eq(traces.caster, Number(caster))));
	return result;
};

import { LOGGER } from '$lib/db/constant';
import { tracePayments, traces } from '../../../../../packages/dbdomain/dist/dbdomain';
import { db } from './dbService';
import { and, eq } from 'drizzle-orm';
export type Trace = {
	cast: string;
	flow: number;
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
			createdAt: new Date()
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.error(e);
		throw e;
	}
};

export const existTraceByFlow = async (flow: number) => {
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
			.where(and(eq(traces.flow, Number(flow)), eq(traces.cast, cast)));
		if (result.length > 0) {
			const trace = result[0];
			await db().insert(tracePayments).values({
				trace: trace.id.toString(),
				amount: amount,
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

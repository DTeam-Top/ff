import { LOGGER } from '$lib/db/constant';
import { traces } from 'dbdomain';
import { db } from './dbService';
import { eq } from 'drizzle-orm';
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
		await db.insert(traces).values({
			cast: trace.cast,
			flow: trace.flow,
			parentCast: trace.parentCast,
			caster: trace.caster,
			createdAt: new Date()
		});
	} catch (e: any) {
		logger.error(e);
		throw e;
	}
};

export const existTraceByFlow = async (flow: number) => {
	const result = await db.select().from(traces).where(eq(traces.flow, flow));
	return result.length > 0;
};

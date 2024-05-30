import { eq } from 'drizzle-orm';
import { db } from './dbService';
import { commissions, flows, tracePayments } from 'dbdomain';

export const getCommissionList = async (fid: string) => {
	const result = await db()
		.select({
			cover: flows.cover,
			name: flows.name,
			commission: commissions.commission,
			createdAt: commissions.createdAt,
			tx: tracePayments.paymentTx
		})
		.from(commissions)
		.leftJoin(flows, eq(commissions.flow, flows.id))
		.leftJoin(tracePayments, eq(commissions.payment, tracePayments.id))
		.where(eq(commissions.fid, Number(fid)));

	return result;
};

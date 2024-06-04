import { count, eq, inArray, isNull, sum, and, isNotNull } from 'drizzle-orm';

import { commissions, flows, tracePayments } from 'dbdomain';
import { db } from '$lib/server/dbService';
import { withdrawContract } from '$lib/server/serverConsts';

export const getCommissionList = async (fid: string, offset: number, max: number) => {
	const result = await db()
		.select({
			cover: flows.cover,
			name: flows.name,
			commission: commissions.commission,
			createdAt: commissions.createdAt,
			tx: tracePayments.paymentTx,
			id: commissions.id
		})
		.from(commissions)
		.leftJoin(flows, eq(commissions.flow, flows.id))
		.leftJoin(tracePayments, eq(commissions.payment, tracePayments.id))
		.where(and(eq(commissions.fid, Number(fid)), isNull(commissions.withdrawnTx)))
		.limit(max)
		.offset(offset);

	const balance = await db()
		.select({ value: sum(commissions.commission) })
		.from(commissions)
		.where(and(eq(commissions.fid, Number(fid)), isNull(commissions.withdrawnTx)));

	const total = await db()
		.select({ value: count() })
		.from(commissions)
		.where(and(eq(commissions.fid, Number(fid)), isNull(commissions.withdrawnTx)));

	return {
		commissionList: result,
		total: total[0].value,
		balance: balance[0].value ? balance[0].value : 0
	};
};

export const getHistoryList = async (fid: string, offset: number, max: number) => {
	const result = await db()
		.select({
			cover: flows.cover,
			name: flows.name,
			commission: commissions.commission,
			createdAt: commissions.createdAt,
			tx: tracePayments.paymentTx,
			id: commissions.id,
			withdrawnTx: commissions.withdrawnTx,
			withdrawnAt: commissions.withdrawnAt
		})
		.from(commissions)
		.leftJoin(flows, eq(commissions.flow, flows.id))
		.leftJoin(tracePayments, eq(commissions.payment, tracePayments.id))
		.where(and(eq(commissions.fid, Number(fid)), isNotNull(commissions.withdrawnTx)))
		.limit(max)
		.offset(offset);

	const balance = await db()
		.select({ value: sum(commissions.commission) })
		.from(commissions)
		.where(and(eq(commissions.fid, Number(fid)), isNotNull(commissions.withdrawnTx)));

	const total = await db()
		.select({ value: count() })
		.from(commissions)
		.where(and(eq(commissions.fid, Number(fid)), isNotNull(commissions.withdrawnTx)));

	return {
		commissionList: result,
		total: total[0].value,
		balance: balance[0].value ? balance[0].value : 0
	};
};

export const withdraw = async (address: string, fid: number) => {
	const commissionList = await db()
		.select()
		.from(commissions)
		.where(and(eq(commissions.fid, fid), isNull(commissions.withdrawnTx)));

	const idList = [];
	let amount = 0;

	for (const commission of commissionList) {
		idList.push(commission.id);
		amount += commission.commission;
	}
	console.log(amount);
	const mintData = {
		to: address,
		amount: amount.toString()
	};
	console.log(mintData, idList);
	const tx = await withdrawContract().transferEarnings(mintData.to, mintData.amount, {
		gasLimit: 600000
	});

	console.log('result', tx.hash);
	const result = await db()
		.update(commissions)
		.set({ withdrawnTx: tx.hash })
		.where(inArray(commissions.id, idList));

	return result;
};

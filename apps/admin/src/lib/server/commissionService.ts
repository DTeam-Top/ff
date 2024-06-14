import { count, eq, inArray, isNull, sum, and, isNotNull } from 'drizzle-orm';

import { commissions, flows, tracePayments } from 'dbdomain';
import { db } from '$lib/server/dbService';
import { flowContract, getServerWallet } from '$lib/server/serverConsts';
import { ethers, keccak256 } from 'ethers';

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

	let totalCommisstion = total[0].value;

	const available = await flowContract().available(fid);
	if (totalCommisstion && available === BigInt(totalCommisstion)) {
		totalCommisstion = available;
	}

	return {
		commissionList: result,
		total: totalCommisstion,
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
	try {
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

		const available = await flowContract().available(fid);

		if (available === BigInt(amount)) {
			amount = available;
		}
		console.log(available, amount, available === BigInt(amount));
		const message = keccak256(
			encodePacked([
				['uint256', fid],
				['address', address]
			])
		);
		console.log(message);
		const sig = await getServerWallet().signMessage(ethers.getBytes(message));
		console.log({ address, amount: amount.toString(), sig });
		const tx = await flowContract().withdraw(fid, address, sig, {
			gasLimit: 600000
		});

		console.log('hash--', tx.hash);

		const result = await db()
			.update(commissions)
			.set({ withdrawnTx: tx.hash })
			.where(inArray(commissions.id, idList));

		return result;
	} catch (e) {
		console.log(e);
		return { error: e };
	}
};

export const encodePacked = (params: any) => {
	let types: any[] = [];
	let values: any[] = [];

	params.forEach((itemArray: any) => {
		types.push(itemArray[0]);
		values.push(itemArray[1]);
	});

	return ethers.solidityPacked(types, values);
};

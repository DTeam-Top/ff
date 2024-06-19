import { eq } from 'drizzle-orm';

import { apiKeys } from 'dbdomain';
import { db } from '$lib/server/dbService';

export const getApikeyList = async (fid: string, offset: number, max: number) => {
	const result = await db()
		.select()
		.from(apiKeys)
		.where(eq(apiKeys.owner, Number(fid)))
		.limit(max)
		.offset(offset);

	return result;
};
export const insertApikey = async (fid: number, apiKey: string) => {
	const result = await db().select().from(apiKeys).where(eq(apiKeys.owner, fid));
	console.log(result);
	if (result.length > 0) {
		await db()
			.update(apiKeys)
			.set({
				apiKey: apiKey
			})
			.where(eq(apiKeys.id, apiKeys.id!));
	} else {
		await db()
			.insert(apiKeys)
			.values({
				owner: fid,
				apiKey: apiKey,
				disabled: false
			})
			.onConflictDoNothing()
			.returning();
	}

	return result;
};
export const updateApikey = async (fid: number, disabled: boolean) => {
	const result = await db()
		.update(apiKeys)
		.set({ disabled: disabled })
		.where(eq(apiKeys.owner, fid));
	return result;
};

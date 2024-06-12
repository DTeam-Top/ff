import { commissions } from "dbdomain";
import { eq, isNotNull, isNull, and } from "drizzle-orm";
import { db, provider } from "../utils.js";

export async function withdrawalChecker() {
  const rows = await db()
    .select()
    .from(commissions)
    .where(
      and(isNotNull(commissions.withdrawnTx), isNull(commissions.withdrawnAt))
    );

  for (const commission of rows) {
    if (commission.withdrawnTx) {
      const result = await provider.getTransactionReceipt(
        commission.withdrawnTx
      );

      if (result?.status === 1) {
        await db()
          .update(commissions)
          .set({ withdrawnAt: Date.now() })
          .where(eq(commissions.id, commission.id));
      } else if (result?.status === 0) {
        await db()
          .update(commissions)
          .set({ withdrawnAt: -1 }) // mark as failed
          .where(eq(commissions.id, commission.id));
      }
    }
  }
}

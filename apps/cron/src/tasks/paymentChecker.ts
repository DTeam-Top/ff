import { commissions, flows, tracePayments, traces } from "dbdomain";
import { eq, isNotNull, isNull, and } from "drizzle-orm";
import { db, provider } from "../utils.js";

export async function paymentChecker() {
  const rows = await db()
    .select()
    .from(tracePayments)
    .innerJoin(traces, eq(tracePayments.trace, traces.id))
    .innerJoin(flows, and(eq(traces.flow, flows.id), eq(flows.status, 1)))
    .where(
      and(isNotNull(tracePayments.paymentTx), isNull(tracePayments.paymentTs))
    );

  for (const row of rows) {
    const result = await provider.getTransactionReceipt(
      row.trace_payments.paymentTx
    );

    if (result?.status) {
      await db().transaction(async (tx) => {
        await tx
          .update(tracePayments)
          .set({ paymentTs: Date.now(), commissionPaid: 1 }) // mark as commission paid
          .where(eq(tracePayments.id, row.trace_payments.id));

        await tx
          .update(flows)
          .set({ status: 3 }) // mark the flow as done
          .where(eq(flows.id, row.flows.id));

        await tx.insert(commissions).values({
          flow: row.flows.id,
          payment: row.trace_payments.id,
          fid: Number(row.traces.caster),
          // TODO: change to bignumber.js for better precision
          commission: (row.trace_payments.amount * 1 * 10) / 10000,
          createdAt: Date.now(),
        });
      });
    } else if (result?.status === 0) {
      await db()
        .update(tracePayments)
        .set({ paymentTs: -1 }) // mark as failed
        .where(eq(tracePayments.id, row.trace_payments.id));
    }
  }
}

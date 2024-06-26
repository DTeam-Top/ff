import { commissions, flows, tracePayments, traces } from "dbdomain";
import { eq, isNotNull, isNull, and } from "drizzle-orm";
import { db, provider } from "../utils.js";
import { formatEther, parseEther } from "ethers";
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: 100 });

export async function paymentChecker() {
  try {
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
            .set({ status: 3 }) // mark the flow as dealed
            .where(eq(flows.id, row.flows.id));
          await tx.insert(commissions).values({
            flow: row.flows.id,
            payment: row.trace_payments.id,
            fid: Number(row.traces.caster),
            commission: parseEther(
              new BigNumber(formatEther(row.trace_payments.amount))
                .multipliedBy(1)
                .multipliedBy(10)
                .dividedBy(10000)
                .toString()
            ),
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
  } catch (e) {
    console.log(e);
  }
}

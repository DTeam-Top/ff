import { sql, eq, isNull, isNotNull, and } from "drizzle-orm";
import { db } from "../utils.js";
//import { commissions, traces, flows, tracePayments } from "dbdomain";
import { ROYALTY_RATIO } from "./constants.js";
import { commissions, flows, tracePayments, traces } from "dbdomain";

// select id, amount from trace_payments where commission_paid < 0
// for each payment:
// 1. find all casters for the payment recursively, pull all in a {caster, payment_id}[]
// 2. average the commission amount for each caster
// 3. insert commissions and update trace_payments.commission_paid, with a transaction

export async function updateCommission(batchSize = 100) {
  const payments = await db()
    .select()
    .from(tracePayments)
    .where(
      sql`${tracePayments.commissionPaid} is null and ${tracePayments.paymentTs} > 0`
    )
    .orderBy(tracePayments.id)
    .limit(batchSize);

  for (const payment of payments) {
    let traceRecords = await db()
      .select({
        flowCreator: flows.creator,
        caster: traces.caster,
        flow: traces.flow,
      })
      .from(tracePayments)
      .leftJoin(traces, eq(tracePayments.trace, traces.id))
      .leftJoin(flows, eq(flows.id, traces.flow))
      .where(
        and(
          isNull(tracePayments.commissionPaid),
          isNotNull(tracePayments.paymentTs),
          eq(tracePayments.id, payment.id)
        )
      );

    if (traceRecords.length > 0) {
      const amount = (payment.amount * ROYALTY_RATIO) / 2;
      //   if (traceRecords[0].caster === traceRecords[0].flowCreator) {
      //     return;
      //   }

      await db().transaction(async (tx) => {
        const creatorCommission = await tx
          .insert(commissions)
          .values({
            flow: traceRecords[0].flow || "",
            payment: payment.id,
            fid: Number(traceRecords[0].flowCreator),
            commission: amount,
            createdAt: Date.now(),
          })
          .returning();

        let casterCommission = [];
        if (traceRecords[0].flowCreator !== traceRecords[0].caster) {
          casterCommission = await tx
            .insert(commissions)
            .values({
              flow: traceRecords[0].flow || "",
              payment: payment.id,
              fid: Number(traceRecords[0].caster),
              commission: amount,
              createdAt: Date.now(),
            })
            .returning();
        }
        console.log("insert commission---");

        if (
          (traceRecords[0].flowCreator !== traceRecords[0].caster &&
            casterCommission.length > 0 &&
            creatorCommission.length > 0) ||
          (traceRecords[0].flowCreator == traceRecords[0].caster &&
            creatorCommission.length > 0)
        ) {
          await tx
            .update(tracePayments)
            .set({ commissionPaid: 1 })
            .where(eq(tracePayments.id, payment.id));
        } else {
          throw new Error("Error in inserting commission");
        }
      });
    }
  }
}

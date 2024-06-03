import { sqliteTable, integer, index, text } from "drizzle-orm/sqlite-core";

export const tracePayments = sqliteTable(
  "trace_payments",
  {
    id: integer("id").primaryKey(),
    trace: integer("trace").notNull(), // trace id
    amount: integer("amount").notNull(), // payment amount, eth
    paymentTx: text("payment_tx").notNull(), // payment tx hash
    paymentTs: integer("payment_ts", { mode: "timestamp" }), // payment timestamp
    commissionPaid: integer("commission_paid"), //  -1 for not paid, 1 for paid
  },
  (tracePayments) => ({
    idxTrace: index("idx_tp_trace").on(tracePayments.trace),
  })
);

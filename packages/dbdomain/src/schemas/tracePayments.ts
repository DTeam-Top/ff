import {
  pgTable,
  integer,
  index,
  text,
  bigint,
  serial,
} from "drizzle-orm/pg-core";

export const tracePayments = pgTable(
  "trace_payments",
  {
    id: serial("id").primaryKey(),
    trace: integer("trace").notNull(), // trace id
    amount: bigint("amount", { mode: "number" }).notNull(), // payment amount, eth
    paymentTx: text("payment_tx").notNull(), // payment tx hash
    paymentTs: bigint("payment_ts", { mode: "number" }), // payment timestamp
    commissionPaid: integer("commission_paid"), //  -1 for not paid, 1 for paid
  },
  (tracePayments) => ({
    idxTrace: index("idx_tp_trace").on(tracePayments.trace),
  })
);

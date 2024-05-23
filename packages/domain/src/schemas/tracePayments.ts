import { sqliteTable, integer, index, text } from "drizzle-orm/sqlite-core";

export const tracePayments = sqliteTable(
  "trace_payments",
  {
    id: integer("id").primaryKey(),
    trace: text("trace"), // trace id
    paymentTx: text("payment_tx"), // payment tx hash
    paymentTs: integer("created_at", { mode: "timestamp" }), // payment timestamp
  },
  (tracePayments) => ({
    idxTrace: index("idx_tp_trace").on(tracePayments.trace),
  })
);

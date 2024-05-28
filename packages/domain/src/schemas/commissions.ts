import { sqliteTable, integer, index, text } from "drizzle-orm/sqlite-core";

export const commissions = sqliteTable(
  "commissions",
  {
    id: integer("id").primaryKey(),
    flow: integer("flow_id").notNull(), // flow id,
    payment: integer("payment_id").notNull(), // payment id
    fid: integer("fid").notNull(), // fid of the commission receiver
    commission: integer("commission").notNull(), // commission amount
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    withdrawnTx: text("withdrawn_tx"), // withdrawn tx hash
    withdrawnAt: integer("withdrawn_at", { mode: "timestamp" }), // withdrawn timestamp
  },
  (commissions) => ({
    idxFlow: index("idx_commissions_flow").on(commissions.flow),
    idxFid: index("idx_commissions_fid").on(commissions.fid),
    idxPayment: index("idx_commissions_payment").on(commissions.payment),
  })
);

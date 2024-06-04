import {
  pgTable,
  integer,
  index,
  text,
  bigint,
  uuid,
  serial,
} from "drizzle-orm/pg-core";

export const commissions = pgTable(
  "commissions",
  {
    id: serial("id").primaryKey(),
    flow: uuid("flow_id").notNull(), // flow id,
    payment: integer("payment_id").notNull(), // payment id
    fid: integer("fid").notNull(), // fid of the commission receiver
    commission: bigint("commission", { mode: "number" }).notNull(), // commission amount
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    withdrawnTx: text("withdrawn_tx"), // withdrawn tx hash
    withdrawnAt: bigint("withdrawn_at", { mode: "number" }), // withdrawn timestamp
  },
  (commissions) => ({
    idxFlow: index("idx_commissions_flow").on(commissions.flow),
    idxFid: index("idx_commissions_fid").on(commissions.fid),
    idxPayment: index("idx_commissions_payment").on(commissions.payment),
  })
);

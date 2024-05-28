import { sqliteTable, integer, index, text } from "drizzle-orm/sqlite-core";

export const traces = sqliteTable(
  "traces",
  {
    id: integer("id").primaryKey(),
    cast: text("cast").notNull(), // cast id for a flow
    flow: integer("flow_id").notNull(), // flow id
    parentCast: text("parent_cast"), // parent cast id
    caster: integer("caster").notNull(), // trace caster fid
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (traces) => ({
    idxFlow: index("idx_traces_flow").on(traces.flow),
    idxCast: index("idx_traces_cast").on(traces.cast),
  })
);

import {
  pgTable,
  integer,
  index,
  text,
  bigint,
  uniqueIndex,
  uuid,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";

export const traces = pgTable(
  "traces",
  {
    id: serial("id").primaryKey(),
    cast: text("cast_id").notNull(), // cast id for a flow
    flow: uuid("flow_id").notNull(), // flow id
    parentCast: text("parent_cast"), // parent cast id
    caster: integer("caster").notNull(), // trace caster fid
    casterProfile: jsonb("caster_profile"), // caster profile json {username,displayName,avatar}
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (traces) => ({
    idxFlow: index("idx_traces_flow").on(traces.flow),
    idxCast: uniqueIndex("idx_traces_cast").on(traces.cast),
  })
);

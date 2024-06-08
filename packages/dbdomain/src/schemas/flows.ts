import {
  pgTable,
  text,
  integer,
  uniqueIndex,
  jsonb,
  bigint,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const flows = pgTable(
  "flows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(), // flow name
    cover: text("cover").notNull(), // cover image url
    input: jsonb("input").notNull(), // flow input json for flow frame
    creator: integer("creator").notNull(), // flow creator fid
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    status: integer("status").notNull().default(0), // status: 0 for draft,1 for published, 2 for unavailable
  },
  (flows) => ({
    idxName: uniqueIndex("idx_flow_name").on(flows.name),
    idxCreator: index("idx_flow_creator").on(flows.creator),
  })
);

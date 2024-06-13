import {
  pgTable,
  text,
  integer,
  uniqueIndex,
  jsonb,
  bigint,
  uuid,
  index,
  varchar,
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
    status: integer("status").notNull().default(0), // status: 0 for draft,1 for published, 2 for unavailable, 3 done
    seller: varchar("seller", { length: 42 }).notNull(), // seller address
  },
  (flows) => ({
    idxName: uniqueIndex("idx_flow_name").on(flows.name),
    idxCreator: index("idx_flow_creator").on(flows.creator),
    idxSeller: index("idx_flow_seller").on(flows.seller),
  })
);

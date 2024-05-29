import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  blob,
  index,
} from "drizzle-orm/sqlite-core";

export const flows = sqliteTable(
  "flows",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(), // flow name
    cover: text("cover").notNull(), // cover image url
    input: blob("input", { mode: "json" }).notNull(), // flow input json for flow frame
    creator: integer("creator").notNull(), // flow creator fid
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (flows) => ({
    idxName: uniqueIndex("idx_flow_name").on(flows.name),
    idxCreator: index("idx_flow_creator").on(flows.creator),
  })
);

import {
  pgTable,
  integer,
  text,
  serial,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const apiKeys = pgTable(
  "api_keys",
  {
    id: serial("id").primaryKey(),
    owner: integer("owner").notNull(), // owner fid
    apiKey: text("api_key"), // apiKey
    disabled: boolean("disabled").default(false),
  },
  (apiKeys) => ({
    idxOwner: uniqueIndex("idx_apiKey_owner").on(apiKeys.owner),
  })
);

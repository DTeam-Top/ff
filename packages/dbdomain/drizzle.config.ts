import type { Config } from "drizzle-kit";

const DB_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
export default {
  dialect: "postgresql",
  schema: "./src/schemas/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DB_URL,
  },
} satisfies Config;

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas/*.ts",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? "ff_admin",
    password: process.env.DB_PASSWORD ?? "admin",
    database: process.env.DB_NAME ?? "ff",
  },
});

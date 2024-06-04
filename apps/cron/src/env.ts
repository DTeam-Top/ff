import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export const env = createEnv({
  clientPrefix: "",
  server: {
    INFURA_PROJECT_ID: z.string(),
    DB_HOST: z.string().default("127.0.0.1"),
    DB_PORT: z.coerce.number().default(5432),
    DB_USER: z.string().default("ff_admin"),
    DB_PASSWORD: z.string().default("admin"),
    DB_DATABASE: z.string().default("ff"),
  },
  client: {},
  runtimeEnv: process.env,
});

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
    REPLICATER_DB_HOST: z.string().default("127.0.0.1"),
    REPLICATER_DB_PORT: z.coerce.number().default(6541),
    REPLICATER_DB_USER: z.string().default("replicater"),
    REPLICATER_DB_PASSWORD: z.string().default("password"),
    REPLICATER_DB_DATABASE: z.string().default("replicater"),
    VERIFY_DOMAIN: z.string().default("ff-frame.vercel.app"),
  },
  client: {},
  runtimeEnv: process.env,
});

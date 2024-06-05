import { JobCallback, Spec, scheduleJob } from "node-schedule";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { env } from "./env.js";
export type Jobs = { rule: Spec; job: JobCallback }[];
export type DbConfig = { db: string };

export const createJobs = (jobs: Jobs) => {
  jobs.forEach(({ rule, job }) => {
    scheduleJob(rule, job);
  });
};

const { Pool } = pkg;
const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

export function db() {
  return drizzle(pool);
}

const replicaterPool = new Pool({
  host: env.REPLICATER_DB_HOST,
  port: Number(env.REPLICATER_DB_PORT),
  user: env.REPLICATER_DB_USER,
  password: env.REPLICATER_DB_PASSWORD,
  database: env.REPLICATER_DB_DATABASE,
});

export function replicaterDB() {
  return drizzle(replicaterPool);
}

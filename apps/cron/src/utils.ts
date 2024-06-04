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

console.log(env.DB_DATABASE);
const { Pool } = pkg;
const pool = new Pool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
});

export function db() {
  return drizzle(pool);
}

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { JobCallback, Spec, scheduleJob } from "node-schedule";

export type Jobs = { rule: Spec; job: JobCallback }[];
export type DbConfig = { db: string };

export const createJobs = (jobs: Jobs) => {
  jobs.forEach(({ rule, job }) => {
    scheduleJob(rule, job);
  });
};

const dbConfig: DbConfig = { db: "../../flow.db" };
export function db() {
  const sqlite = new Database(dbConfig.db);
  return drizzle(sqlite);
}

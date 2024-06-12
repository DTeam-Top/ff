import { JobCallback, Spec, scheduleJob } from "node-schedule";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env.js";
import { ethers } from "ethers";

export type Jobs = { rule: Spec; job: JobCallback }[];
export type DbConfig = { db: string };

export const provider = new ethers.InfuraProvider(
  env.NETWORK,
  env.INFURA_PROJECT_ID
);
export const MAX_LIMIT = 100;

let runningJobs: boolean[];

export const createJobs = (jobs: Jobs) => {
  runningJobs = new Array(jobs.length).fill(false);
  jobs.forEach(({ rule, job }, index) => {
    scheduleJob(rule, async (firedate) => {
      if (runningJobs[index]) {
        console.warn("Job is already running");
        return;
      }
      runningJobs[index] = true;
      await job(firedate);
      runningJobs[index] = false;
    });
  });
};

export function db() {
  return drizzle(
    new Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    })
  );
}

export function replicaterDB() {
  return drizzle(
    new Pool({
      host: env.REPLICATER_DB_HOST,
      port: Number(env.REPLICATER_DB_PORT),
      user: env.REPLICATER_DB_USER,
      password: env.REPLICATER_DB_PASSWORD,
      database: env.REPLICATER_DB_DATABASE,
    })
  );
}

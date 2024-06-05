import { sql } from "drizzle-orm";
import { db, replicaterDB } from "../utils.js";
import { traces } from "dbdomain";
import { env } from "../env.js";
import { MAX_LIMIT } from "./constants.js";

export async function getTotal() {
  const conditions = `%${env.VERIFY_DOMAIN}%`;

  const records = await replicaterDB().execute(
    sql`SELECT count(*) FROM ( SELECT json_array_elements(embeds) as content from casts ) as ffcasts WHERE ffcasts.content ->> 'url' ilike ${conditions}`
  );

  console.log(records.rows);
  return records.rows.length > 0 ? Number(records.rows[0].count) : 0;
}

export async function insertTrace(offset: number, batchSize = MAX_LIMIT) {
  console.log(offset);
  const conditions = `%${env.VERIFY_DOMAIN}%`;

  const records = await replicaterDB().execute(
    sql`SELECT *, '0x'||encode(hash, 'hex') as casthash, '0x'||encode(parent_hash, 'hex') as parenthash,'0x'||encode(root_parent_hash, 'hex') as roothash, content ->> 'url' as url FROM ( SELECT fid, hash, parent_fid, parent_hash, parent_url, root_parent_hash, root_parent_url, json_array_elements(embeds) as content,created_at from casts ) as ffcasts WHERE ffcasts.content ->> 'url' ilike ${conditions} limit ${batchSize} offset ${offset}`
  );

  for (const record of records.rows) {
    console.log(record);
    createTrace(record);
  }
}

export const createTrace = async (data: any) => {
  const url = new URL(data.url);
  const params = url.pathname.split("/api/");

  if (params.length === 2) {
    let parentCast = null;
    if (data.parent_hash && data.parent_fid) {
      parentCast = `${data.parent_fid}_${data.parenthash}`;
    }
    const trace = {
      cast: `${data.fid}_${data.casthash}`,
      flow: params[1],
      parentCast: parentCast,
      caster: data.fid,
    };

    console.log(trace);

    const result = await db()
      .insert(traces)
      .values({
        cast: trace.cast,
        flow: trace.flow,
        parentCast: trace.parentCast,
        caster: trace.caster,
        createdAt: Date.now(),
      })
      .onConflictDoNothing()
      .returning({ id: traces.id });
    console.log("returning", result);
  }
  return;
};

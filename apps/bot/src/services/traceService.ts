import { db } from "./utils";
import { traces } from "dbdomain";

export const createTrace = async (data: any) => {
  const url = new URL(data.embeds[0].url);
  const params = url.pathname.split("/api/");

  if (params.length === 2) {
    let parentCast = null;
    if (data.parent_hash && data.parent_author) {
      parentCast = `${data.parent_author.fid}_${data.parent_hash}`;
    }
    const trace = {
      cast: `${data.author.fid}_${data.hash}`,
      flow: params[1],
      parentCast: parentCast,
      caster: data.author.fid,
      casterProfile: {
        username: data.author.username,
        displayName: data.author.display_name,
        avatar: data.author.pfp_url,
      },
    };

    const result = await db()
      .insert(traces)
      .values({
        cast: trace.cast,
        flow: trace.flow,
        parentCast: trace.parentCast,
        caster: trace.caster,
        casterProfile: trace.casterProfile,
        createdAt: Date.now(),
      })
      .onConflictDoNothing()
      .returning({ id: traces.id });
    console.log("returning", result);
  }
  return;
};

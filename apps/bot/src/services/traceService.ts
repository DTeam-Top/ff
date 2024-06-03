import { db } from "./utils";
import { traces } from "dbdomain";

export const createTrace = async (data: any) => {
  if (
    data.embeds.length > 0 &&
    data.embeds[0].url.indexOf("ff-frame.vercel.app") > -1
  ) {
    console.log(data);
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
      };

      console.log(trace);

      await db()
        .insert(traces)
        .values({
          cast: trace.cast,
          flow: Number(trace.flow),
          parentCast: trace.parentCast,
          caster: trace.caster,
          createdAt: new Date(),
        }).onConflictDoNothing;
    }
    return;
  }
};

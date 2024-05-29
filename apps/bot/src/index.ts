import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createTrace } from "./services/traceService";
import { TYPE_CREATED } from "./services/constants";

const app = new Hono().basePath("/api");

app.post("/", async (c) => {
  console.log(JSON.stringify(await c.req.json()));
  const reqData = await c.req.json();

  switch (reqData.type) {
    case TYPE_CREATED: {
      if (
        !reqData.data.embeds.length ||
        reqData.data.embeds[0].url.indexOf("ff-frame.vercel.app") === -1
      ) {
        return;
      }

      await createTrace(reqData.data);
      break;
    }
    default:
      break;
  }

  return c.json({ message: "Success!" });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

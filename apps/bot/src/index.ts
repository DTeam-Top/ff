import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createTrace } from "./services/traceService";
import { TYPE_CREATED } from "./services/constants";
import { createHmac } from "crypto";
import { env } from "./env";

const app = new Hono().basePath("/api");

app.post("/", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header()["x-neynar-signature"];
  if (!sig) {
    throw new Error("Neynar signature missing from request headers");
  }

  const webhookSecret = env.NEYNAR_WEBHOOK_SECRET;
  console.log(webhookSecret);

  console.log(env.VERIFY_DOMAIN);
  if (!webhookSecret) {
    throw new Error(
      "Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file"
    );
  }

  const hmac = createHmac("sha512", webhookSecret);
  hmac.update(body);

  const generatedSignature = hmac.digest("hex");

  const isValid = generatedSignature === sig;
  if (!isValid) {
    throw new Error("Invalid webhook signature");
  }

  const reqData = JSON.parse(body);
  console.log(JSON.stringify(reqData));

  switch (reqData.type) {
    case TYPE_CREATED: {
      console.log(reqData.data.embeds.length);
      console.log(reqData.data.embeds[0]);
      console.log(env.VERIFY_DOMAIN);

      if (
        !reqData.data.embeds.length ||
        reqData.data.embeds[0].url.indexOf(env.VERIFY_DOMAIN) === -1
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

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

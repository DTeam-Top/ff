import { Hono } from "hono";
import { handle } from "hono/vercel";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.all("/", async (c) => {
  console.log(JSON.stringify(await c.req.json()));
  return c.json({ message: "Hello Hono!" });
});

export default handle(app);

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const FramenRequest = z.object({
  price: z.number(),
  nft: z.string(),
  image: z.string(),
});
export const ParamRequest = z.object({
  name: z.string(),
});

export const router = new Hono().post(
  "/:name",
  zValidator("param", ParamRequest),
  zValidator("json", FramenRequest),
  async (c) => {
    const { name } = c.req.param();

    const { price, nft, image } = c.req.valid("json");
    console.log(name, price, nft, image);
    console.log(name);
    if (!nft || !image) {
      throw c.json({ message: "Need price, nft, image" }, 400);
    }

    console.log(name);

    return c.json({ message: "Success" });
  }
);

export const frameApi = new Hono().route("/api", router);

export type Router = typeof router;

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const verfiyUserRequest = z.object({
  fid: z.string(),
  signerUuid: z.string(),
});
export const ParamRequest = z.object({
  name: z.string(),
});

export const router = new Hono().post(
  "/verify-user",
  zValidator("json", verfiyUserRequest),
  async (c) => {
    const { fid, signerUuid } = c.req.valid("json");
    console.log(fid, signerUuid);
    console.log(name);
    if (!fid || !signerUuid) {
      throw c.json({ message: "Need price, nft, image" }, 400);
    }

    console.log(name);

    return c.json({ message: "Success" });
  }
);

export const neynarApi = new Hono().route("/api", router);

export type Router = typeof router;

import { flows } from "dbdomain";
import { db } from "../utils";
import { eq } from "drizzle-orm";

export async function ownerShipChecker() {
  const rows = await db().select().from(flows).where(eq(flows.status, 1));

  for (const row of rows) {
    // check input
    // if any erc20 / erc721 / erc1155 token
    // (erc20.balanceOf(seller) != input value;
    // (erc721.ownerOf(tokenId) != seller;
    // (erc1155.balanceOf(seller, 1) != input value;
    // if (...) {
    //   await db()
    //     .update(flows)
    //     .set({ status: 2 }) // mark as unavailable
    //     .where(eq(flows.id, row.id));
    // }
  }
}

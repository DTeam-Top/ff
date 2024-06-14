import { flows } from "dbdomain";
import { db, provider } from "../utils";
import { eq } from "drizzle-orm";
import { ERC155_ABI, ERC20_ABI, ERC721_ABI } from "../abi";
import { ethers, formatEther } from "ethers";

export async function ownerShipChecker() {
  const rows = await db().select().from(flows).where(eq(flows.status, 1));
  console.log(rows);
  for (const row of rows) {
    for (const token of row.input.addressList) {
      let available = true;
      switch (token.type) {
        case "ERC20": {
          const balance = await new ethers.Contract(
            token.address,
            ERC20_ABI,
            provider
          ).balanceOf(row.seller);
          available = Number(formatEther(balance)) > Number(token.amount);
          break;
        }
        case "ERC721": {
          console.log(token);
          const owner = await new ethers.Contract(
            token.address,
            ERC721_ABI,
            provider
          ).ownerOf(token.tokenId);

          available = owner.toLowerCase() === row.seller.toLowerCase();
          break;
        }
        case "ERC1155": {
          const balance = await new ethers.Contract(
            token.address,
            ERC155_ABI,
            provider
          ).ownerOf(row.seller, token.tokenId);
          available = Number(formatEther(balance)) > Number(token.amount);
          break;
        }
      }
      if (!available) {
        await db()
          .update(flows)
          .set({ status: 2 }) // mark as unavailable
          .where(eq(flows.id, row.id));
      }
      break;
    }
  }
}

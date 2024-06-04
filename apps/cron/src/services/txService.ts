import { eq, isNotNull, isNull, and } from "drizzle-orm";
import { db } from "../utils.js";
import { ethers } from "ethers";
import { commissions, tracePayments } from "dbdomain";
import { env } from "../env.js";

const network = "base-sepolia";

const projectId = env.INFURA_PROJECT_ID;
const provider = new ethers.InfuraProvider(network, projectId);

export const updateTracePayments = async () => {
  const payments = await db()
    .select()
    .from(tracePayments)
    .where(
      and(isNotNull(tracePayments.paymentTx), isNull(tracePayments.paymentTs))
    );
  for (const payment of payments) {
    const result = await provider.getTransactionReceipt(payment.paymentTx);
    if (result?.status) {
      console.log("update tracePayments");
      await db()
        .update(tracePayments)
        .set({ paymentTs: Date.now() })
        .where(eq(tracePayments.id, payment.id));
    }
  }
};

export const updateComission = async () => {
  const commissionList = await db()
    .select()
    .from(commissions)
    .where(
      and(isNotNull(commissions.withdrawnTx), isNull(commissions.withdrawnAt))
    );

  console.log(commissionList);
  for (const commission of commissionList) {
    if (commission.withdrawnTx) {
      try {
        const result = await provider.getTransactionReceipt(
          commission.withdrawnTx
        );
        console.log(result);
        if (result?.status === 1) {
          console.log("update commissions");
          await db()
            .update(commissions)
            .set({ withdrawnAt: Date.now() })
            .where(eq(commissions.id, commission.id));
        } else if (result?.status === 0) {
          console.log("transaction failed");
          await db()
            .update(commissions)
            .set({ withdrawnTx: null })
            .where(eq(commissions.id, commission.id));
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};

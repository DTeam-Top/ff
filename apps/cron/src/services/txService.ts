import { eq, isNotNull, isNull, and } from "drizzle-orm";
import { db } from "../utils.js";
import { ethers } from "ethers";
import { commissions, tracePayments } from "dbdomain";

const network = "base-sepolia";

const projectId = process.env.INFURA_PROJECT_ID;
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
        .set({ paymentTs: new Date() })
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
  for (const commission of commissionList) {
    if (commission.withdrawnTx) {
      const result = await provider.getTransactionReceipt(
        commission.withdrawnTx
      );
      if (result?.status) {
        console.log("update commissions");
        await db()
          .update(commissions)
          .set({ withdrawnAt: new Date() })
          .where(eq(commissions.id, commission.id));
      }
    }
  }
};

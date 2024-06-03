import { updateComission, updateTracePayments } from "../services/txService.js";

let running = false;

export async function txChecker(table: string, txCol: string, tsCol: string) {
  // select $txCol from $table where $tsCol < 0
  // for each tx: ether provider.getTransactionReceipt( hash ) to find
  // - if null returned, not yet mined
  // - if a tx returned and its status === 1, update $table.

  if (running) {
    return;
  }
  running = true;
  console.log(new Date(), "txChecker -- ", table, txCol, tsCol);

  switch (table) {
    case "trace_payments":
      await updateTracePayments();
      break;
    default: //commissions
      await updateComission();
      break;
  }
  running = false;
}

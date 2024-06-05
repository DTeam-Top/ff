import { MAX_LIMIT } from "../services/constants.js";
import { getTotal, insertTrace } from "../services/traceService.js";
let running = false;
export async function castChecker() {
  // select id, amount from trace_payments where commission_paid < 0
  // for each payment:
  // 1. find all casters for the payment recursively, pull all in a {caster, payment_id}[]
  // 2. average the commission amount for each caster
  // 3. insert commissions and update trace_payments.commission_paid, with a transaction

  console.log(new Date(), "castChecker");
  if (running) {
    return;
  }
  running = true;
  const total = await getTotal();
  const page = Math.ceil(total / MAX_LIMIT);

  for (let i = 0; i < page; i++) {
    await insertTrace(i * MAX_LIMIT);
  }

  running = false;
}

import { updateCommission } from "../services/commissionService.js";
let running = false;
export function commissionChecker() {
  // select id, amount from trace_payments where commission_paid < 0
  // for each payment:
  // 1. find all casters for the payment recursively, pull all in a {caster, payment_id}[]
  // 2. average the commission amount for each caster
  // 3. insert commissions and update trace_payments.commission_paid, with a transaction

  console.log(new Date(), "commissionChecker");
  if (running) {
    return;
  }
  running = true;

  updateCommission();

  running = false;
}

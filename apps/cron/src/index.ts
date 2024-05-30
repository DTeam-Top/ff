import { commissionChecker } from "./tasks/commissionChecker.js";
import { txChecker } from "./tasks/txChecker.js";
//import { txChecker } from "./tasks/txChecker";
import { createJobs } from "./utils.js";

const cronJobs = [
  {
    rule: "*/5 * * * * *",
    job: () => {
      txChecker("trace_payments", "payment_tx", "payment_ts");
    },
  },
  {
    rule: "*/5 * * * * *",
    job: () => {
      txChecker("commission", "withdrawn_tx", "withdrawn_at");
    },
  },
  {
    rule: "*/5 * * * * *",
    job: commissionChecker,
  },
];

createJobs(cronJobs);

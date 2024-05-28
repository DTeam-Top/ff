import { commissionChecker } from "./tasks/commissionChecker";
import { txChecker } from "./tasks/txChecker";
import { createJobs } from "./utils";

const cronJobs = [
  {
    rule: "*/1 * * * *",
    job: () => {
      txChecker("trace_payments", "payment_tx", "payment_ts");
    },
  },
  {
    rule: "*/1 * * * *",
    job: () => {
      txChecker("commission", "withdrawn_tx", "withdrawn_at");
    },
  },
  {
    rule: "*/1 * * * *",
    job: commissionChecker,
  },
];

createJobs(cronJobs);

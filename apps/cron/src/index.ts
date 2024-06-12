import { ownerShipChecker } from "./tasks/ownerShipChecker.js";
import { paymentChecker } from "./tasks/paymentChecker.js";
import { withdrawalChecker } from "./tasks/withdrawalChecker.js";
import { createJobs } from "./utils.js";

const cronJobs = [
  {
    rule: "*/5 * * * * *",
    job: paymentChecker,
  },
  {
    rule: "*/5 * * * * *",
    job: withdrawalChecker,
  },
  {
    rule: "*/5 * * * * *",
    job: ownerShipChecker,
  },
];

createJobs(cronJobs);

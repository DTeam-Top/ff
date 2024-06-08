import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  tables: {
    Blacklist: {
      schema: {
        id: "address",
        blocked: "bool",
      },
      key: ["id"],
    },
    Commission: {
      schema: {
        fid: "uint256",
        balance: "uint256",
      },
      key: ["fid"],
    },
  },
});

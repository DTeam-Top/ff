import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  systems: {
    BlacklistSystem: {
      openAccess: false,
      // FlowsDvp Address
      accessList: ["0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9"],
    },
    CommissionSystem: {
      openAccess: false,
      // FlowsDvp Address
      accessList: ["0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9"],
    },
  },
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

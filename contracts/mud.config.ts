import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  systems: {
    BlacklistSystem: {
      openAccess: false,
      // FlowsDvp Address: local test
      accessList: ["0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9"],
      // FlowsDvp Address: base sepolia
      // accessList: ["0xFcAc032068C867373d0BA48aB0fa83142D557069"],
    },
    CommissionSystem: {
      openAccess: false,
      // FlowsDvp Address: local test
      accessList: ["0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9"],
      // FlowsDvp Address: base sepolia
      // accessList: ["0xFcAc032068C867373d0BA48aB0fa83142D557069"],
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

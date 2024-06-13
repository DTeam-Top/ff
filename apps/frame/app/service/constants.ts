export const ERC721_contract_84532 =
  "0xce8FEC9a10D4642368f124593098f2E4dD643652";

export const test_CONTRACT = "0x36e899b6908dc588e85ed0979e8e0dcd7e02a941";

export const text_css = {
  fontStyle: "bold",
  letterSpacing: "-0.025em",
  lineHeight: 1.4,
  //   marginTop: 10,
  display: "flex",
  padding: "0 20px",
  whiteSpace: "pre-wrap",
};

export const root_css = {
  alignItems: "flex-start",
  background: "black",
  backgroundSize: "100% 100%",
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  height: "100%",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
};

export function nodeConfig() {
  return {
    development: {
      network: "base-sepolia",
      dvp: "0xFcAc032068C867373d0BA48aB0fa83142D557069",
    },
    production: {
      network: "base-sepolia",
      dvp: "0xFcAc032068C867373d0BA48aB0fa83142D557069",
    }, //todo
    test: { network: "base-sepolia", dvp: "" },
  };
}

console.log(
  "node-env",
  process.env.NODE_ENV,
  nodeConfig()[process.env.NODE_ENV]?.dvp
);

export const DVP_ADDRESS: `0x${string}` = nodeConfig()[process.env.NODE_ENV]
  ?.dvp as `0x${string}`;

export const NETWORK = nodeConfig()[process.env.NODE_ENV]?.network;

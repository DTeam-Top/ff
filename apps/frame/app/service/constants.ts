import type * as CSS from "csstype";
export const TEXT_CSS: CSS.Properties = {
  fontStyle: "bold",
  letterSpacing: "-0.025em",
  lineHeight: 1.4,
  display: "flex",
  padding: "0 20px",
  whiteSpace: "pre-wrap",
};

export const ROOT_CSS: CSS.Properties = {
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

export const INFO_CSS: CSS.Properties = {
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

export const DVP_ADDRESS: `0x${string}` = nodeConfig()[process.env.NODE_ENV]
  ?.dvp as `0x${string}`;

export const NETWORK = nodeConfig()[process.env.NODE_ENV]?.network;

export const PUBLISHED = 1;

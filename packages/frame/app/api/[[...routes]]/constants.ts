export const test_abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "FID",
        type: "uint256",
      },
    ],
    name: "buyHat",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { type: "address", name: "to", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
    type: "function",
    name: "mint",
    stateMutability: "payable",
    payable: true,
    outputs: [],
  },
];

export const ERC20_contract_84532 =
  "0x1B633271826B30E86851adf5aa50871CDF9036C6";

export const ERC721_contract_84532 =
  "0xce8FEC9a10D4642368f124593098f2E4dD643652";

export const ERC20_ABI = [
  {
    type: "function",
    name: "mint",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      { type: "address", name: "to", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
    outputs: [],
  },
];

export const ERC721_ABI = [
  {
    type: "function",
    name: "mint",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      { type: "address", name: "to", internalType: "address" },
      { type: "uint256", name: "tokenId", internalType: "uint256" },
    ],
    outputs: [],
  },
];

export const test_CONTRACT = "0x36e899b6908dc588e85ed0979e8e0dcd7e02a941";

export const text_css = {
  fontStyle: "normal",
  letterSpacing: "-0.025em",
  lineHeight: 1.4,
  marginTop: 10,
  display: "flex",
  padding: "0 120px",
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

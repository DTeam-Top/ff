export const FLOWSDVP_ABI = [
  {
    type: "function",
    name: "deliver",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      { type: "string", name: "flowId" },
      { type: "uint256", name: "commissionReceiverFid" },
      { type: "address", name: "from" },
      { type: "address", name: "to" },
      {
        type: "tuple",
        name: "order",
        components: [
          { type: "uint256", name: "price" },
          {
            type: "tuple[]",
            name: "erc20",
            components: [
              { type: "address", name: "token" },
              { type: "uint256", name: "amount" },
            ],
          },
          {
            type: "tuple[]",
            name: "erc721",
            components: [
              { type: "address", name: "token" },
              { type: "uint256", name: "tokenId" },
            ],
          },
          {
            type: "tuple[]",
            name: "erc1155",
            components: [
              { type: "address", name: "token" },
              { type: "uint256", name: "tokenId" },
              { type: "uint256", name: "amount" },
            ],
          },
        ],
      },
      { type: "bytes", name: "sig" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "available",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [{ type: "uint256", name: "fid" }],
    outputs: [{ type: "uint256", name: "" }],
  },
  {
    type: "function",
    name: "withdraw",
    constant: false,
    payable: false,
    inputs: [
      { type: "uint256", name: "fid" },
      { type: "address", name: "account" },
      { type: "bytes", name: "sig" },
    ],
    outputs: [],
  },
];

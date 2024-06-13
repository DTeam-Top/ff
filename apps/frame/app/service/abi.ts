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
  {
    type: "function",
    name: "approve",
    constant: false,
    payable: false,
    inputs: [
      { type: "address", name: "spender" },
      { type: "uint256", name: "value" },
    ],
    outputs: [{ type: "bool", name: "" }],
  },
  {
    type: "function",
    name: "allowance",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      { type: "address", name: "owner" },
      { type: "address", name: "spender" },
    ],
    outputs: [{ type: "uint256", name: "" }],
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

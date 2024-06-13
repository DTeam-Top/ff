import { Interface } from "ethers";
const DVP_ABI = [
  `function deliver( string memory flowId, 
    uint256 commissionReceiverFid,
    address from,
    address to, 
    tuple(
        uint256 price,
        tuple(address token ,uint256 amount )[] erc20,
        tuple(address token,uint256 tokenId)[] erc721,
        tuple(address token,uint256 tokenId,uint256 amount)[] erc1155) memory order ,
         bytes calldata sig) external payable override`,
  "function available(uint256 fid) external view returns (uint256)",
  "function withdraw(uint256 fid, address account, bytes calldata sig) external",
  "function approve(address, uint256) external returns (bool)", //spender, value
  "function allowance(address, address) external view returns (uint256)",
];
const iface = new Interface(DVP_ABI);
const jsonAbi = iface.formatJson();
console.log(JSON.stringify(jsonAbi));

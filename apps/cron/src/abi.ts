export const ERC20_ABI = [
  "function transferEarnings(address, uint256) public",
  "function allowance(address, address) view returns (uint256)",
  "function decimals() external pure returns (uint8)",
  "function balanceOf(address) public view returns (uint256)",
];

export const ERC721_ABI = [
  "function isApprovedForAll(address, address) external view returns (bool)",
  "function getApproved(uint256) external view returns (address)",
  "function ownerOf(uint256 _tokenId) external view returns (address)",
  "function owner() public view returns (address)",
  "function balanceOf(address) public view returns (uint256)",
];
export const ERC155_ABI = [];

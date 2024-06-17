export const ERC20_ABI = [
	'function transferEarnings(address, uint256) public',
	'function allowance(address, address) view returns (uint256)',
	'function decimals() external pure returns (uint8)',
	'function balanceOf(address) public view returns (uint256)'
];

export const ERC721_ABI = [
	'function isApprovedForAll(address, address) external view returns (bool)',
	'function getApproved(uint256) external view returns (address)',
	'function ownerOf(uint256 _tokenId) external view returns (address)',
	'function owner() public view returns (address)',
	'function balanceOf(address) public view returns (uint256)'
];
export const ERC155_ABI = [];

export const FLOW_ABI = [
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
	'function available(uint256 fid) external view returns (uint256)',
	'function withdraw(uint256 fid, address account, bytes calldata sig) external',
	'function approve(address, uint256) external returns (bool)', //spender, value
	'function allowance(address, address) external view returns (uint256)'
];

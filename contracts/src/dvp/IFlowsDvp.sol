// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

struct TransferRequestERC20 {
  address token;
  uint256 amount;
}

struct TransferRequestERC721 {
  address token;
  uint256 tokenId;
}

struct TransferRequestERC1155 {
  address token;
  uint256 tokenId;
  uint256 amount;
}

struct Order {
  uint256 price;
  TransferRequestERC20[] erc20;
  TransferRequestERC721[] erc721;
  TransferRequestERC1155[] erc1155;
}

interface IFlowsDvp {
  event Delivered(string indexed flowId, address indexed from, address indexed to);

  function deliver(
    string memory flowId,
    uint256 commissionReceiverFid,
    address from,
    address to,
    Order memory order,
    bytes calldata sig
  ) external payable;

  function notInBlacklist(address account) external view returns (bool);

  function feeAndCommission(uint256 price) external view returns (uint256, uint256);
}

interface ICommissionController {
  event Withdrawn(uint256 indexed fid, address indexed account, uint256 amount);

  function available(uint256 fid) external view returns (uint256);

  function withdraw(uint256 fid, address account, bytes calldata sig) external;
}

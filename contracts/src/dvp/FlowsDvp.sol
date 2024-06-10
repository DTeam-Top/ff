// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import { IFlowsDvp, ICommissionController, TransferRequestERC20, TransferRequestERC721, TransferRequestERC1155, Order } from "./IFlowsDvp.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

contract FlowsDvp is IFlowsDvp, ICommissionController, Ownable {
  using ECDSA for bytes32;

  address internal _worldContractAddress;
  address internal _signer;

  uint256 public constant COMMON_DENOMINATOR = 10_000;
  uint256 internal _feeNumerator;
  uint256 internal _commissionNumerator;

  constructor(address signer) Ownable() {
    _signer = signer;
    _feeNumerator = 100; // fee: 1% * price
    _commissionNumerator = 1000; // commission: 10% * fee
  }

  modifier allowed(address account) {
    require(IWorld(_worldContractAddress).notInBlacklist(account), "account in the blacklist!");
    _;
  }

  function setWorldContractAddress(address worldContractAddress) external onlyOwner {
    _worldContractAddress = worldContractAddress;
  }

  function getWorldContractAddress() external view returns (address) {
    return _worldContractAddress;
  }

  function setSigner(address signer) external onlyOwner {
    _signer = signer;
  }

  function getSigner() external view returns (address) {
    return _signer;
  }

  function setFeeNumerator(uint256 feeNumerator) external onlyOwner {
    require(feeNumerator <= COMMON_DENOMINATOR, "FeeController: feeNumerator exceeds COMMON_DENOMINATOR");
    _feeNumerator = feeNumerator;
  }

  function getFeeNumerator() external view returns (uint256) {
    return _feeNumerator;
  }

  function setCommissionNumerator(uint256 commissionNumerator) external onlyOwner {
    require(commissionNumerator <= COMMON_DENOMINATOR, "FeeController: commissionNumerator exceeds COMMON_DENOMINATOR");
    _commissionNumerator = commissionNumerator;
  }

  function getCommissionNumerator() external view returns (uint256) {
    return _commissionNumerator;
  }

  function notInBlacklist(address account) external view returns (bool) {
    return IWorld(_worldContractAddress).notInBlacklist(account);
  }

  function addToBlacklist(address account) external override onlyOwner {
    IWorld(_worldContractAddress).addToBlacklist(account);
  }

  function removeFromBlacklist(address account) external override onlyOwner {
    IWorld(_worldContractAddress).removeFromBlacklist(account);
  }

  function feeAndCommission(uint256 amount) external view override returns (uint256, uint256) {
    uint256 fee = (amount * _feeNumerator) / COMMON_DENOMINATOR;
    uint256 commission = (fee * _commissionNumerator) / COMMON_DENOMINATOR;
    return (fee, commission);
  }

  function deliver(
    string memory flowId,
    uint256 commissionReceiverFid,
    address from,
    address to,
    Order memory order,
    bytes calldata sig
  ) external payable override allowed(from) allowed(to) allowed(msg.sender) {
    address signer = keccak256(abi.encodePacked(flowId, commissionReceiverFid, from, to))
      .toEthSignedMessageHash()
      .recover(sig);
    require(IWorld(_worldContractAddress).notInBlacklist(signer), "signer in the blacklist!");
    require(signer == _signer, "Invalid signature");

    require(msg.value == order.price, "Wrong value ETH");

    _batchTransfer(from, to, order);
    _pay(order.price, from, commissionReceiverFid);

    emit Delivered(flowId, from, to);
  }

  function available(uint256 fid) external view returns (uint256) {
    return IWorld(_worldContractAddress).balance(fid);
  }

  function withdraw(uint256 fid, address account, bytes calldata sig) external allowed(account) allowed(msg.sender) {
    address signer = keccak256(abi.encodePacked(fid, account)).toEthSignedMessageHash().recover(sig);
    require(IWorld(_worldContractAddress).notInBlacklist(signer), "signer in the blacklist!");
    require(signer == _signer, "Invalid signature");

    uint256 amount = IWorld(_worldContractAddress).balance(fid);
    require(amount > 0, "No balance to withdraw");

    IWorld(_worldContractAddress).withdraw(fid);
    Address.sendValue(payable(account), amount);
    emit Withdrawn(fid, account, amount);
  }

  function _batchTransfer(address from, address to, Order memory order) internal {
    for (uint256 i = 0; i < order.erc20.length; i++) {
      TransferRequestERC20 memory transfer = order.erc20[i];
      IERC20(transfer.token).transferFrom(from, to, transfer.amount);
    }

    for (uint256 i = 0; i < order.erc721.length; i++) {
      TransferRequestERC721 memory transfer = order.erc721[i];
      IERC721(transfer.token).safeTransferFrom(from, to, transfer.tokenId);
    }

    for (uint256 i = 0; i < order.erc1155.length; i++) {
      TransferRequestERC1155 memory transfer = order.erc1155[i];
      IERC1155(transfer.token).safeTransferFrom(from, to, transfer.tokenId, transfer.amount, "");
    }
  }

  function _pay(uint256 price, address from, uint256 fid) internal {
    (uint256 fee, uint256 netAmount) = _calcFeeAndNetAmount(price);
    Address.sendValue(payable(from), netAmount);

    uint256 commission = _calcCommission(fee);
    IWorld(_worldContractAddress).pay(fid, commission);
  }

  function _calcFeeAndNetAmount(uint256 amount) internal view returns (uint256, uint256) {
    uint256 fee = (amount * _feeNumerator) / COMMON_DENOMINATOR;
    return (fee, amount - fee);
  }

  function _calcCommission(uint256 fee) internal view returns (uint256) {
    return (fee * _commissionNumerator) / COMMON_DENOMINATOR;
  }
}

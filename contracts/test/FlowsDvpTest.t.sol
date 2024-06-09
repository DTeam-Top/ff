// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { console } from "forge-std/console.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { MyERC20, MyERC721, MyERC1155 } from "./Mocks.sol";
import { FlowsDvp } from "../src/dvp/FlowsDvp.sol";
import { TransferRequestERC20, TransferRequestERC721, TransferRequestERC1155, Order } from "../src/dvp/IFlowsDvp.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

contract FlowsDvpTest is MudTest {
  using ECDSA for bytes32;

  MyERC20 public erc20;
  MyERC721 public erc721;
  MyERC1155 public erc1155;
  address public signer;
  uint256 public signerPrivKey;

  FlowsDvp public dvp;

  function setUp() public override {
    super.setUp();
    erc20 = new MyERC20();
    erc721 = new MyERC721();
    erc1155 = new MyERC1155();
    (signer, signerPrivKey) = makeAddrAndKey("signer");
    dvp = new FlowsDvp(signer);

    console.logAddress(address(dvp));

    dvp.setWorldContractAddress(worldAddress);
  }

  function test_deliver() public {
    address seller = makeAddr("seller");
    address buyer = makeAddr("buyer");

    erc20.mint(1, seller);
    erc721.mint(1, seller);
    erc1155.mint(1, 1, seller);

    assertEq(erc20.balanceOf(seller), 1);
    assertEq(erc20.balanceOf(buyer), 0);
    assertEq(erc721.ownerOf(1), seller);
    assertEq(erc1155.balanceOf(seller, 1), 1);
    assertEq(erc1155.balanceOf(buyer, 1), 0);

    vm.startPrank(seller);
    erc20.approve(address(dvp), 1);
    erc721.approve(address(dvp), 1);
    erc1155.setApprovalForAll(address(dvp), true);
    vm.stopPrank();

    TransferRequestERC20[] memory erc20s = new TransferRequestERC20[](1);
    erc20s[0] = TransferRequestERC20(address(erc20), 1);
    TransferRequestERC721[] memory erc721s = new TransferRequestERC721[](1);
    erc721s[0] = TransferRequestERC721(address(erc721), 1);
    TransferRequestERC1155[] memory erc1155s = new TransferRequestERC1155[](1);
    erc1155s[0] = TransferRequestERC1155(address(erc1155), 1, 1);

    Order memory order = Order(100000, erc20s, erc721s, erc1155s);

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(
      signerPrivKey,
      keccak256(abi.encodePacked("flow1", uint256(1), seller, buyer)).toEthSignedMessageHash()
    );
    bytes memory sig = abi.encodePacked(r, s, v);
    dvp.deliver{ value: order.price }("flow1", uint256(1), seller, buyer, order, sig);

    assertEq(erc20.balanceOf(seller), 0);
    assertEq(erc20.balanceOf(buyer), 1);
    assertEq(erc721.ownerOf(1), buyer);
    assertEq(erc1155.balanceOf(seller, 1), 0);
    assertEq(erc1155.balanceOf(buyer, 1), 1);

    (uint256 fee, uint256 commission) = dvp.feeAndCommission(order.price);
    assertEqUint(seller.balance, order.price - fee);
    assertEqUint(fee, 1000);
    assertEqUint(commission, 100);
  }

  function test_cannotAccessWorldDirectly() public {
    vm.expectRevert();
    IWorld(worldAddress).pay(1, 1);

    vm.expectRevert();
    IWorld(worldAddress).withdraw(1);

    vm.expectRevert();
    IWorld(worldAddress).balance(1);

    vm.expectRevert();
    IWorld(worldAddress).notInBlacklist(address(this));

    vm.expectRevert();
    IWorld(worldAddress).add(address(this));

    vm.expectRevert();
    IWorld(worldAddress).remove(address(this));
  }
}

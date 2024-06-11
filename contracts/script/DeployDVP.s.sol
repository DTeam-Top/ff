// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.24;

import "forge-std/Script.sol";
import "../src/dvp/FlowsDvp.sol";

contract DeployDVP is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    address signer = vm.envAddress("SIGNER");

    new FlowsDvp(signer);

    vm.stopBroadcast();
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Blacklist } from "../codegen/index.sol";

contract BlacklistSystem is System {
  function addToBlacklist(address value) public {
    Blacklist.set(value, true);
  }

  function removeFromBlacklist(address value) public {
    Blacklist.deleteRecord(value);
  }

  function notInBlacklist(address value) public view returns (bool) {
    return !Blacklist.get(value);
  }
}

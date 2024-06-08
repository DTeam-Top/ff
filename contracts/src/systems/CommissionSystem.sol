// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Commission } from "../codegen/index.sol";

contract CommissionSystem is System {
  function pay(uint256 fid, uint256 amount) public {
    Commission.set(fid, Commission.get(fid) + amount);
  }

  function withdraw(uint256 fid) public {
    Commission.set(fid, 0);
  }

  function balance(uint256 fid) public view returns (uint256) {
    return Commission.get(fid);
  }
}

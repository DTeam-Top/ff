// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyERC20 is ERC20("MyERC20", "M20") {
  function mint(uint256 amount, address receiver) external {
    _mint(receiver, amount);
  }
}

contract MyERC721 is ERC721("MyERC721", "M721") {
  function mint(uint256 id, address receiver) external {
    _mint(receiver, id);
  }
}

contract MyERC1155 is ERC1155("") {
  function mint(uint256 id, uint256 amount, address receiver) external {
    _mint(receiver, id, amount, "");
  }
}

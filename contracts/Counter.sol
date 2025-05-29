// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public count;

    function increment() external {
        count++;
    }

    function decrement() external {
        require(count > 0, "Counter: cannot decrement below zero");
        count--;
    }
}
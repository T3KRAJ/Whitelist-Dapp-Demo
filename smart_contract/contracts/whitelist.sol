// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract whitelist {
    uint8 public maxWhiteListUsersCount;
    uint8 public whiteListedUsersCount;
    mapping(address => bool) public whiteListedUsers;

    constructor(uint8 _maxWhiteListUsersCount) {
        maxWhiteListUsersCount = _maxWhiteListUsersCount;
    }

    function addUserToWhiteList() public {
        require(!whiteListedUsers[msg.sender], "User is already whitelisted");
        require(whiteListedUsersCount < maxWhiteListUsersCount, "Limit reached! No more addresses can be whitelisted!");
        whiteListedUsers[msg.sender] = true;
        whiteListedUsersCount ++; 
    } 
    
    function getWhiteListedUsersCount() public view returns(uint8){
        return whiteListedUsersCount;
    }
}
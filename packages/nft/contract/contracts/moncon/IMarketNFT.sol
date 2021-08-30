// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMarketNFT {
    function buyToken(uint256 _tokenId)  payable external;

    function setCurrentPrice(uint256 _tokenId, uint256 _price) external;

    function readyToSellToken(uint256 _tokenId, uint256 _price) external;

    function cancelSellToken(uint256 _tokenId) external;

}

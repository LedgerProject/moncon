// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import '../security/Pausable.sol';
import '../access/Ownable.sol';
import '../utils/Context.sol';
import '../token/ERC721/IERC721.sol';
import '../token/ERC721/utils/ERC721Holder.sol';
import '../utils/math/SafeMath.sol';
import '../utils/math/Math.sol';
import '../utils/introspection/ERC165.sol';
import '../utils/structs/EnumerableSet.sol';
import './EnumerableMap.sol';
import './IMarketNFT.sol';


contract MonconMarketplace is IMarketNFT, ERC721Holder, Ownable, Pausable {
    using SafeMath for uint256;
    using EnumerableMap for EnumerableMap.UintToUintMap;
    using EnumerableSet for EnumerableSet.UintSet;

    

    IERC721 public nft;
    EnumerableMap.UintToUintMap private _asksMap;
    address public feeAddr;
    uint256 public feePercent;
    mapping(uint256 => address) private _tokenSellers;
    mapping(address => EnumerableSet.UintSet) private _userSellingTokens;
    
    struct AskEntry {
        uint256 tokenId;
        uint256 price;
    }
    

    event Trade(address indexed seller, address indexed buyer, uint256 tokenId, uint256 price, uint256 fee);
    event Ask(address indexed seller, uint256  tokenId, uint256 price);
    event CancelSellToken(address indexed seller, uint256 indexed tokenId);
    event FeeAddressTransferred(address indexed previousOwner, address indexed newOwner);
    event SetFeePercent(address indexed seller, uint256 oldFeePercent, uint256 newFeePercent);
    event Bid(address indexed bidder, uint256 tokenId, uint256 price);
    event CancelBidToken(address indexed bidder, uint256 tokenId);

    constructor(
        address _nftAddress,
        address _feeAddr,
        uint256 _feePercent
    )  {
        require(_nftAddress != address(0) && _nftAddress != address(this));
        nft = IERC721(_nftAddress);
        feeAddr = _feeAddr;
        feePercent = _feePercent;
        emit FeeAddressTransferred(address(0), feeAddr);
        emit SetFeePercent(_msgSender(), 0, feePercent);
    }

    function buyToken(uint256 _tokenId) public payable override whenNotPaused {
        uint256 price = _asksMap.get(_tokenId);
        uint256 feeAmount = price.mul(feePercent).div(100);
        require(msg.value == price,'no preice');
        Purchase(price,feeAmount,_tokenId,_msgSender());
        buyTokenTo(_tokenId, _msgSender());
    }
    
    function test(uint256 _tokenId) public view returns(bool){
        return _asksMap.contains(_tokenId);
    }

    function buyTokenTo(uint256 _tokenId, address _to) internal whenNotPaused {
        require( _to != address(0) &&  _to != address(this), 'Wrong msg sender');
        require(_asksMap.contains(_tokenId), 'Token not in sell book');
        nft.safeTransferFrom(address(this), _to, _tokenId);
        _asksMap.remove(_tokenId);
        _userSellingTokens[_tokenSellers[_tokenId]].remove(_tokenId);
        delete _tokenSellers[_tokenId];
    }
    
    function Purchase(uint256 price, uint256 feeAmount, uint256 _tokenId, address _to) internal{
        address payable feeAddr_ = payable(feeAddr);
        if (feeAmount != 0) {
            feeAddr_.transfer(feeAmount);
        }
        address payable seller = payable( _tokenSellers[_tokenId]);
        seller.transfer(price.sub(feeAmount));
        emit Trade(_tokenSellers[_tokenId], _to, _tokenId, price, feeAmount);
    }

    function setCurrentPrice(uint256 _tokenId, uint256 _price) public override whenNotPaused {
        require(_userSellingTokens[_msgSender()].contains(_tokenId), 'Only Seller can update price');
        require(_price != 0, 'Price must be granter than zero');
        _asksMap.set(_tokenId, _price);
        emit Ask(_msgSender(), _tokenId, _price);
    }

    function readyToSellToken(uint256 _tokenId, uint256 _price) public override whenNotPaused {
        readyToSellTokenTo(_tokenId, _price, _msgSender());
    }

    function readyToSellTokenTo(
        uint256 _tokenId,
        uint256 _price,
        address _to
    ) internal whenNotPaused {
        require( _to == nft.ownerOf(_tokenId), 'Only Token Owner can sell token');
        require(_price != 0, 'Price must be granter than zero');
        nft.safeTransferFrom(_to, address(this), _tokenId);
        _asksMap.set(_tokenId, _price);
        _tokenSellers[_tokenId] = _to;
        _userSellingTokens[_to].add(_tokenId);
        emit Ask(_to, _tokenId, _price);
    }

    function cancelSellToken(uint256 _tokenId) public override whenNotPaused {
        require(_userSellingTokens[_msgSender()].contains(_tokenId), 'Only Seller can cancel sell token');
        nft.safeTransferFrom(address(this), _msgSender(), _tokenId);
        _asksMap.remove(_tokenId);
        _userSellingTokens[_tokenSellers[_tokenId]].remove(_tokenId);
        delete _tokenSellers[_tokenId];
        emit CancelSellToken(_msgSender(), _tokenId);
    }

    function getAskLength() public view returns (uint256) {
        return _asksMap.length();
    }

    function invertOrdersArray(AskEntry[] memory _orders) internal pure returns (AskEntry[] memory) {
        if(_orders.length ==  0)
            return _orders;
        AskEntry[] memory invertOders = new AskEntry[](_orders.length);
        for (uint256 i = 1; i <= _orders.length; i++) {
            invertOders[i-1] = _orders[_orders.length - i];
        }
        return invertOders;
    }

    function getAsks() public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = new AskEntry[](_asksMap.length());
        for (uint256 i = 0; i < _asksMap.length(); i++) {
            (uint256 tokenId, uint256 price) = _asksMap.at(i);
            asks[i] = AskEntry({tokenId: tokenId, price: price});
        }
        return asks;
    }
    
    
    function getAsksDesc() public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = invertOrdersArray(getAsks());
        return asks;
    }

    
    
    function getAsksByPage(uint256 page, uint256 size) public view returns (AskEntry[] memory) {
        if (_asksMap.length() > 0) {
            uint256 from = page == 0 ? 0 : (page - 1) * size;
            uint256 to = Math.min((page == 0 ? 1 : page) * size, _asksMap.length());
            AskEntry[] memory asks = new AskEntry[]((to - from));
            for (uint256 i = 0; from < to; i++) {
                (uint256 tokenId, uint256 price) = _asksMap.at(from);
                asks[i] = AskEntry({tokenId: tokenId, price: price});
                ++from;
            }
            return asks;
        } else {
            return new AskEntry[](0);
        }
    }

    function getAsksByPageDesc(uint256 page, uint256 size) public view returns (AskEntry[] memory) {
        if (_asksMap.length() > 0) {
            AskEntry[] memory asks = invertOrdersArray(getAsksByPage(page,size));
            return asks;
        }
        return new AskEntry[](0);
    }

    function getAsksByUser(address user) public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = new AskEntry[](_userSellingTokens[user].length());
        for (uint256 i = 0; i < _userSellingTokens[user].length(); i++) {
            uint256 tokenId = _userSellingTokens[user].at(i);
            uint256 price = _asksMap.get(tokenId);
            asks[i] = AskEntry({tokenId: tokenId, price: price});
        }
        return asks;
    }

    function getAsksByUserDesc(address user) public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = new AskEntry[](_userSellingTokens[user].length());
        if (_userSellingTokens[user].length() > 0) {
            asks = invertOrdersArray(getAsksByUser(user));
        }
        return asks;
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }

    function transferFeeAddress(address _feeAddr) public {
        require(_msgSender() == feeAddr, 'FORBIDDEN');
        feeAddr = _feeAddr;
        emit FeeAddressTransferred(_msgSender(), feeAddr);
    }

    function setFeePercent(uint256 _feePercent) public onlyOwner {
        require(feePercent != _feePercent, 'Not need update');
        emit SetFeePercent(_msgSender(), feePercent, _feePercent);
        feePercent = _feePercent;
    }
   
}

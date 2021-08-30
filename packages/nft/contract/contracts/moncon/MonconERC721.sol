// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../token/ERC721/ERC721.sol";
import "../token/ERC721/extensions/ERC721Burnable.sol";
import "../access/Ownable.sol";
import "../utils/Counters.sol";
import '../utils/structs/EnumerableSet.sol';

contract Moncon is ERC721, ERC721Burnable,Ownable{
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    
    Counters.Counter private _tokenIdCounter;
    
    mapping(uint256 => address) internal _tokenMaker;
    mapping(uint => EnumerableSet.AddressSet) internal _tokenIdToOwners;
    mapping(address => EnumerableSet.UintSet ) internal _ownedTokens;
    mapping(uint => string ) internal _tokenIdToHast;
    string public baseURI;
    
    constructor() ERC721("moncon", "moncon") {
        baseURI = "https://api-test.moncon.co/v1/nft/";
    }
    
    function setBaseURI(string memory URI) external onlyOwner{
        baseURI = URI;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory baseURI_ = _baseURI();
        return bytes(baseURI_).length > 0 ? string(abi.encodePacked(baseURI_, _tokenIdToHast[tokenId])): '';
    }


    function id() public view  returns(uint256){
        return _tokenIdCounter.current();
    }
    function safeMint(address to,string calldata hash) public {
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdToHast[_tokenIdCounter.current()] = hash;
        
    }
    
    function getTokenMaker(uint256 tokenId) external view returns(address){
            return _tokenMaker[tokenId];
    }
    
     function ownerOf(address _owner, uint256 _id) external view returns(bool){
        return _ownedTokens[_owner].contains(_id);
    }
    
    
    
    function getTokenAmount(address owner) external view returns(uint256){
        return _ownedTokens[owner].length();
    }
    
    function tokenIdToHast(uint tokenId) public view returns (string memory){
        return _tokenIdToHast[tokenId];
    }
    
    function getAllHashBatch(uint256[] memory tokenId) external view returns(string[] memory){
        uint index = tokenId.length;
        string[] memory hash = new string[](index);
        for(uint i=0; i< index ;i++){
            hash[i] = tokenIdToHast(tokenId[i]);
        }
        return hash;
    }
    
    function getAllHash(address owner) external view returns(string[] memory){
        uint index = _ownedTokens[owner].length();
        string[] memory hash = new string[](index);
        for(uint i=0; i< index ;i++){
            hash[i] = tokenIdToHast(_ownedTokens[owner].at(i));
        }
        return hash;
    }
    
    function getAllTokenURI(address owner) external view returns(string[] memory){
        uint index = _ownedTokens[owner].length();
        string[] memory hash = new string[](index);
        for(uint i=0; i< index ;i++){
            hash[i] = tokenURI(_ownedTokens[owner].at(i));
        }
        return hash;
    }
    
    function getAllTokenId(address owner) external view returns(uint256[] memory){
        uint index = _ownedTokens[owner].length();
        uint[] memory tokenIds = new uint[](index);
        for(uint i=0; i< index ;i++){
            tokenIds[i] = _ownedTokens[owner].at(i);
        }
        return tokenIds;
    }
    
     
     function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721)
    {
            
            if(from == address(0)){
                _tokenIdToOwners[tokenId].add(to);
                _ownedTokens[to].add(tokenId);
                _tokenMaker[tokenId]=to;
            }
            else{
                
                if(to != address(0))
                {
                    _tokenIdToOwners[tokenId].add(to);
                    _ownedTokens[to].add(tokenId);
                }
                _tokenIdToOwners[tokenId].remove(from);
                _ownedTokens[from].remove(tokenId);
            
                
                }

    }

    
}
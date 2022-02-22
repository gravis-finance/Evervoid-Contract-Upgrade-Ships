// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

import './interfaces/IGravisCollectible.sol';

contract AsteroidFarmingMutator is Ownable {
    using SafeMath for uint256;

    struct MutationConfig {
        uint256 inAmount;
        uint256 outType;
        uint256 chances;
    }

    uint256 private randomNonce = 0;

    IGravisCollectible public nft;

    mapping(uint256 => MutationConfig) public mutations;

    event MutationSuccess(address indexed u, uint256 indexed t);
    event MutationFailure(address indexed u, uint256 indexed t);
    event ConfigSet(uint256 indexed t);

    constructor(address _nft) public {
        nft = IGravisCollectible(_nft);
    }

    function mutate(uint256 _type) external virtual {
        MutationConfig memory config = mutations[_type];

        require(isConfigNotEmpty(config), 'AsteroidFarming: No config');

        nft.burnFor(_msgSender(), _type, config.inAmount);

        if (config.chances == 100) {
            nft.mint(_msgSender(), config.outType, 1);
            emit MutationSuccess(_msgSender(), _type);
        } else {
            uint256 random = random();

            if (random <= config.chances) {
                nft.mint(_msgSender(), config.outType, 1);
                emit MutationSuccess(_msgSender(), _type);
            } else {
                emit MutationFailure(_msgSender(), _type);
            }
        }
    }

    function setMutationConfig(uint256 _type, MutationConfig memory _config) public onlyOwner {
        mutations[_type] = _config;
        emit ConfigSet(_type);
    }

    function isConfigNotEmpty(MutationConfig memory config) internal pure returns (bool) {
        return config.inAmount > 0 && config.outType > 0 && config.chances > 0;
    }

    function random() internal returns (uint256) {
        randomNonce++;
        return uint256(keccak256(abi.encodePacked(block.number, _msgSender(), randomNonce))).mod(100).add(1);
    }
}

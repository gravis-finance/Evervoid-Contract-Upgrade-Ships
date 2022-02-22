// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import './interfaces/IGravisCollectible.sol';

contract AsteroidFarmingMutatorERC20 is Ownable {
    using SafeMath for uint256;

    struct MutationConfig {
        uint256 inAmountNFT;
        uint256 inAmountERC20;
        uint256 inAmountMetal;
        uint256 outType;
        uint256 chances;
    }

    uint256 private randomNonce = 0;

    IGravisCollectible public nft;
    IERC20 public erc20;
    IERC20 public metal;
    address public holder;

    mapping(uint256 => MutationConfig) public mutations;

    event MutationSuccess(address indexed u, uint256 indexed t);
    event MutationFailure(address indexed u, uint256 indexed t);
    event ConfigSet(uint256 indexed t);

    constructor(address _nft, address _erc20, address _metal, address _holder) public {
        nft = IGravisCollectible(_nft);
        erc20 = IERC20(_erc20);
        metal = IERC20(_metal);
        holder = _holder;
    }

    function mutate(uint256 _type) external virtual {
        MutationConfig memory config = mutations[_type];

        require(isConfigNotEmpty(config), 'AsteroidFarming: No config');

        if (config.inAmountNFT > 0) {
            nft.transferFor(_msgSender(), holder, _type, config.inAmountNFT);
        }

        if (config.inAmountERC20 > 0) {
            erc20.transferFrom(_msgSender(), holder, config.inAmountERC20);
        }

        if (config.inAmountMetal > 0) {
            metal.transferFrom(_msgSender(), holder, config.inAmountMetal);
        }

        if (config.chances == 100) {
            nft.mint(_msgSender(), config.outType, 1);
            emit MutationSuccess(_msgSender(), _type);
        }
        else {
            uint256 random = random();

            if (random <= config.chances) {
                nft.mint(_msgSender(), config.outType, 1);
                emit MutationSuccess(_msgSender(), _type);
            }
            else {
                emit MutationFailure(_msgSender(), _type);
            }
        }
    }

    function setMutationConfig(uint256 _type, MutationConfig memory _config) public onlyOwner {
        mutations[_type] = _config;
        emit ConfigSet(_type);
    }

    function isConfigNotEmpty(MutationConfig memory config) internal pure returns (bool) {
        return (
            config.inAmountNFT > 0
            || config.inAmountERC20 > 0
            || config.inAmountMetal > 0
        ) && config.outType > 0 && config.chances > 0;
    }

    function random() internal returns (uint256) {
        randomNonce++;
        return uint256(keccak256(abi.encodePacked(block.number, _msgSender(), randomNonce))).mod(100).add(1);
    }
}

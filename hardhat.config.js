require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-web3');
require('dotenv').config();

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const envVal = (key, def, type = 'string') => {
  const val = process.env[key];
  if (typeof val == 'undefined') return def;

  if (type == 'list') return val.split(',');

  if (type == 'num') return isNaN(val) ? def : +val;

  if (type == 'bool') {
    if (['false', '0'].includes(val)) return false;
    return !!val;
  }

  return val;
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  etherscan: {
    apiKey: process.env.SCAN_API,
  },
  defaultNetwork: 'env',
  networks: {
    'env': {
      url: envVal('RPC_URL', 'RPC NOT SETTED'),
      accounts: envVal('PRIVATE_KEYS', [], 'list'),

      farming: envVal('FARMING'),
      nft: envVal('NFT'),
      erc20: envVal('ERC20'),
      metal: envVal('METAL'),
      holder: envVal('HOLDER'),
    },
    'bsc-testnet': {
      url: envVal('RPC_URL', 'https://data-seed-prebsc-1-s1.binance.org:8545/'),
      accounts: envVal('PRIVATE_KEYS', [], 'list'),

      farming: envVal('FARMING'),
      nft: envVal('NFT'),
      erc20: envVal('ERC20'),
      metal: envVal('METAL'),
      holder: envVal('HOLDER'),
    },
    'matic-testnet': {
      url: envVal('RPC_URL', 'https://matic-mumbai.chainstacklabs.com'),
      accounts: envVal('PRIVATE_KEYS', [], 'list'),

      farming: envVal('FARMING'),
      nft: envVal('NFT'),
      erc20: envVal('ERC20'),
      metal: envVal('METAL'),
      holder: envVal('HOLDER'),
    },
    'matic-mainnet': {
      url: envVal('RPC_URL', 'https://rpc-mainnet.matic.quiknode.pro'),
      accounts: envVal('PRIVATE_KEYS', [], 'list'),

      farming: envVal('FARMING'),
      nft: envVal('NFT'),
      erc20: envVal('ERC20'),
      metal: envVal('METAL'),
      holder: envVal('HOLDER'),
    },
    'bsc-mainnet': {
      url: envVal('RPC_URL', ''),
      accounts: envVal('PRIVATE_KEYS', [], 'list'),

      farming: envVal('FARMING'),
      nft: envVal('NFT'),
      erc20: envVal('ERC20'),
      metal: envVal('METAL'),
      holder: envVal('HOLDER'),
    },
  },
};

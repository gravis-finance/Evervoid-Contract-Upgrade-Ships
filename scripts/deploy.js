//
// [DEPLOY=1] npm run deploy bsc-testnet
//
const hre = require('hardhat');
require('./utils/logger');
const { die, delay, chkErrors, checkSync, chkDeploy, sendTx, toEthers } = require('./utils/helpers');

const cfg = hre.network.config;
const FARMING = cfg.farming;
const NFT = cfg.nft || die('NFT');
const ERC20 = cfg.erc20 || die('ERC20');
const METAL = cfg.metal || die('METAL');
const HOLDER = cfg.holder || die('HOLDER');

const args = [
  NFT,
  ERC20,
  METAL,
  HOLDER
];


async function main() {
  console.log('Provider:', cfg.url);
  console.log('Network name:', hre.network.name);

  chkErrors();
  checkSync();

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    console.crit('Deployer account not set.')
    return;
  }

  console.log('Deployer:', deployer.address);
  console.log('Initial balance:', toEthers(await hre.ethers.provider.getBalance(deployer.address)).toString());

  chkDeploy();

  const farming_contract = await ethers.getContractFactory('AsteroidFarmingMutatorERC20Burn');

  let farming;
  if (FARMING) {
    farming = await farming_contract.attach(FARMING);
    console.done('FARMING: exist at', FARMING);
  }
  else {
    console.log('FARMING: start deploy..', { args });
    farming = await farming_contract.deploy(...args);
    console.done('FARMING: deployed at', farming.address);
    await farming.deployed();
  }

  try {
    delay(1000);
    await hre.run('verify:verify', {
      address: farming.address,
      constructorArguments: args,
    });
    console.done('FARMING: verification success');
  }
  catch (err) {
    console.warn('FARMING: verification failed:', err);
  }
  console.log('Final balance:', toEthers(await hre.ethers.provider.getBalance(deployer.address)).toString());

  console.done('All done!');
}


main()
.then(() => process.exit(0))
.catch((err) => {
  console.error(err.error || '', err);
  process.exit(1);
});

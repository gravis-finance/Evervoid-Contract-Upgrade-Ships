const { ethers, web3 } = require('hardhat');

const toWeis = (val, unit = 'ether') => ethers.utils.parseUnits(val.toString(), unit);
const toEthers = (wei, unit = 'ether') => ethers.utils.formatUnits(wei, unit);
const toGweis = (wei) => toEthers(wei, 'gwei');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const printJSON = (json) => {
  return JSON.stringify(json, null, 2);
}

const errors = [];
const die = (name) => errors.push(name);
const chkErrors = () => {
  if (!errors.length) return;

  console.error('Parameters not set:', errors);
  throw 'Please set them first in hardhat.config.js according to the selected network.';
}
const checkSync = async () => {
  const syncStatus = await web3.eth.isSyncing();
  if (!syncStatus) return;

  console.warn(syncStatus);
  throw 'Endpoint not synced';
}

const chkDeploy = () => {
  if (process.env['DEPLOY']) return;

  console.warn('Dry run finished. To actually deploy, run with "DEPLOY=1".');
  process.exit();
}

async function sendTx(title, func, args) {
  console.log(title, '..', args.length && args || '');
  const tx = await func(...args);
  console.log(title, 'at', tx.hash);
  const res = await tx.wait();
  console.done(title, 'done');
  return res;
}

function pretyEntry(item) {
  const obj = {};
  for (const k of Object.keys(item)) {
    if (!isNaN(k)) continue;
    obj[k] = item[k].toString();
  }

  return obj;
}
function pretyEvent(event) {
  console.log({ event });
  const eventKeys = [
    'transactionIndex',
    'blockNumber',
    'transactionHash',
    'address',
    'event',
    'eventSignature',
    'data',
  ];
  const obj = {};
  for (const k of eventKeys) {
    obj[k] = event[k] && event[k].toString() || undefined;
  }

  obj.topics = event.topics && event.topics.map(pretyEntry);
  obj.args = event.args && pretyEntry(event.args);

  return obj;
}

module.exports = {
  toWeis,
  toEthers,
  toGweis,
  delay,
  printJSON,
  die,
  chkErrors,
  checkSync,
  chkDeploy,
  sendTx,
  pretyEntry,
  pretyEvent,
};

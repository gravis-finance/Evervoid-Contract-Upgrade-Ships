# Gravis Finance Upgrade Ships Contracts

### UpgradeShipsContract

#### Deployment

After the deployment you should add configs for available mutation via `setMutationConfig` method:

```
setMutationConfig(uint256 _type, MutationConfig memory _config);
```

where `_type` is NFT type for input NFT and Config is the following struct:

```
struct MutationConfig {
    uint256 inAmount;
    uint256 outType;
    uint256 chances;
}
```
To send tx from bscscan/etherscan, input `_type` as first param, and struct as follow:
```
[1,2,100]
```

#### Mutation

To mutate their NFT users should use `mutate` method with input `type` param, NFTs should be approved to contract address.

Upon successful mutation, event `MutationSuccess(user, type)` emitted.

For VRF contract successful mutation tracking, you should:

- Subscribe for `MutationSuccess` event for this user, as it take some time for VRF coordinator to fullfill VRF request

#### Test coverage report

```
--------------------------------|----------|----------|----------|----------|----------------|
File                            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------------------|----------|----------|----------|----------|----------------|
 contracts/                     |      100 |      100 |      100 |      100 |                |
  AsteroidFarmingMutator.sol    |      100 |      100 |      100 |      100 |                |
 contracts/interfaces/          |      100 |      100 |      100 |      100 |                |
  IGravisCollectible.sol        |      100 |      100 |      100 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|
All files                       |      100 |      100 |      100 |      100 |                |
--------------------------------|----------|----------|----------|----------|----------------|
```

#### Deploy AsteroidFarmingMutator

```
yarn deploy --network mumbai --tags Mutator

yarn verify --network mumbai 0xD755c76e52e38F432d406c155db10cd6461b3282 --constructor-args src/005_arguments.js
```
```

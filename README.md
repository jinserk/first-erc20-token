# ERC20 Token contract example

ERC20 Token implementation with latest version of Truffle Framework and OpenZeppelin-solidity library

## Requirements

- node 10.15.3+
- npm 6.9.0+
- openzeppelin-solidity 2.1.3+
- openzeppelin-test-helpers 0.1.4+
- truffle 5.0.13+

## Contract compile and deployment

```
$ yarn install
$ Truffle develop

truffle(develop)> compile
truffle(develop)> migrate
truffle(develop)> test
```

## Running React-dapp

### update the deployed contract's address

```
$ cd react-dapp
$ vi src/ContractConfig.js
```

### run react server

```
$ yarn install
$ yarn start
```




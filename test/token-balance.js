const { BN } = require('openzeppelin-test-helpers');
const EunToken = artifacts.require("EunToken");

class TokenTracker {
  constructor (acc) {
    this.account = acc;
  }
  async delta () {
    const current = await balanceCurrent(this.account);
    const delta = current.sub(this.prev);
    this.prev = current;
    return delta;
  }
  async get () {
    this.prev = await balanceCurrent(this.account);
    return this.prev;
  }
}

async function balanceTracker (account) {
  const tracker = new TokenTracker(account);
  await tracker.get();
  return tracker;
}

async function balanceCurrent (account) {
  var token = await EunToken.deployed();
  return new BN(await token.balanceOf.call(account));
}

module.exports = {
  current: balanceCurrent,
  tracker: balanceTracker,
};

const { BN, constants, expectEvent, shouldFail, should } = require('openzeppelin-test-helpers');
const EunToken = artifacts.require("EunToken");
const TokenTracker = require("./token-balance");

contract('EunToken', ([account0, account1]) => {
  beforeEach(async function () {
    this.token = await EunToken.deployed();
  });

  it('reverts when transferring tokens to the zero address', async function () {
    await shouldFail(this.token.transfer(constants.ZERO_ADDRESS, 1e18, { from: account0 }));
  });

  it('should name "Eun Token"', async function () {
    (await this.token.name.call()).should.be.equal("Eun Token");
  });

  it('should symbol "EUN"', async function () {
    (await this.token.symbol.call()).should.be.equal("EUN");
  });

  it('should 1e28 wei in total supply', async function () {
    let total = new BN('10000000000000000000000000000');
    (await this.token.totalSupply.call()).should.be.bignumber.equal(total);
  });

  it('should transfer tokens correctly', async function () {
    const Tracker0 = await TokenTracker.tracker(account0);
    const Tracker1 = await TokenTracker.tracker(account1);

    // Make transaction from contract account to EOAs.
    let amount = new BN('10000000000000000000');

    await this.token.transfer(account1, amount, {from: account0});

    (await Tracker0.delta()).should.be.bignumber.equal(amount.neg());
    (await Tracker1.delta()).should.be.bignumber.equal(amount);
  });

  it('should delegated transfer tokens correctly', async function () {
    const Tracker0 = await TokenTracker.tracker(account0);
    const Tracker1 = await TokenTracker.tracker(account1);

    // Make transaction from contract account to EOAs.
    let amount0 = new BN('10000000000000000000');
    let amount1 = new BN('8000000000000000000');

    await this.token.approve(account1, amount0, {from: account0});
    (await this.token.allowance.call(account0, account1)).should.be.bignumber.equal(amount0);

    await this.token.transferFrom(account0, account1, amount1, {from: account1});
    (await Tracker0.delta()).should.be.bignumber.equal(amount1.neg());
    (await Tracker1.delta()).should.be.bignumber.equal(amount1);
    (await this.token.allowance.call(account0, account1)).should.be.bignumber.equal(amount0.sub(amount1));

    await shouldFail(this.token.transferFrom(account0, account1, amount1, {from: account1}));
  });

});

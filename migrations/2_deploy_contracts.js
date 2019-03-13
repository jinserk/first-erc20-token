const EunToken = artifacts.require("EunToken");

module.exports = function(deployer) {
  deployer.deploy(EunToken);
};

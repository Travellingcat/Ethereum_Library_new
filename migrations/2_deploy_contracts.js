// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var EtherLibrary = artifacts.require("./EtherLibrary.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherLibrary);
};

const Simplebank = artifacts.require("Simplebank");
module.exports = function (deployer) {
deployer.deploy(Simplebank);
};
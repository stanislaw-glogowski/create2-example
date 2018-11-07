const Example = artifacts.require('Example');

module.exports = async (deployer) => {
  await deployer.deploy(Example);
};

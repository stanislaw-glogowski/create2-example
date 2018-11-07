const Example = artifacts.require('Example');
const Factory = artifacts.require('Factory');

module.exports = async (deployer) => {
  await deployer.deploy(Factory, Example.bytecode);
};

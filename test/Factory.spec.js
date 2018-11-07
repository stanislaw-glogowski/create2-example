const expect = require('expect');
const debug = require('debug');
const {
  isAddress,
  numberToUint256,
  buildCreate2Address,
} = require('./utils');

const Example = artifacts.require('Example');
const Factory = artifacts.require('Factory');

const log = debug("factory");

contract('Factory', ([account]) => {
  let factory;

  before(async () => {
    factory = await Factory.deployed();
  });

  describe('Deploy using `new` operator', () => {

    it('should deploy Example contract', async () => {
      const estimatedGas = await Example.new.estimateGas();


      const example = await await Example.new();

      expect(await example.getOwner()).toBe(account);

      log('estimatedGas', estimatedGas);
    });
  });

  describe('Deploy using CREATE opcode', () => {

    it('should deploy Example contract', async () => {
      const { logs: [{ event, args }], receipt: { gasUsed } } = await factory.deploy();

      const example = await Example.at(args.addr);

      expect(event).toBe('Deployed');
      expect(await example.getOwner()).toBe(factory.address);
      expect(isAddress(args.addr)).toBeTruthy();

      log('gasUsed', gasUsed);
    });
  });

  describe('Deploy using CREATE2 opcode', () => {
    let salt = Date.now();

    it('should deploy Example contract', async () => {
      const { logs: [{ event, args }], receipt: { gasUsed } } = await factory.deploy2(salt);

      const example = await Example.at(args.addr);

      const computedAddr = buildCreate2Address(
        factory.address,
        numberToUint256(salt),
        Example.bytecode,
      );

      expect(event).toBe('Deployed2');
      expect(await example.getOwner()).toBe(factory.address);
      expect(args.addr.toLowerCase()).toBe(computedAddr);
      expect(args.salt.toString(16)).toBe(salt.toString(16));

      log('computedAddr', computedAddr);
      log('gasUsed', gasUsed);
    });
  });
});

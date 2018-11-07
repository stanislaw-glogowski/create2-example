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

    it('should deploy contract', async () => {
      const estimatedGas = await Example.new.estimateGas();
      const example = await await Example.new();

      expect(await example.getOwner()).toBe(account);

      log('estimatedGas', estimatedGas);
    });
  });

  describe('Deploy using CREATE opcode', () => {

    it('should deploy contract', async () => {
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

    it('should deploy contract', async () => {
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

    it('should fail when salt is already used', () => {
      const promise = factory.deploy2(salt);

      return expect(promise).rejects.toThrow();
    });

    it('should re-deploy contract', async () => {
      ++salt;

      {
        const { logs: [{ args }] } = await factory.deploy2(salt);
        const example = await Example.at(args.addr);
        await example.destroy();
      }

      const { logs: [{ event, args }] } = await factory.deploy2(salt);
      expect(event).toBe('Deployed2');
      expect(args.salt.toString(16)).toBe(salt.toString(16));
    });

    it('should deploy contract to address with funds', async () => {
      ++salt;

      const computedAddr = buildCreate2Address(
        factory.address,
        numberToUint256(salt),
        Example.bytecode,
      );

      const value = 1000;

      await web3.eth.sendTransaction({
        from: account,
        to: computedAddr,
        value,
      });

      const { logs: [{ args }] } = await factory.deploy2(salt);

      const balance = await web3.eth.getBalance(args.addr);

      expect(args.addr.toLowerCase()).toBe(computedAddr);
      expect(parseInt(balance, 10)).toBe(value);
    })
  });
});

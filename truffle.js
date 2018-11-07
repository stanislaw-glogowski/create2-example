const HDWalletProvider = require('truffle-hdwallet-provider');
const {
  TEST_MNEMONIC,
  TEST_ENDPOINT,
} = process.env;

module.exports = {
  networks: {
    test: {
      provider: function() {
        return new HDWalletProvider(
          TEST_MNEMONIC || 'eight spell unique say nurse angle property stadium task donkey blast honey',
          TEST_ENDPOINT || 'http://localhost:8545',
        );
      },
      network_id: '*',
    },
  },
  compilers: {
    solc: {
      version: '0.5.0-nightly.2018.11.5+commit.88aee34c',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      },
    },
  },
};

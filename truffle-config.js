const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonicRopsten = 'anchor hurry logic legal pole say sorry raise obey reveal stove mansion';
const mnemonic = 'daring amused hospital rice roast peasant prison dish address carpet rural twenty';
//const mnemonic = fs.readFileSync('.secrets').toString().trim();

module.exports = {
  networks: {
    ropsten: {
      provider: () => 
        new HDWalletProvider(
          mnemonicRopsten,
          'https://ropsten.infura.io/v3/acd3501ee5a14350823d26b521655b4c',
          1,
        ),
      network_id: 3,
      skipDryRun: true,
      //from: '0x77C6e3d3D8AbAF16C2ED5240d197d4a6865848bD',
    },
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          'https://mainnet.infura.io/v3/acd3501ee5a14350823d26b521655b4c',
          1,
        ),
      network_id: 1,
      skipDryRun: true,
      //from: '0x353A8e4D423E9CDe5c6a8926B4908731E261211A',
    }
  },
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
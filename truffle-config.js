const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonicRopsten = '';
const mnemonic = '';
//const mnemonic = fs.readFileSync('.secrets').toString().trim();

module.exports = {
  networks: {
    ropsten: {
      provider: () => 
        new HDWalletProvider(
          mnemonicRopsten,
          'https://ropsten.infura.io/v3/<PROJECT_ID>',
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
          'https://mainnet.infura.io/v3/<PROJECT_ID>',
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

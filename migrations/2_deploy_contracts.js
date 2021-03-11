const { BigNumber } = require("@ethersproject/bignumber")

const Factory = artifacts.require('uniswapv2/UniswapV2Factory.sol');
const Router = artifacts.require('uniswapv2/UniswapV2Router02.sol');
const WETH = artifacts.require('WETH.sol');
const MockERC20 = artifacts.require('MockERC20.sol');
const GrapeToken = artifacts.require('GrapeToken.sol');
const MasterSomm = artifacts.require('MasterSomm.sol');
const VinoCellar = artifacts.require('VinoCellar.sol');
const GrapeMaker = artifacts.require('GrapeMaker.sol');
const Migrator = artifacts.require('Migrator.sol');

const INITIAL_MINT = '100000';
const FARM_FEE_ACCOUNT = '0x353A8e4D423E9CDe5c6a8926B4908731E261211A';

module.exports = async function(deployer, _network, addresses) {
    const [admin, _] = addresses;

    let feeAccount = FARM_FEE_ACCOUNT;
    let grapeTokenInstance;

    await deployer.deploy(WETH);
    const weth = await WETH.deployed();
    const tokenA = await MockERC20.new('Token A', 'TKA', web3.utils.toWei('1000'));
    const tokenB = await MockERC20.new('Token B', 'TKB', web3.utils.toWei('1000'));

    await deployer.deploy(Factory, admin);
    const factory = await Factory.deployed();
    await factory.createPair(weth.address, tokenA.address);
    await factory.createPair(weth.address, tokenB.address);
    await deployer.deploy(Router, factory.address, weth.address);
    const router = await Router.deployed();

    await deployer.deploy(GrapeToken).then((instance) => {
        grapeTokenInstance = instance;

        return grapeTokenInstance.mint(BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10**18))));
    });
    const grapeToken = await GrapeToken.deployed();

    await deployer.deploy(
        MasterSomm,
        grapeToken.address,
        feeAccount,
        admin,
        web3.utils.toWei('100'),
        1,
        10
    );
    const masterSomm = await MasterSomm.deployed();
    await grapeToken.transferOwnership(masterSomm.address);

    await deployer.deploy(VinoCellar, grapeToken.address);
    const vinoCellar = await VinoCellar.deployed();

    await deployer.deploy(
        GrapeMaker,
        factory.address,
        vinoCellar.address,
        grapeToken.address,
        weth.address
    );
    const grapeMaker = await GrapeMaker.deployed();
    await factory.setFeeTo(grapeMaker.address);

    await deployer.deploy(
        Migrator,
        masterSomm.address,
        '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        factory.address,
        1
    );
};
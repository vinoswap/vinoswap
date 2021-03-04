// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// VinoCellar is the coolest cellar in town. You come in with some Grape, and leave with more! The longer you stay, the more Grape you get.
//
// This contract handles swapping to and from xGRAPE, VinoSwap's staking token.
contract VinoCellar is ERC20("VinoCellar", "xGRAPE"){
    using SafeMath for uint256;
    IERC20 public grape;

    // Define the Grape token contract
    constructor(IERC20 _grape) public {
        grape = _grape;
    }

    // Enter the cellar. Pay some GRAPEs. Earn some shares.
    // Locks Grape and mints xGrape
    function enter(uint256 _amount) public {
        // Gets the amount of Grape locked in the contract
        uint256 totalGrape = grape.balanceOf(address(this));
        // Gets the amount of xGrape in existence
        uint256 totalShares = totalSupply();
        // If no xGrape exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalGrape == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xGrape the Grape is worth. The ratio will change overtime, as xGrape is burned/minted and Grape deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalGrape);
            _mint(msg.sender, what);
        }
        // Lock the Grape in the contract
        grape.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the cellar. Claim back your GRAPEs.
    // Unlocks the staked + gained Grape and burns xGrape
    function leave(uint256 _share) public {
        // Gets the amount of xGrape in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Grape the xGrape is worth
        uint256 what = _share.mul(grape.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        grape.transfer(msg.sender, what);
    }
}
---
title: Kesimpulan
sidebar_label: Kesimpulan
---

# Kesimpulan

Selamat! 🎉 Kamu sudah menyelesaikan materi **Writing First Contract**.

## Yang Sudah Kamu Pelajari

- ✅ Instalasi Foundry dan OpenZeppelin
- ✅ Konsep ERC20, Ownable, dan Reentrancy
- ✅ Implementasi MyToken.sol dan Vault.sol
- ✅ Unit testing dengan Foundry

## Kode Lengkap

### MyToken.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### Vault.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is ERC20, ReentrancyGuard {
    IERC20 public immutable token;
    
    constructor(IERC20 _token) ERC20("Vault Shares", "vSHARE") {
        token = _token;
    }
    
    function deposit(uint256 amount) public nonReentrant {
        uint256 shares = _calculateShares(amount);
        token.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, shares);
    }
    
    function withdraw(uint256 shares) public nonReentrant {
        uint256 amount = _calculateAmount(shares);
        _burn(msg.sender, shares);
        token.transfer(msg.sender, amount);
    }
    
    function _calculateShares(uint256 amount) internal view returns (uint256) {
        uint256 totalShares = totalSupply();
        uint256 totalAssets = token.balanceOf(address(this));
        if (totalShares == 0 || totalAssets == 0) return amount;
        return (amount * totalShares) / totalAssets;
    }
    
    function _calculateAmount(uint256 shares) internal view returns (uint256) {
        return (shares * token.balanceOf(address(this))) / totalSupply();
    }
}
```

## Langkah Selanjutnya

- Deploy ke testnet (Sepolia, Mumbai)
- Belajar tentang ERC721 (NFT)
- Eksplorasi DeFi protocols

---

Terima kasih sudah belajar bersama **DevWeb3Jogja**! 🚀

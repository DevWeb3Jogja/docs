---
title: Implementasi Vault
sidebar_label: Pengenalan
---

# Implementasi Vault Contract

Vault memungkinkan user deposit token dan mendapatkan shares:

```solidity
contract Vault is ERC20, ReentrancyGuard {
    IERC20 public immutable token;
    
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
}
```

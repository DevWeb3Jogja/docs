---
title: Receive Token
sidebar_label: Receive Token
---

# Vault Menerima Token

```solidity
function deposit(uint256 amount) public nonReentrant {
    token.transferFrom(msg.sender, address(this), amount);
    uint256 shares = _calculateShares(amount);
    _mint(msg.sender, shares);
}
```

User harus `approve` vault sebelum deposit.

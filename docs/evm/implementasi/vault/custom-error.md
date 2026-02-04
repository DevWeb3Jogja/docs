---
title: Custom Error
sidebar_label: Custom Error
---

# Custom Error

Custom error lebih hemat gas:

```solidity
error ZeroAmount();
error InsufficientShares();

function deposit(uint256 amount) public {
    if (amount == 0) revert ZeroAmount();
}
```

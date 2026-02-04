---
title: Events
sidebar_label: Events
---

# Emit & Event

```solidity
event Deposit(address indexed user, uint256 amount, uint256 shares);
event Withdraw(address indexed user, uint256 amount, uint256 shares);

function deposit(uint256 amount) public {
    // ...
    emit Deposit(msg.sender, amount, shares);
}
```

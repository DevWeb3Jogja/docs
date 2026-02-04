---
title: Supply Token
sidebar_label: Supply
---

# Supply Token

## Fixed Supply

```solidity
constructor() ERC20("My Token", "MTK") {
    _mint(msg.sender, 1_000_000 * 10**decimals());
}
```

## Mintable Supply

```solidity
function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
}
```

---
title: Memberi Supply
sidebar_label: Supply
---

# Memberi Supply Token

```solidity
constructor() ERC20("My Token", "MTK") {
    _mint(msg.sender, 1_000_000 * 10**decimals());
}
```

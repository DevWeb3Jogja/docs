---
title: OnlyOwner
sidebar_label: OnlyOwner
---

# OnlyOwner Modifier

```solidity
modifier onlyOwner() {
    require(owner() == msg.sender, "Not owner");
    _;
}
```

Contoh penggunaan:

```solidity
function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
}
```

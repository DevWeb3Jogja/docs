---
title: Name & Symbol
sidebar_label: Name & Symbol
---

# Name & Symbol

## Name
```solidity
string public name = "DevWeb3 Token";
```

## Symbol
```solidity
string public symbol = "DW3";
```

## Implementasi OpenZeppelin

```solidity
contract MyToken is ERC20 {
    constructor() ERC20("DevWeb3 Token", "DW3") {}
}
```

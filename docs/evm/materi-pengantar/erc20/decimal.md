---
title: Decimal
sidebar_label: Decimal
---

# Decimal

Default ERC20 menggunakan **18 decimals**:

```solidity
function decimals() public view virtual returns (uint8) {
    return 18;
}
```

| Nilai Display | Nilai Internal (18 decimals) |
|---------------|------------------------------|
| 1 token | 1000000000000000000 |
| 0.5 token | 500000000000000000 |

## Custom Decimals

```solidity
function decimals() public view virtual override returns (uint8) {
    return 6; // seperti USDC
}
```

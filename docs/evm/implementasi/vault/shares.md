---
title: Shares
sidebar_label: Shares
---

# Perhitungan Shares

```solidity
function _calculateShares(uint256 amount) internal view returns (uint256) {
    uint256 totalShares = totalSupply();
    uint256 totalAssets = token.balanceOf(address(this));
    
    if (totalShares == 0 || totalAssets == 0) return amount;
    return (amount * totalShares) / totalAssets;
}
```

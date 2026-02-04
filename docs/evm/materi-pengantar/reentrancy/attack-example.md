---
title: Contoh Serangan
sidebar_label: Contoh Serangan
---

# Contoh Serangan Reentrancy

## Kontrak Vulnerable

```solidity
// ⚠️ VULNERABLE - JANGAN DIGUNAKAN!
function withdraw() public {
    uint256 balance = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: balance}("");
    balances[msg.sender] = 0; // State diupdate SETELAH transfer
}
```

## Solusi: Checks-Effects-Interactions

```solidity
function withdraw() public {
    uint256 balance = balances[msg.sender];
    balances[msg.sender] = 0;  // Effect DULU
    (bool success, ) = msg.sender.call{value: balance}(""); // Interaction
}
```

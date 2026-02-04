---
title: Reentrancy
sidebar_label: Pengenalan
---

# Reentrancy

**Reentrancy** adalah vulnerability dimana kontrak eksternal memanggil kembali fungsi kontrak asli sebelum eksekusi selesai.

## Pencegahan

```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is ReentrancyGuard {
    function withdraw() public nonReentrant {
        // Aman dari reentrancy
    }
}
```

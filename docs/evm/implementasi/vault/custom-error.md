---
title: Custom Error
sidebar_label: Custom Error
---

# Custom Error

Sejak Solidity 0.8.4, kamu bisa mendefinisikan custom error. Custom error lebih hemat gas dibanding `require` dengan string pesan karena tidak menyimpan string di bytecode.

```solidity
// Definisi custom error (di level kontrak, bukan di dalam fungsi)
error ZeroAmount();
error InsufficientShares(uint256 requested, uint256 available);
error ZeroSharesMinted();
```

Untuk memicunya, gunakan `revert`:

```solidity
if (amount == 0) revert ZeroAmount();

if (sharesToBurn > shares[msg.sender])
    revert InsufficientShares(sharesToBurn, shares[msg.sender]);
```

Keuntungan custom error dibanding `require(condition, "string message")`:

- Lebih hemat gas karena tidak menyimpan string.
- Bisa menyertakan parameter untuk memberikan konteks lebih kaya.
- Lebih mudah di-decode oleh frontend dan tools seperti Etherscan.

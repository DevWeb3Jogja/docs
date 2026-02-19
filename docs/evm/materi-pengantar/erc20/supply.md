---
title: Supply Token
sidebar_label: Supply
---

# Supply Token

Total supply adalah jumlah keseluruhan token yang ada. Ada dua pendekatan umum:

1. **Fixed Supply**: Semua token di-mint saat deployment, tidak ada mint baru setelahnya.
2. **Mintable Supply**: Token bisa di-mint secara bertahap oleh pemilik kontrak atau mekanisme tertentu.

OpenZeppelin menyediakan fungsi internal `_mint(address account, uint256 amount)` yang menambah saldo `account` dan meningkatkan `totalSupply`. Fungsi ini internal, artinya hanya bisa dipanggil dari dalam kontrak atau kontrak turunannya.

Contoh fixed supply di constructor:

```solidity
constructor() ERC20("MyToken", "MTK") {
    _mint(msg.sender, 1_000_000 * 10 ** decimals());
}
```

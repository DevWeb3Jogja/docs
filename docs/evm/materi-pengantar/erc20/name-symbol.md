---
title: Name & Symbol
sidebar_label: Name & Symbol
---

# Name & Symbol

Setiap token ERC20 memiliki dua properti identitas utama:

- **Name**: Nama lengkap token. Contoh: `"Wrapped Ether"`, `"USD Coin"`.
- **Symbol**: Singkatan ticker token, biasanya 3-5 karakter huruf besar. Contoh: `"WETH"`, `"USDC"`.

Dalam kontrak OpenZeppelin ERC20, keduanya ditetapkan melalui constructor dan tersimpan di storage sebagai variabel private yang bisa diakses via fungsi `name()` dan `symbol()`.

```solidity
constructor() ERC20("MyToken", "MTK") {
    // "MyToken" adalah name, "MTK" adalah symbol
}
```

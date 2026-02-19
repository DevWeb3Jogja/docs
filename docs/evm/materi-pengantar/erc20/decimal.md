---
title: Decimal
sidebar_label: Decimal
---

# Desimal

Solidity tidak mendukung angka desimal (floating point). Maka dari itu, token ERC20 menyimulasikan desimal dengan cara membagi nilai integer dengan faktor `10^decimals`.

Nilai default `decimals()` di OpenZeppelin adalah `18`, sama seperti ETH (1 ETH = 10^18 wei). Artinya:

- Jika kamu ingin merepresentasikan `1 MTK`, nilainya di kontrak adalah `1_000_000_000_000_000_000` (atau `1e18`).
- Jika kamu mint `100 * 10**18`, wallet pengguna akan menampilkan `100 MTK`.

Kamu bisa override fungsi `decimals()` jika ingin menggunakan nilai lain:

```solidity
function decimals() public pure override returns (uint8) {
    return 6; // seperti USDC
}
```

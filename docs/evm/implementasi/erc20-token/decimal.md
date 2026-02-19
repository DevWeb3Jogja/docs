---
title: Memberi Desimal
sidebar_label: Memberi Desimal
---

# Memberi Desimal

Nilai desimal default di OpenZeppelin ERC20 adalah `18`. Untuk sebagian besar kasus penggunaan, nilai ini sudah tepat karena sesuai dengan presisi ETH.

Jika kamu ingin menggunakan desimal yang berbeda, override fungsi `decimals()`:

```solidity
contract MyToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("MyToken", "MTK")
        Ownable(initialOwner)
    {}

    // Override untuk menggunakan 6 desimal
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
```

Perhatikan bahwa nilai `decimals` hanya digunakan oleh frontend dan wallet untuk menampilkan angka yang benar kepada pengguna. Di level kontrak, semua perhitungan tetap menggunakan integer.

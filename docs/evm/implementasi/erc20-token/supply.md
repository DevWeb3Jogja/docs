---
title: Memberi Supply
sidebar_label: Supply
---

# Memberi Supply

Supply token ditentukan melalui pemanggilan `_mint()` di dalam constructor. Fungsi `_mint` adalah fungsi internal OpenZeppelin yang tidak bisa dipanggil dari luar kontrak.

```solidity
constructor(address initialOwner)
    ERC20("MyToken", "MTK")
    Ownable(initialOwner)
{
    // Mint 1.000.000 MTK ke initialOwner
    // 10 ** decimals() = 10^18 karena decimals() mengembalikan 18
    _mint(initialOwner, 1_000_000 * 10 ** decimals());
}
```

Jika kamu menginginkan token yang mintable (bisa ditambah supply-nya), tambahkan fungsi mint publik yang dilindungi `onlyOwner`:

```solidity
function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
}
```

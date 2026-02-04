---
title: ERC20
sidebar_label: Pengenalan
---

# ERC20 Token Standard

**ERC20** adalah standar teknis untuk token fungible di blockchain Ethereum.

## Interface ERC20

```solidity
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```

## Komponen Utama

| Komponen | Deskripsi |
|----------|-----------|
| **Name** | Nama lengkap token |
| **Symbol** | Simbol ticker token |
| **Decimals** | Jumlah desimal (biasanya 18) |
| **Total Supply** | Total jumlah token |

---

Pelajari lebih lanjut:
- [Name & Symbol](/evm/materi-pengantar/erc20/name-symbol)
- [Decimal](/evm/materi-pengantar/erc20/decimal)
- [Supply](/evm/materi-pengantar/erc20/supply)

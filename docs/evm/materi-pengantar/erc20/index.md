---
title: ERC20
sidebar_label: Pengenalan
---

# ERC20 Token Standard

ERC20 adalah standar token yang paling umum di ekosistem Ethereum. "ERC" singkatan dari **Ethereum Request for Comment**, dan "20" adalah nomor proposal yang disetujui. Standar ini mendefinisikan satu set fungsi dan event yang harus diimplementasikan oleh setiap kontrak token agar bisa berinteroperasi dengan wallet, exchange, dan aplikasi lainnya.

## Fungsi Wajib

Fungsi wajib dalam standar ERC20:

| Fungsi | Deskripsi |
|--------|-----------|
| `totalSupply()` | Mengembalikan total supply token yang beredar |
| `balanceOf(address account)` | Mengembalikan saldo token milik `account` |
| `transfer(address to, uint256 amount)` | Mentransfer `amount` token dari `msg.sender` ke `to` |
| `allowance(address owner, address spender)` | Mengembalikan jumlah token yang diizinkan `owner` untuk dihabiskan oleh `spender` |
| `approve(address spender, uint256 amount)` | Memberikan izin kepada `spender` untuk menghabiskan hingga `amount` token milik `msg.sender` |
| `transferFrom(address from, address to, uint256 amount)` | Memindahkan token dari `from` ke `to` menggunakan allowance yang sudah diberikan |

## Event Wajib

Event yang harus dipancarkan:

| Event | Deskripsi |
|-------|-----------|
| `Transfer(address indexed from, address indexed to, uint256 value)` | Dipancarkan setiap kali token berpindah tangan |
| `Approval(address indexed owner, address indexed spender, uint256 value)` | Dipancarkan setiap kali allowance diubah |

Implementasi OpenZeppelin sudah menangani semua ini secara lengkap dan aman.

Event yang harus dipancarkan:

- `Transfer(address indexed from, address indexed to, uint256 value)`: Dipancarkan setiap kali token berpindah tangan.
- `Approval(address indexed owner, address indexed spender, uint256 value)`: Dipancarkan setiap kali allowance diubah.

Implementasi OpenZeppelin sudah menangani semua ini secara lengkap dan aman.

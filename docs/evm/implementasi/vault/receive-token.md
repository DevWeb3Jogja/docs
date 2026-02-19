---
title: Receive Token
sidebar_label: Receive Token
---

# Vault Dapat Menerima Token

Vault menerima token melalui fungsi `deposit()`. Mekanismenya menggunakan `transferFrom`, yang berarti pengguna harus terlebih dahulu memberikan allowance ke kontrak Vault sebelum bisa melakukan deposit.

## Alur Kerja Deposit

1. Pengguna memanggil `token.approve(address(vault), amount)` dari wallet atau aplikasi mereka.
2. Pengguna memanggil `vault.deposit(amount)`.
3. Kontrak Vault memanggil `token.transferFrom(msg.sender, address(this), amount)` untuk menarik token dari pengguna.

```solidity
// Di dalam deposit():
token.transferFrom(msg.sender, address(this), amount);
```

Kenapa `transferFrom` dan bukan `transfer`? Karena `transfer` memindahkan token dari `msg.sender` yang dalam konteks ini adalah kontrak Vault itu sendiri, bukan pengguna. `transferFrom` memungkinkan kontrak untuk menarik token dari akun lain atas nama mereka, selama allowance sudah diberikan.

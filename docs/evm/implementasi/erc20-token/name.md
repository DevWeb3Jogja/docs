---
title: Memberi Nama
sidebar_label: Name
---

# Memberi Nama

Nama token ditetapkan di constructor `ERC20` dengan argumen pertama. Nama ini dikembalikan oleh fungsi `name()` yang sudah diimplementasikan di OpenZeppelin dan bersifat read-only dari luar kontrak.

```solidity
ERC20("MyToken", "MTK")
//     ^^^^^^^
//     Ini nama tokennya
```

Nama tidak bisa diubah setelah deployment karena tersimpan sebagai immutable string di dalam implementasi OpenZeppelin. Pilih nama yang representatif dan pastikan tidak ada typo sebelum deploy ke mainnet.

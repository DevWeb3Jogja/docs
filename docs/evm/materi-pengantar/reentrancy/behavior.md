---
title: Reentrancy Behavior
sidebar_label: Reentrancy Behavior
---

# Reentrancy Behavior

Reentrancy biasanya relevan dan berbahaya dalam konteks kontrak-kontrak berikut:

## Kontrak yang Menyimpan dan Mengelola Aset Pengguna

- Kontrak Vault atau escrow yang menyimpan aset pengguna.
- Kontrak staking yang menyimpan token dan membagikan reward.
- Lending protocol tempat pengguna menyetor collateral.

## Situasi yang Membuka Peluang Reentrancy

- Setiap kali kontrak melakukan external call ke alamat yang tidak dikenal atau kontrak lain, terutama menggunakan `.call{value: ...}()`.
- Transfer ETH menggunakan `transfer()` atau `send()` lebih aman karena hanya meneruskan 2300 gas (tidak cukup untuk eksekusi kode kompleks), tapi pola ini sudah tidak direkomendasikan karena gas cost bisa berubah.
- Memanggil fungsi ERC20 seperti `transfer()` ke kontrak yang mengimplementasikan callback (misalnya ERC777 `tokensReceived`).

## Pola Perlindungan yang Umum Digunakan

1. **Checks-Effects-Interactions (CEI)**: Selalu update state sebelum melakukan external call.
2. **ReentrancyGuard**: Gunakan modifier `nonReentrant` dari OpenZeppelin pada fungsi yang berisiko.
3. **Pull over Push**: Daripada kontrak aktif mengirim ETH/token ke pengguna (push), lebih baik biarkan pengguna yang menariknya sendiri (pull).

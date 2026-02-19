---
title: Foundry & OpenZeppelin
sidebar_label: Apa itu Foundry dan OpenZeppelin
---

# Foundry & OpenZeppelin

## Apa itu Foundry dan OpenZeppelin?

**Foundry** adalah development toolchain untuk Solidity yang ditulis dalam Rust. Foundry jauh lebih cepat dibanding Hardhat untuk task-task seperti kompilasi kontrak dan menjalankan test. Foundry terdiri dari beberapa tools:

| Tool | Fungsi |
|------|--------|
| **forge** | Digunakan untuk kompilasi, testing, dan deployment kontrak |
| **cast** | CLI untuk berinteraksi dengan blockchain (membaca data, mengirim transaksi) |
| **anvil** | Local testnet node (mirip Ganache) yang bisa kamu jalankan secara lokal |
| **chisel** | REPL Solidity interaktif untuk eksperimen cepat |

Test di Foundry ditulis dalam Solidity sendiri, bukan JavaScript atau TypeScript. Ini keunggulan besar karena kamu tidak perlu berpindah bahasa saat testing.

## Apa itu OpenZeppelin?

**OpenZeppelin** adalah library smart contract yang sudah di-audit secara keamanan dan menjadi standar industri. Library ini menyediakan implementasi siap pakai untuk standar token (ERC20, ERC721, ERC1155), access control, security utilities, dan banyak lagi. Menggunakan OpenZeppelin jauh lebih aman daripada menulis implementasi standar dari nol.

---

Lanjut ke [Instalasi Foundry dan OpenZeppelin](/evm/foundry-openzeppelin/installation).

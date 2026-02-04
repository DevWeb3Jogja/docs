---
title: Pengenalan EVM
sidebar_label: Pengenalan
---

# Pengenalan EVM (Ethereum Virtual Machine)

EVM atau **Ethereum Virtual Machine** adalah lingkungan runtime untuk menjalankan smart contract di blockchain Ethereum dan blockchain lain yang compatible dengan EVM (seperti Polygon, BSC, Avalanche, dll).

## Apa itu EVM?

EVM adalah mesin virtual yang terisolasi dan deterministic yang menjalankan bytecode dari smart contract. Setiap node di jaringan Ethereum menjalankan EVM yang sama, memastikan bahwa hasil eksekusi smart contract konsisten di seluruh jaringan.

### Karakteristik EVM:

- **Turing Complete** - Dapat menjalankan logika programming yang kompleks
- **Deterministic** - Input yang sama selalu menghasilkan output yang sama
- **Isolated** - Smart contract berjalan dalam sandbox yang terisolasi
- **Gas-based** - Setiap operasi membutuhkan gas sebagai biaya komputasi

## Bahasa Pemrograman

Untuk menulis smart contract yang berjalan di EVM, kita menggunakan bahasa **Solidity**. Solidity adalah bahasa high-level yang mirip dengan JavaScript/C++ yang dikompilasi menjadi bytecode EVM.

```solidity
// Contoh sederhana smart contract
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string public message = "Hello, DevWeb3Jogja!";
}
```

## Apa yang akan kita pelajari?

Dalam seri dokumentasi ini, kita akan belajar:

1. **Setup Environment** - Instalasi Foundry dan OpenZeppelin
2. **Memahami ERC20** - Standar token yang paling populer
3. **Ownable Pattern** - Pola untuk kontrol akses
4. **Reentrancy** - Keamanan smart contract
5. **Implementasi** - Membuat ERC20 token dan Vault
6. **Unit Testing** - Testing smart contract dengan Foundry

Mari kita lanjut ke [Goals](/evm/goals) untuk memahami tujuan pembelajaran kita.

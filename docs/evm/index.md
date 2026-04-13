---
title: Pengenalan EVM
sidebar_label: Pengenalan
---

# Pengenalan EVM (Ethereum Virtual Machine)

EVM (Ethereum Virtual Machine) adalah mesin komputasi yang berjalan di atas jaringan Ethereum. Setiap node di jaringan Ethereum menjalankan EVM secara identik, yang membuatnya bersifat **deterministic** — artinya, input yang sama selalu menghasilkan output yang sama, di mana pun kode dieksekusi.

Smart contract yang kamu tulis dalam Solidity tidak langsung dieksekusi oleh mesin fisik. Solidity dikompilasi terlebih dahulu menjadi **bytecode**, yang kemudian dieksekusi oleh EVM. Proses ini mirip seperti Java yang dikompilasi ke bytecode JVM, lalu dieksekusi oleh JVM.

## Konsep Dasar EVM

Beberapa konsep dasar yang perlu kamu pahami sebelum menulis kontrak:

- **Storage**: Area penyimpanan permanen di blockchain. Setiap variabel state di kontrak tersimpan di sini. Akses ke storage relatif mahal secara gas.
- **Memory**: Area penyimpanan sementara yang hanya ada selama satu eksekusi fungsi. Lebih murah dari storage.
- **Calldata**: Area read-only tempat menyimpan argumen yang dikirim ke fungsi dari luar kontrak. Paling murah karena tidak bisa dimodifikasi.
- **Stack**: Area kerja EVM untuk operasi aritmetika dan logika. Developer tidak mengakses ini secara langsung.
- **msg.sender**: Alamat yang memanggil fungsi saat ini. Bisa berupa EOA (Externally Owned Account) atau kontrak lain.
- **msg.value**: Jumlah ETH (dalam wei) yang dikirim bersama dengan pemanggilan fungsi.

Setiap operasi di EVM memiliki biaya yang disebut **gas**. Semakin kompleks operasi, semakin besar gas yang dibutuhkan.

## Bahasa Pemrograman: Solidity

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

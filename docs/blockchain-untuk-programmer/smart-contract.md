---
title: Smart Contract
sidebar_label: Smart Contract
---

# Smart Contract

Kamu sudah tahu bahwa blockchain adalah database yang immutable dan transparent. Ethereum menambahkan satu lapisan lagi: kemampuan untuk menjalankan **kode program** yang tersimpan di blockchain itu sendiri. Kode inilah yang disebut **smart contract**.

## Apa itu Smart Contract?

Smart contract adalah **program yang di-deploy ke blockchain dan berjalan di EVM**.

Karakteristik yang membedakannya dari kode biasa:

- **Immutable setelah deploy** — kode tidak bisa diubah, dihapus, atau dihentikan oleh siapapun (termasuk pembuatnya)
- **Deterministik** — input yang sama selalu menghasilkan output yang sama, di semua node
- **Trustless** — tidak perlu mempercayai pembuatnya; perilakunya dijamin oleh kode
- **Transparan** — kode bisa dibaca oleh siapapun (setelah diverifikasi)

**Analogi programmer:** Smart contract itu seperti AWS Lambda function — tapi tidak dimiliki Amazon, tidak bisa di-shutdown, dan siapapun bisa memanggil fungsinya (sesuai aturan yang ditulis di kode). Deployment-nya permanent: sekali di-deploy, tidak bisa di-takedown.

## Solidity: Bahasa untuk Menulis Smart Contract

Bahasa utama untuk menulis smart contract di EVM adalah **Solidity** — bahasa yang sintaksnya terinspirasi dari JavaScript/C++.

Contoh smart contract sederhana:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private value;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}
```

Penjelasan singkat:
- `pragma solidity ^0.8.20` — versi compiler minimum
- `contract` — seperti `class` di OOP
- `uint256` — unsigned integer 256-bit (tipe data paling umum)
- `public` — fungsi bisa dipanggil dari luar
- `view` — fungsi hanya membaca, tidak mengubah state (gratis)

## Deploy = Publikasi Permanen

Ketika kamu "deploy" smart contract:

1. Kode dikompilasi menjadi EVM bytecode
2. Kamu membuat transaksi khusus yang membawa bytecode ini
3. Transaksi diproses, bytecode tersimpan di blockchain di address tertentu
4. Kontrak sekarang "hidup" di address itu — selamanya

```
Deploy → Address: 0xAbCd...1234
```

Address kontrak ini permanent. Siapapun bisa berinteraksi dengannya dengan mengirim transaksi ke address ini.

## ABI: Interface untuk Berkomunikasi dengan Kontrak

Ketika kamu men-deploy kontrak, kamu juga punya **ABI (Application Binary Interface)** — file JSON yang mendeskripsikan fungsi-fungsi apa saja yang ada di kontrak dan parameter apa yang mereka terima.

ABI ini yang digunakan frontend (JavaScript, wallet) untuk "berbicara" dengan kontrakmu.

```json
[
  {
    "name": "setValue",
    "type": "function",
    "inputs": [{ "name": "_value", "type": "uint256" }],
    "outputs": []
  },
  {
    "name": "getValue",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
]
```

**Analogi programmer:** ABI itu seperti OpenAPI spec atau Protobuf definition — dokumen yang mendeskripsikan interface kontrakmu sehingga client tahu cara memanggilnya.

## Events: Logging di Blockchain

Smart contract tidak bisa return value ke transaksi yang memanggilnya secara langsung — tapi bisa emit **events**. Events tersimpan di blockchain dan bisa di-query oleh aplikasi.

```solidity
event ValueUpdated(address indexed caller, uint256 newValue);

function setValue(uint256 _value) public {
    value = _value;
    emit ValueUpdated(msg.sender, _value);
}
```

**Analogi programmer:** Events itu seperti log statements yang permanen dan queryable — bayangkan structured logging yang tersimpan di database yang tidak bisa dihapus.

## Implikasi "Immutable" untuk Developer

Sifat immutable smart contract punya konsekuensi penting:

**Bug yang sudah ter-deploy tidak bisa di-patch langsung.**

Di backend biasa, kamu bisa hotfix → redeploy → selesai. Di smart contract, kode yang sudah di-deploy tidak bisa diubah. Kalau ada bug, pilihanmu adalah:
- Deploy kontrak baru dan migrasi pengguna ke sana
- Kalau ada proxy pattern, upgrade implementation (tapi ini pattern yang lebih advanced)

Ini kenapa **audit dan testing sebelum deploy ke mainnet itu sangat kritis**. Bug di kontrak yang menyimpan nilai besar bisa berakibat kehilangan dana yang tidak bisa dipulihkan.

> **Prinsip development:** Selalu test di testnet. Testing di mainnet langsung = gambling.

## Apa yang Bisa Dilakukan Smart Contract?

Smart contract adalah fondasi dari hampir semua aplikasi Web3:

| Aplikasi | Cara Kerja |
|---|---|
| **Token (ERC20)** | Kontrak yang menyimpan mapping address → saldo |
| **NFT (ERC721)** | Kontrak yang menyimpan kepemilikan item unik |
| **DEX (Exchange)** | Kontrak yang mengatur swap token berdasarkan formula matematika |
| **Lending Protocol** | Kontrak yang mengelola deposit, kolateral, dan pinjaman |
| **DAO Voting** | Kontrak yang mencatat vote dan mengeksekusi keputusan |

Semua ini berjalan tanpa server terpusat. Logika ada di kontrak, data ada di blockchain.

---

Di halaman berikutnya — halaman terakhir di section ini — kita akan setup semua tools yang kamu butuhkan untuk mulai development: testnet, faucet, dan Etherscan.

Lanjut ke [Testnet & Tools Dasar →](/blockchain-untuk-programmer/testnet-tools)

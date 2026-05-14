---
title: Testnet & Tools Dasar
sidebar_label: Testnet & Tools Dasar
---

# Testnet & Tools Dasar

Sebelum mulai ngoding, ada tiga hal yang perlu kamu kenali secara konsep: **testnet**, **faucet**, dan **block explorer**. Halaman ini menjelaskan ketiganya. Langkah instalasi & setup-nya sendiri ada di section [Persiapan Environment](../persiapan/index.md) — jangan dikerjakan di sini, cukup pahami dulu apa fungsinya.

## Testnet: Tempat Latihan yang Aman

**Testnet** adalah jaringan blockchain khusus untuk pengembangan — perilakunya sama dengan mainnet, tapi token native yang dipakai tidak punya nilai nyata dan bisa didapat gratis. Ini "staging server"-nya blockchain: kamu bisa deploy kontrak, kirim transaksi, dan bereksperimen tanpa risiko kehilangan uang.

Setiap chain EVM punya testnet-nya sendiri. Contoh:

| Testnet | Untuk chain | Chain ID | Block explorer |
|---|---|---|---|
| **Sepolia** | Ethereum L1 | `11155111` | [sepolia.etherscan.io](https://sepolia.etherscan.io) |
| Base Sepolia | Base (L2) | `84532` | [sepolia.basescan.org](https://sepolia.basescan.org) |
| BNB Smart Chain Testnet | BNB Smart Chain | `97` | [testnet.bscscan.com](https://testnet.bscscan.com) |

Di docs ini, contoh-contoh memakai **Sepolia** karena itu testnet paling kanonik. Tapi yang penting bukan chain-nya — konsepnya identik di semua testnet, dan kamu bebas memakai chain EVM lain (mis. kalau workshop/bootcamp yang kamu ikuti menentukan chain tertentu). [Persiapan Environment → Wallet & Testnet](../persiapan/wallet-testnet.md) menyediakan tabel parameter beberapa testnet umum sebagai rujukan.

## Faucet: Keran Test Token

Untuk mengirim transaksi (termasuk men-deploy kontrak), kamu butuh sedikit token native untuk membayar gas. Di testnet, token ini gratis — kamu ambil dari **faucet** ("keran"): kamu tempel alamat wallet-mu, faucet mengirim sejumlah kecil token testnet.

Karena kadang satu faucet sedang kosong atau rate-limited, biasanya ada beberapa pilihan faucet untuk tiap testnet. Daftar faucet (Sepolia & beberapa chain lain) beserta cara klaimnya ada di [Persiapan Environment → Wallet & Testnet](../persiapan/wallet-testnet.md).

## Block Explorer: DevTools untuk Blockchain

**Block explorer** adalah situs untuk "meng-inspect" apa yang terjadi di blockchain — mirip tab Network di Browser DevTools. Tiap chain punya explorer-nya sendiri (Etherscan untuk Ethereum, Basescan untuk Base, BscScan untuk BNB Smart Chain), dengan tampilan & fitur yang mirip.

Di situ kamu bisa:
- Melihat detail setiap transaksi (pengirim, penerima, gas yang dipakai, status sukses/gagal, event yang di-emit)
- Melihat saldo dan riwayat sebuah address
- Membaca source code smart contract yang sudah di-verify
- Memverifikasi bahwa transaksi/kontrak kamu benar-benar tercatat on-chain

Kamu akan sering membukanya saat debugging — bookmark explorer untuk chain yang kamu pakai.

## Tools yang Akan Dipakai (Gambaran)

Selain wallet & block explorer, ini tools utama yang akan kamu pasang dan pakai di materi-materi berikutnya:

| Tool | Fungsi | Dibahas detail di |
|---|---|---|
| **Foundry** (`forge`, `cast`, `anvil`) | Compile, test, deploy smart contract | [Persiapan Environment](../persiapan/tools-development.md) (install) & [Writing First Contract → Foundry & OpenZeppelin](../evm/foundry-openzeppelin/index.md) (penggunaan) |
| **OpenZeppelin Contracts** | Library kontrak yang sudah diaudit (ERC20, Ownable, ReentrancyGuard, dll) | [Writing First Contract](../evm/index.md) |
| **Node.js + pnpm** | Runtime & package manager untuk backend & frontend | [Persiapan Environment](../persiapan/tools-development.md) |
| **viem** | Library TypeScript untuk berinteraksi dengan blockchain | [Developer Tools → Viem](../developer-tools/viem/index.md) |
| **wagmi + RainbowKit** | Connect wallet & React hooks untuk dApp | [Frontend](../frontend/pengenalan.md) |
| **Code editor** (VS Code dll) | + ekstensi Solidity | [Persiapan Environment](../persiapan/tools-development.md) |

## Kamu Sudah Punya Fondasinya

Selamat — kamu sudah punya fondasi konseptual untuk Web3 development:

- **Blockchain** sebagai database distributed, immutable, transparan
- **Ethereum & chain EVM lain** (L2 maupun L1 independen seperti BNB Smart Chain) sebagai platform komputasi dengan EVM
- **Wallet & private key** sebagai sistem identitas kriptografi
- **Transaksi & gas** sebagai mekanisme eksekusi dan pembayaran
- **Smart contract** sebagai program yang hidup di blockchain
- **Testnet, faucet, block explorer** — dengan **Sepolia** sebagai contoh, dan tahu bahwa polanya sama untuk chain EVM lain

Sekarang saatnya menyiapkan komputermu untuk mulai ngoding.

Lanjut ke [Persiapan Environment →](../persiapan/index.md)

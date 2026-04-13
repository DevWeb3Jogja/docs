---
title: Testnet & Tools Dasar
sidebar_label: Testnet & Tools Dasar
---

# Testnet & Tools Dasar

Kamu sudah memahami konsep-konsepnya. Sekarang saatnya setup environment dan pastikan kamu punya semua tools yang dibutuhkan sebelum mulai menulis kode.

Di halaman ini kita akan setup:
- MetaMask terhubung ke Sepolia testnet
- Test ETH dari faucet
- Akses ke Etherscan untuk debugging

## 1. Install MetaMask

Jika belum, install MetaMask dari [metamask.io](https://metamask.io) sebagai ekstensi browser.

Setelah setup dan membuat akun baru, kamu akan mendapat address Ethereum pertamamu. **Catat dan simpan seed phrase-mu di tempat aman** (untuk akun development saja — jangan pakai akun yang sama untuk menyimpan aset nyata).

## 2. Tambahkan Sepolia Testnet

By default MetaMask menyembunyikan testnet. Aktifkan:

1. Klik nama network di bagian atas MetaMask (biasanya "Ethereum Mainnet")
2. Klik tombol **"Add a network"** atau **"Show test networks"**
3. Toggle **"Show test networks"** ke ON
4. Pilih **"Sepolia"** dari daftar

Sekarang MetaMask terhubung ke Sepolia — jaringan development yang aman untuk eksperimen.

## 3. Dapatkan Test ETH dari Faucet

Di testnet, kamu butuh test ETH untuk membayar gas. Test ETH tidak punya nilai nyata dan bisa didapat gratis dari **faucet**.

Faucet yang bisa digunakan untuk Sepolia:

| Faucet | URL | Kebutuhan |
|---|---|---|
| Alchemy Faucet | [sepoliafaucet.com](https://sepoliafaucet.com) | Akun Alchemy (gratis) |
| Infura Faucet | [infura.io/faucet](https://www.infura.io/faucet/sepolia) | Akun Infura (gratis) |
| Chainlink Faucet | [faucets.chain.link](https://faucets.chain.link) | Sign in with wallet |
| Google Cloud Faucet | [cloud.google.com/application/web3/faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) | Akun Google |

Cara pakai:
1. Buka salah satu faucet di atas
2. Paste address Ethereum kamu (dari MetaMask)
3. Request test ETH
4. Tunggu beberapa detik/menit — test ETH akan muncul di MetaMask

Biasanya kamu dapat 0.1–0.5 Sepolia ETH, cukup untuk puluhan/ratusan transaksi development.

> **Tip:** Simpan beberapa faucet di bookmark. Kadang satu faucet sedang kosong atau maintenance — punya backup itu berguna.

## 4. Verify di Etherscan Sepolia

Buka [sepolia.etherscan.io](https://sepolia.etherscan.io) dan paste address-mu.

Kalau test ETH sudah masuk, kamu akan melihat transaksi faucet di history. Ini konfirmasi bahwa MetaMask kamu sudah terhubung dengan benar ke Sepolia.

Bookmark halaman ini — kamu akan sering kembali ke sini saat debugging.

## Checklist: Siap Mulai Development

Sebelum lanjut ke section berikutnya, pastikan kamu sudah bisa centang semua ini:

- [ ] MetaMask terinstall dan akun sudah dibuat
- [ ] Seed phrase tersimpan aman
- [ ] MetaMask terhubung ke **Sepolia** testnet
- [ ] Saldo Sepolia ETH > 0 (dapat dari faucet)
- [ ] Bisa melihat transaksi di sepolia.etherscan.io

Kalau semua sudah terceklis, kamu siap!

## Tools yang Akan Kita Gunakan

Selain MetaMask dan Etherscan, ini tools yang akan dipakai di section-section berikutnya:

| Tool | Fungsi | Install |
|---|---|---|
| **Foundry** | Framework untuk compile, test, deploy kontrak | Via script (dijelaskan di section EVM) |
| **OpenZeppelin** | Library kontrak yang sudah diaudit | Via Foundry |
| **Node.js** | Runtime untuk frontend | [nodejs.org](https://nodejs.org) |
| **VS Code** | Editor (opsional tapi direkomendasikan) | [code.visualstudio.com](https://code.visualstudio.com) |

Untuk **VS Code**, install ekstensi **Solidity** (dari Nomic Foundation) untuk syntax highlighting dan autocomplete saat menulis kode Solidity.

---

## Kamu Sudah Siap

Selamat — kamu sudah punya fondasi konseptual yang dibutuhkan untuk memahami Web3 development:

- **Blockchain** sebagai database distributed, immutable, transparent
- **Ethereum** sebagai platform komputasi dengan EVM
- **Wallet & private key** sebagai sistem identitas kriptografi
- **Transaksi & gas** sebagai mekanisme eksekusi dan pembayaran
- **Smart contract** sebagai program yang hidup di blockchain

Dan kamu sudah punya environment yang siap.

Sekarang saatnya mulai menulis kode. Section berikutnya akan memandu kamu membuat smart contract pertamamu dari nol menggunakan Foundry dan OpenZeppelin.

Lanjut ke [Writing First Contract →](/evm/)

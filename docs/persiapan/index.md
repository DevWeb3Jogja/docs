---
title: Persiapan Environment
sidebar_label: Pengenalan
---

# Persiapan Environment

Sebelum kamu mulai membuat smart contract atau membangun dApp, ada beberapa hal yang harus terpasang di komputer dan di wallet kamu. Section ini adalah daftar lengkapnya — kerjakan sekali di awal, dan kamu siap untuk semua materi berikutnya (Writing First Contract, Frontend, Developer Tools, dst).

Estimasi waktu: **±1–2 jam** (lebih lama kalau kamu belum pernah ngoding sama sekali).

## Apa Saja yang Disiapkan

| Halaman | Isi |
|---|---|
| [Tools Development](./tools-development.md) | Node.js, pnpm, Git, code editor, **Foundry** — dan untuk pengguna Windows: cara pasang WSL2 |
| [Wallet & Testnet](./wallet-testnet.md) | Bikin wallet, tambah jaringan testnet, klaim token testnet dari faucet |

## Urutan yang Disarankan

1. **(Pengguna Windows)** Pasang **WSL2** dulu — semua tool development di bawah dijalankan di dalamnya. Lihat [Tools Development → bagian 0](./tools-development.md#0-pengguna-windows--pasang-wsl2-dulu-wajib).
2. **[Tools Development](./tools-development.md)** — install Node.js, pnpm, Git, code editor, Foundry. Verifikasi tiap langkah.
3. **[Wallet & Testnet](./wallet-testnet.md)** — bikin wallet, masuk ke jaringan testnet, ambil token testnet gratis dari faucet.

## Chain yang Dipakai

Materi di docs ini memakai **Sepolia** (testnet resmi Ethereum) sebagai contoh. Tapi semua chain EVM bekerja dengan cara yang sama — kalau kamu ingin memakai **Base Sepolia**, **BNB Smart Chain Testnet**, **Polygon Amoy**, atau yang lain (misalnya karena workshop/bootcamp yang kamu ikuti memakai chain tertentu), kamu cukup mengganti konfigurasi jaringannya: chain ID, RPC URL, dan faucet. Parameter untuk beberapa testnet umum ada di halaman [Wallet & Testnet](./wallet-testnet.md).

## Kalau Kamu Belum Pernah Ngoding Sama Sekali

Materi DevWeb3Jogja mengasumsikan kamu **sudah bisa coding dasar** (JavaScript/TypeScript) dan terbiasa pakai **terminal**. Kalau belum, luangkan waktu untuk dua hal ini dulu:

- **Dasar JavaScript/TypeScript** — variabel, function, array, object, `async/await`, cara pakai `npm`/`pnpm`. (Cari kursus pengantar singkat, ±1–2 jam cukup untuk modal awal.)
- **Dasar terminal/CLI** — `cd`, `ls`, menjalankan perintah, environment variable. (±15–30 menit.)

Tanpa dua fondasi ini, materi-materi praktik akan terasa sangat berat. Tidak perlu jago — cukup tidak asing.

## Daftar Centang

Kamu siap mulai ngoding kalau semua ini sudah tercentang:

- [ ] **(Windows)** WSL2 terpasang, dan kamu sudah punya terminal Ubuntu
- [ ] `node -v` → v22.x
- [ ] `pnpm -v` → 10.x
- [ ] `git --version` → ada
- [ ] `forge --version` → ada
- [ ] Code editor + ekstensi Solidity terpasang
- [ ] Wallet terpasang & seed phrase disimpan aman
- [ ] Jaringan testnet (mis. **Sepolia**) aktif di wallet
- [ ] Ada token testnet (mis. **Sepolia ETH**) di wallet
- [ ] Bisa membuka alamat wallet kamu di block explorer (mis. [sepolia.etherscan.io](https://sepolia.etherscan.io))

Kalau semua sudah, lanjut ke [Writing First Contract →](../evm/index.md).

---

Mulai dari [Tools Development →](./tools-development.md)

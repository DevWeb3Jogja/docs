---
title: Wallet & Testnet
sidebar_label: Wallet & Testnet
---

# Wallet & Testnet

Untuk berinteraksi dengan blockchain — connect ke dApp, deploy kontrak, kirim transaksi — kamu butuh **wallet** dan sedikit **token testnet** untuk membayar gas. Halaman ini fokus ke langkah praktis. Untuk konsep di balik wallet, baca [Wallet & Account](../blockchain-untuk-programmer/wallet-account.md) dan [Testnet & Tools Dasar](../blockchain-untuk-programmer/testnet-tools.md).

Sebagai contoh di halaman ini, kita memakai **Sepolia** (testnet resmi Ethereum). Kalau kamu ingin memakai chain EVM lain (Base Sepolia, BNB Smart Chain Testnet, dll), langkahnya sama persis — tinggal ganti parameter jaringan di langkah 2 dan faucet di langkah 3. Lihat [tabel testnet lain](#testnet-lain) di bawah.

## 1. Pasang Wallet

Pilih salah satu wallet browser extension:

- **[MetaMask](https://metamask.io)** — paling umum, banyak tutorial.
- **[Rabby](https://rabby.io)** — alternatif yang ramah developer.

:::warning Pakai wallet baru
Untuk belajar, **buat wallet baru** — jangan pakai wallet yang berisi aset asli. Simpan _seed phrase_ (12 kata) di tempat aman dan jangan pernah dibagikan ke siapa pun. Tidak ada aplikasi legitimate yang akan memintanya.
:::

> Sebagian aplikasi modern memakai **embedded wallet** (login pakai email/social, tanpa seed phrase, transaksi bisa gasless — mis. lewat Privy). Kalau materi/proyek yang kamu kerjakan memakai itu, ikuti instruksinya — tapi memasang MetaMask juga tetap berguna karena dipakai saat men-deploy kontrak.

## 2. Tambah Jaringan Testnet (Sepolia)

MetaMask biasanya sudah punya Sepolia bawaan — kamu tinggal mengaktifkannya:

1. Klik nama network di bagian atas MetaMask (biasanya "Ethereum Mainnet").
2. Aktifkan **"Show test networks"**.
3. Pilih **"Sepolia"**.

Kalau jaringannya tidak ada (atau kamu mau menambah testnet lain), cara termudah: buka **[chainlist.org](https://chainlist.org)** → centang "Include Testnets" → cari nama jaringannya → "Connect Wallet" → "Add to wallet". Parameter Sepolia kalau mau ditambah manual: Chain ID `11155111`, explorer [sepolia.etherscan.io](https://sepolia.etherscan.io).

## 3. Klaim Token Testnet (Faucet)

Token testnet itu gratis dan cuma buat bayar gas — tidak ada nilai uang asli. Klaim dari **faucet**: kamu tempel alamat wallet-mu, faucet mengirim sejumlah kecil token.

Faucet untuk **Sepolia ETH** (kadang satu faucet kosong/rate-limited — punya beberapa cadangan itu berguna):

| Faucet | Catatan |
|---|---|
| [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) | Butuh akun Google |
| [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) | Butuh akun Alchemy (gratis) |
| [Chainlink Faucet](https://faucets.chain.link) | Sign in dengan wallet |

Tunggu beberapa saat, lalu cek saldo wallet kamu — harusnya ada sedikit ETH testnet.

## 4. Cek di Block Explorer

Buka **[sepolia.etherscan.io](https://sepolia.etherscan.io)**, tempel alamat wallet kamu di kolom pencarian. Kamu akan lihat saldo dan riwayat transaksi (kalau ada). Ini tool yang akan sering kamu pakai untuk memverifikasi transaksi & kontrak.

## Testnet Lain

Kalau kamu (atau workshop/bootcamp yang kamu ikuti) memakai chain EVM lain, ganti parameter di langkah 2 dengan yang sesuai, dan cari faucet untuk token chain tersebut:

| Testnet | Chain ID | Token | Block explorer | Faucet |
|---|---|---|---|---|
| Sepolia (Ethereum L1) | `11155111` | ETH | [sepolia.etherscan.io](https://sepolia.etherscan.io) | lihat tabel di atas |
| Base Sepolia | `84532` | ETH | [sepolia.basescan.org](https://sepolia.basescan.org) | [docs.base.org/chain/network-faucets](https://docs.base.org/chain/network-faucets) |
| BNB Smart Chain Testnet | `97` | tBNB | [testnet.bscscan.com](https://testnet.bscscan.com) | [bnbchain.org/en/testnet-faucet](https://www.bnbchain.org/en/testnet-faucet) |
| Polygon Amoy | `80002` | POL | [amoy.polygonscan.com](https://amoy.polygonscan.com) | [faucet.polygon.technology](https://faucet.polygon.technology) |

RPC URL publik untuk tiap chain bisa diambil dari [chainlist.org](https://chainlist.org).

## Kamu Siap Kalau...

- ✅ Wallet terpasang dan kamu sudah simpan seed phrase dengan aman
- ✅ Jaringan testnet (mis. Sepolia) sudah aktif di wallet
- ✅ Ada saldo token testnet (mis. Sepolia ETH) di wallet
- ✅ Bisa membuka alamat wallet kamu di block explorer-nya (mis. [sepolia.etherscan.io](https://sepolia.etherscan.io))

Kalau semua sudah, kamu siap mulai [Writing First Contract →](../evm/index.md).

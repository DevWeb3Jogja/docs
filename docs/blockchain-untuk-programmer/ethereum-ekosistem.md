---
title: Ethereum & Ekosistemnya
sidebar_label: Ethereum & Ekosistemnya
---

# Ethereum & Ekosistemnya

Di halaman sebelumnya kita sudah memahami blockchain sebagai database yang distributed, immutable, dan transparent. Sekarang pertanyaannya: kenapa Ethereum yang kita pelajari? Dan apa itu "EVM chain" yang sering disebut-sebut?

## Ethereum: Lebih dari Sekadar Database

Bitcoin adalah blockchain pertama yang populer — tapi tujuannya spesifik: transfer nilai (uang digital). Ethereum datang dengan ide yang lebih besar:

> **Ethereum adalah platform untuk menjalankan kode yang tidak bisa dihentikan atau disensor oleh siapapun.**

Ethereum bukan hanya menyimpan data transaksi keuangan. Ethereum menyimpan dan menjalankan **kode program** — yang disebut smart contract. Siapapun bisa men-deploy kode ke Ethereum, dan kode itu akan berjalan persis seperti yang ditulis, selamanya, tanpa bisa dimatikan.

**Analogi programmer:** Bayangkan sebuah cloud compute platform (seperti AWS Lambda) yang tidak dimiliki Amazon, tidak bisa di-shutdown, dan siapapun bisa deploy fungsi ke dalamnya. Itulah Ethereum.

## EVM: Mesin yang Menjalankan Kode

**EVM (Ethereum Virtual Machine)** adalah mesin virtual yang menjalankan smart contract di Ethereum. Setiap node di jaringan Ethereum menjalankan EVM yang identik — itulah yang membuat eksekusi kode bersifat **deterministic**: input yang sama selalu menghasilkan output yang sama, di mana pun kode dijalankan.

**Analogi programmer:** EVM itu seperti JVM (Java Virtual Machine). Kamu menulis kode Solidity → di-compile ke EVM bytecode → dijalankan oleh semua node menggunakan EVM yang sama. Hasilnya identik di semua node.

## Kenapa Banyak Chain Lain Kompatibel dengan Ethereum?

Kamu mungkin sering mendengar nama seperti **Base**, **Optimism**, **Arbitrum**, atau **Polygon**. Ini semua adalah blockchain yang berbeda dari Ethereum Mainnet — tapi semuanya **EVM-compatible**.

Artinya, mereka menggunakan spesifikasi EVM yang sama. Kode Solidity yang kamu tulis untuk Ethereum bisa langsung di-deploy ke Base, Optimism, atau Arbitrum **tanpa perubahan apapun**.

Kenapa ada banyak chain ini? Karena Ethereum Mainnet mahal dan lambat untuk beberapa use case. Chain-chain ini (disebut **Layer 2** atau **L2**) dibangun di atas Ethereum untuk memberikan transaksi yang lebih cepat dan murah, sambil mewarisi keamanan dari Ethereum.

| Chain | Tipe | Kegunaan Utama | Biaya Gas Relatif |
|---|---|---|---|
| Ethereum | L1 (Mainnet) | DeFi high-value, NFT prestisius | Tinggi |
| Base | L2 (Optimistic) | Consumer apps, onboarding massal | Sangat Rendah |
| Optimism | L2 (Optimistic) | DeFi, governance | Rendah |
| Arbitrum | L2 (Optimistic) | DeFi, gaming | Rendah |
| Polygon | Sidechain/L2 | Gaming, NFT, enterprise | Sangat Rendah |

Untuk belajar di kursus ini, kita akan menggunakan **Sepolia** (testnet Ethereum) dan **Base Sepolia** (testnet Base) — jadi kamu tidak perlu khawatir soal biaya.

## Mainnet vs Testnet: Production vs Staging

Ini konsep yang sangat penting dan paling sering membingungkan pemula:

**Mainnet** = jaringan blockchain utama yang menggunakan uang sungguhan. Transaksi di sini nyata, ETH yang dipakai punya nilai, dan kesalahan bisa berakibat kehilangan uang.

**Testnet** = jaringan blockchain khusus untuk pengembangan. Uang yang digunakan (test ETH) tidak punya nilai nyata dan bisa didapatkan gratis dari "faucet".

**Analogi programmer:** Mainnet = production server. Testnet = staging/development server.

> **Aturan pertama development blockchain: SELALU kerjakan di testnet terlebih dahulu. Jangan pernah deploy langsung ke mainnet tanpa testing yang matang.**

Testnet yang akan kita gunakan:
- **Sepolia** — testnet resmi Ethereum, paling stabil untuk development
- **Base Sepolia** — testnet untuk Base chain, digunakan di modul Frontend

## Block Explorer: DevTools untuk Blockchain

Kalau kamu terbiasa membuka Browser DevTools untuk inspect network request, di blockchain kamu menggunakan **block explorer**.

**Etherscan** (etherscan.io) adalah block explorer paling populer. Untuk Sepolia: [sepolia.etherscan.io](https://sepolia.etherscan.io)

Di block explorer kamu bisa:
- Melihat detail setiap transaksi (siapa mengirim ke siapa, berapa gas yang dipakai)
- Melihat saldo setiap address
- Membaca kode smart contract yang sudah di-verify
- Memonitor event yang di-emit kontrak

Kamu akan sering membuka Etherscan saat debugging. Bookmark sekarang.

---

Di halaman berikutnya, kita akan membahas cara identitas bekerja di blockchain — menggantikan sistem username/password yang kamu kenal.

Lanjut ke [Wallet & Account →](/blockchain-untuk-programmer/wallet-account)

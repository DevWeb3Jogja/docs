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

Kamu mungkin sering mendengar nama seperti **BNB Smart Chain**, **Base**, **Optimism**, **Arbitrum**, atau **Polygon**. Ini semua adalah blockchain yang berbeda dari Ethereum Mainnet — tapi semuanya **EVM-compatible**.

Artinya, mereka menggunakan spesifikasi EVM yang sama. Kode Solidity yang kamu tulis untuk Ethereum bisa langsung di-deploy ke BNB Smart Chain, Base, Optimism, atau yang lain **tanpa perubahan apapun**.

Kenapa ada banyak chain ini? Karena Ethereum Mainnet mahal dan lambat untuk beberapa use case. Sebagian dibangun **di atas** Ethereum sebagai **Layer 2 (L2)** — lebih cepat & murah, sambil mewarisi keamanan Ethereum (contoh: Base, Optimism, Arbitrum). Sebagian lagi adalah **chain L1 independen yang EVM-compatible** — punya validator & konsensus sendiri, bukan turunan Ethereum, tapi tetap menjalankan kontrak Solidity yang sama (contoh: **BNB Smart Chain**).

| Chain | Tipe | Kegunaan Utama | Biaya Gas Relatif |
|---|---|---|---|
| Ethereum | L1 (Mainnet) | DeFi high-value, NFT prestisius | Tinggi |
| BNB Smart Chain | L1 independen (EVM-compatible) | DeFi, ritel, gaming, ekosistem besar di Asia | Rendah |
| Base | L2 (Optimistic) | Consumer apps, onboarding massal | Sangat Rendah |
| Optimism | L2 (Optimistic) | DeFi, governance | Rendah |
| Arbitrum | L2 (Optimistic) | DeFi, gaming | Rendah |
| Polygon | Sidechain/L2 | Gaming, NFT, enterprise | Sangat Rendah |

Untuk belajar di docs ini, kita banyak memakai **Sepolia** — testnet resmi Ethereum L1 — sebagai contoh kanonik. Tapi karena semua chain di atas EVM-compatible, konsep & kode yang sama berlaku di mana pun: kalau kamu mau memakai **Base**, **BNB Smart Chain**, **Polygon**, atau yang lain, kamu hanya perlu mengganti konfigurasi jaringannya — sisanya identik.

## Mainnet vs Testnet: Production vs Staging

Ini konsep yang sangat penting dan paling sering membingungkan pemula:

**Mainnet** = jaringan blockchain utama yang menggunakan uang sungguhan. Transaksi di sini nyata, ETH yang dipakai punya nilai, dan kesalahan bisa berakibat kehilangan uang.

**Testnet** = jaringan blockchain khusus untuk pengembangan. Uang yang digunakan (test ETH) tidak punya nilai nyata dan bisa didapatkan gratis dari "faucet".

**Analogi programmer:** Mainnet = production server. Testnet = staging/development server.

> **Aturan pertama development blockchain: SELALU kerjakan di testnet terlebih dahulu. Jangan pernah deploy langsung ke mainnet tanpa testing yang matang.**

Testnet yang umum dipakai:
- **Sepolia** — testnet resmi Ethereum L1, paling stabil & paling banyak dijadikan contoh. Ini yang dipakai sebagai contoh di docs ini.
- **Testnet dari chain EVM lain** — mis. **Base Sepolia** (untuk Base), **BNB Smart Chain Testnet** (untuk BNB Smart Chain), **Polygon Amoy**, dll. Konsepnya identik dengan Sepolia; yang beda hanya chain ID, RPC URL, dan faucet-nya.

> Apa pun chain-nya, langkah setup-nya sama: pasang wallet → tambah jaringan → ambil token dari faucet → cek di block explorer. Detailnya ada di [Persiapan Environment → Wallet & Testnet](../persiapan/wallet-testnet.md) (lengkap dengan tabel parameter beberapa testnet umum).

## Block Explorer: DevTools untuk Blockchain

Kalau kamu terbiasa membuka Browser DevTools untuk inspect network request, di blockchain kamu menggunakan **block explorer**.

**Etherscan** (etherscan.io) adalah block explorer paling populer. Untuk Sepolia: [sepolia.etherscan.io](https://sepolia.etherscan.io). Setiap chain punya explorer-nya sendiri dengan tampilan yang mirip — mis. [basescan.org](https://basescan.org) untuk Base, [bscscan.com](https://bscscan.com) untuk BNB Smart Chain (dan [testnet.bscscan.com](https://testnet.bscscan.com) untuk testnet-nya).

Di block explorer kamu bisa:
- Melihat detail setiap transaksi (siapa mengirim ke siapa, berapa gas yang dipakai)
- Melihat saldo setiap address
- Membaca kode smart contract yang sudah di-verify
- Memonitor event yang di-emit kontrak

Kamu akan sering membuka block explorer saat debugging.

---

Di halaman berikutnya, kita akan membahas cara identitas bekerja di blockchain — menggantikan sistem username/password yang kamu kenal.

Lanjut ke [Wallet & Account →](/blockchain-untuk-programmer/wallet-account)

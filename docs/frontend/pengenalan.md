---
id: pengenalan
title: Pengenalan Frontend Web3
sidebar_label: Pengenalan
sidebar_position: 1
---

# Panduan Frontend Web3 untuk Pemula

Selamat datang di modul Frontend! Jika sebelumnya kamu sudah belajar cara membuat _Smart Contract_, sekarang saatnya kita membangun "wajah" agar pengguna bisa berinteraksi dengan kontrak tersebut.

Di Web3, Frontend bagaikan jembatan penghubung antara alat masuk pengguna (Wallet) dan jaringan Blockchain itu sendiri. Sebuah dApp (Decentralized Application) yang hebat tidak hanya memiliki _Smart Contract_ yang aman, namun juga antarmuka yang mudah dan nyaman digunakan.

---

## Perubahan Paradigma: Web2 vs Web3

Sebelum menulis kode apa pun, bayangkan perbedaan struktur aplikasi antara aplikasi tradisional (Web2) dengan aplikasi berbasis blockchain (Web3). Memahami hal ini akan mempermudah kamu memahami setiap alat yang akan kita gunakan selanjutnya.

| Fitur                   | Web2 (Tradisional)                       | Web3 (Decentralized)                             | Penjelasan                                                                                                                                            |
| :---------------------- | :--------------------------------------- | :----------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identitas**           | Email / Username / Password / OAuth      | **Wallet Address** (Public Key)                  | Di Web3, pengguna tidak perlu mendaftar. Kepemilikan Wallet Address sudah menjadi identitas yang valid.                                               |
| **Data Repository**     | Database Terpusat (PostgreSQL, MongoDB)  | **Smart Contract** (On-chain/Ledger)             | Semua logika program dan saldo aset dicatat di blockchain secara publik dan _immutable_ melalui Smart Contract.                                       |
| **Otorisasi**           | Login Session / JWT / Cookies            | **Digital Signature** (Via Wallet)               | Setiap aksi yang memodifikasi state memerlukan _signature_ rahasia menggunakan Private Key masing-masing milik pengguna.                              |
| **Biaya Infrastruktur** | Developer atau perusahaan menyewa Server | User membayar **Gas Fee** untuk setiap transaksi | Aksi menulis data ke blockchain membutuhkan verifikasi _miners_ atau _validators_, sehingga pengguna harus membayar biaya tersebut di jaringan utama. |

Melalui panduan ini, kamu akan diajarkan cara mengadopsi standar pengembangan dApp modern. Kamu siap? Lanjut ke tahap berikutnya!

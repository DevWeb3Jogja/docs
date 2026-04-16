---
title: Apa itu Blockchain?
sidebar_label: Apa itu Blockchain?
---

# Apa itu Blockchain?

Sebelum masuk ke Ethereum dan smart contract, kita perlu membangun mental model yang benar tentang blockchain. Dan cara termudah untuk membangunnya adalah dari analogi yang sudah kamu kenal sebagai programmer.

![Ilustrasi jaringan blockchain: node-node terhubung satu sama lain secara peer-to-peer dengan blok-blok yang berrantai di tengah](/image/blockchain-network.svg)

## Bayangkan Database yang Tidak Dimiliki Siapa-siapa

Kamu terbiasa dengan database. PostgreSQL, MySQL, MongoDB — semuanya punya satu kesamaan: **ada server yang menghosting-nya, dan ada pemiliknya**. Kalau AWS mengalami gangguan, database-mu down. Kalau perusahaanmu tutup, database-mu hilang. Kalau pemilik database memutuskan menghapus datamu, data itu hilang.

Blockchain adalah database dengan aturan yang berbeda fundamental:

> Bayangkan sebuah database yang berjalan di ribuan komputer sekaligus, tidak dimiliki siapa-siapa, dan tidak bisa dimatikan oleh satu pihak pun.

Tidak ada satu server. Tidak ada satu pemilik. Setiap komputer yang bergabung ke jaringan (disebut **node**) menyimpan salinan lengkap dari semua data.

## Tiga Sifat Utama

### 1. Distributed — Tidak Ada Single Point of Failure

Di database biasa, semua operasi berjalan melalui satu server (atau cluster server yang kamu kelola). Di blockchain, ribuan node independen di seluruh dunia semua menjalankan data yang sama.

Kalau 1.000 node offline, sisa 9.000 node masih berjalan. Tidak ada yang bisa mematikannya karena tidak ada "tombol off" terpusat.

**Analogi programmer:** Ini seperti git — setiap orang punya salinan lengkap dari repository. Tidak ada satu "server git" yang kalau down membuat semua pekerjaan hilang.

### 2. Immutable — Tidak Ada UPDATE atau DELETE

Di database biasa, kamu bisa `UPDATE`, `DELETE`, bahkan `DROP TABLE`. Di blockchain, data yang sudah masuk **tidak bisa diubah atau dihapus**.

Blockchain bekerja seperti **append-only log** — kamu hanya bisa menambah data baru di ujung, tidak bisa mengubah yang sudah ada. Setiap "blok" data baru terhubung secara kriptografi ke blok sebelumnya, membentuk rantai (_chain_) yang tidak bisa dimanipulasi tanpa menghancurkan seluruh rantai.

**Analogi programmer:** Ini seperti write-ahead log (WAL) di PostgreSQL atau event log di event sourcing — rekaman permanen dari setiap perubahan, dalam urutan waktu.

### 3. Transparent — Semua Orang Bisa SELECT *

Di database biasa, akses dikontrol lewat permission system. Di blockchain publik seperti Ethereum, **semua data bisa dibaca oleh siapa saja**, kapan saja, tanpa perlu izin.

Kamu bisa melihat semua transaksi yang pernah terjadi, semua kode smart contract yang pernah di-deploy, dan semua saldo yang ada — semuanya publik.

**Analogi programmer:** Bayangkan kalau kamu `GRANT SELECT ON ALL TABLES TO public` — tapi berlaku untuk semua orang di dunia dan tidak bisa di-revoke.

## Perbandingan: Database Biasa vs Blockchain

| Aspek | Database Biasa | Blockchain |
|---|---|---|
| **Kepemilikan** | Dimiliki oleh perusahaan/individu | Tidak dimiliki siapapun |
| **Siapa yang bisa baca** | Sesuai permission | Siapa saja (blockchain publik) |
| **Siapa yang bisa tulis** | Sesuai permission | Siapa saja yang punya akun |
| **Bisa dihapus?** | Ya | Tidak — append-only |
| **Bisa diubah?** | Ya | Tidak setelah dikonfirmasi |
| **Biaya operasi** | Dibayar oleh pemilik infrastruktur | Dibayar oleh pengguna per operasi |
| **Uptime** | Tergantung infrastruktur pemilik | Selama ada node yang berjalan |
| **Sumber kebenaran** | Server yang dikontrol pemilik | Konsensus dari semua node |

## Bagaimana Node Mencapai Kesepakatan?

Ini pertanyaan yang wajar: kalau ada ribuan node independen, bagaimana mereka semua setuju mana data yang "benar"?

Jawabannya adalah **mekanisme konsensus** — aturan matematika yang membuat semua node setuju tentang urutan transaksi yang valid. Ethereum menggunakan **Proof of Stake** di mana node yang ingin menambah blok baru harus "mengunci" sejumlah ETH sebagai jaminan. Kalau mereka curang, jaminan itu hilang.

Kamu tidak perlu memahami detailnya untuk menulis smart contract — cukup tahu bahwa mekanisme ini yang membuat blockchain bisa dipercaya tanpa perlu mempercayai satu pihak tertentu.

## Apa yang Ini Berarti untuk Programmer?

Perbedaan-perbedaan ini akan mempengaruhi setiap keputusan yang kamu buat saat menulis kode untuk blockchain:

- **Tidak ada undo** — bug yang sudah ter-deploy bisa sangat mahal untuk diperbaiki
- **Semua orang bisa baca kodemu** — keamanan tidak bisa disembunyikan di balik kode yang "private"
- **Setiap operasi tulis ada harganya** — tidak bisa sembarangan menyimpan data seperti di database biasa
- **Tidak ada autentikasi terpusat** — identitas dibuktikan lewat kriptografi, bukan username/password

Di halaman berikutnya, kita akan melihat bagaimana Ethereum membangun platform komputasi di atas fondasi ini.

---

Lanjut ke [Ethereum & Ekosistemnya →](/blockchain-untuk-programmer/ethereum-ekosistem)

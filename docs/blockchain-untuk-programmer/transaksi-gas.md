---
title: Transaksi & Gas
sidebar_label: Transaksi & Gas
---

# Transaksi & Gas

Kalau di database biasa kamu bisa `SELECT` gratis dan hanya operasi tulis yang "mahal" (dalam hal resource CPU/IO), di blockchain perbedaan ini lebih ekstrem dan lebih literal: **membaca gratis, menulis berbayar uang sungguhan**.

## Membaca vs Menulis

### Membaca Data (Gratis)

Operasi read di blockchain — melihat saldo, membaca state kontrak, mengambil data — semuanya **gratis**. Kamu tidak perlu memiliki ETH, tidak perlu memiliki wallet, tidak perlu izin dari siapapun.

Kenapa gratis? Karena read hanya membaca dari salinan lokal node yang kamu query. Tidak ada perubahan state yang perlu di-broadcast ke seluruh jaringan.

### Menulis Data (Berbayar)

Setiap operasi yang **mengubah state blockchain** — transfer ETH, deploy kontrak, memanggil fungsi yang memodifikasi data — memerlukan **transaksi**.

Dan setiap transaksi perlu dibayar dengan **gas**.

## Apa itu Gas?

Gas adalah **satuan untuk mengukur komputasi** yang dibutuhkan untuk menjalankan suatu operasi di EVM.

Setiap instruksi EVM punya biaya gas yang sudah ditentukan:
- Operasi aritmatika sederhana: ~3 gas
- Membaca dari storage: ~2,100 gas
- Menulis ke storage: ~20,000 gas
- Deploy kontrak baru: tergantung ukuran bytecode

Semakin kompleks transaksimu, semakin banyak gas yang dibutuhkan.

**Kenapa ada gas?** Dua alasan:
1. **Mencegah spam** — kalau semua operasi gratis, orang bisa mem-flood jaringan dengan loop tak terbatas
2. **Memberi insentif ke node** — node yang memproses transaksi mendapat bayaran dari gas fee

**Analogi programmer:** Gas itu seperti CPU credits di cloud computing. Setiap operasi di VM menghabiskan sejumlah credit. Kamu membayar berdasarkan berapa banyak komputasi yang kamu gunakan — bukan flat rate.

## Komponen Biaya Transaksi

Biaya total yang kamu bayar = **gas used × gas price**

```
Total Fee = Gas Used × Gas Price (dalam Gwei)
```

**Gas Used** = jumlah gas aktual yang dipakai transaksimu

**Gas Price** = berapa ETH yang kamu bayar per unit gas. Satuannya adalah **Gwei** (1 ETH = 1,000,000,000 Gwei = 10^9 Gwei)

**Gas Limit** = batas maksimum gas yang kamu izinkan dipakai. Ini proteksi agar kalau ada bug di kontrak yang menyebabkan loop tak terbatas, dompetmu tidak terkuras habis. Gas yang tidak terpakai dikembalikan.

### Contoh Kalkulasi

```
Transfer ETH sederhana:
- Gas Used: 21,000 (fixed untuk transfer ETH biasa)
- Gas Price: 20 Gwei
- Total: 21,000 × 20 Gwei = 420,000 Gwei = 0.00042 ETH
```

## Lifecycle Sebuah Transaksi

Kalau kamu terbiasa dengan HTTP request yang synchronous (kirim request → tunggu → dapat response), transaksi blockchain sangat berbeda:

```
1. User sign transaksi dengan private key
        ↓
2. Transaksi di-broadcast ke jaringan
        ↓
3. Transaksi masuk ke mempool (antrian menunggu)
        ↓
4. Validator memilih transaksi dari mempool
   (biasanya prioritas berdasarkan gas price tertinggi)
        ↓
5. Transaksi dieksekusi dan dimasukkan ke blok
        ↓
6. Blok di-broadcast, node lain memverifikasi
        ↓
7. Setelah beberapa blok konfirmasi → transaksi dianggap final
```

**Waktu konfirmasi:** Di Ethereum Mainnet sekitar 12 detik per blok. Di testnet Sepolia bisa bervariasi. Di L2 seperti Base bisa lebih cepat.

**Analogi programmer:** Lifecycle transaksi itu seperti message queue (seperti RabbitMQ atau Kafka):
- Kamu publish message (broadcast transaksi)
- Message masuk ke queue (mempool)
- Consumer (validator) memproses message sesuai prioritas
- Tidak ada response synchronous — kamu harus polling atau subscribe untuk tahu hasilnya

## Transaksi yang Gagal

Transaksi bisa gagal karena berbagai alasan (kondisi tidak terpenuhi, gas habis, dll). Yang perlu kamu tahu:

> **Kalau transaksi gagal, gas tetap hangus.**

Kamu sudah membayar komputasi yang sudah dilakukan (sampai titik kegagalan), meskipun hasilnya tidak berhasil. Ini berbeda dari konsep "rollback" yang gratis di database.

Ini salah satu alasan kenapa testing di testnet itu penting — kesalahan di mainnet bisa sangat mahal.

## Apa Artinya Untuk Programmer?

Konsep gas mengubah cara kamu berpikir tentang kode:

- **Setiap baris kode punya harga** — nested loop yang di-backend biasa tidak apa-apa, di smart contract bisa menghabiskan ratusan ribu gas
- **Menyimpan data di blockchain mahal** — storage adalah operasi paling mahal. Data besar seharusnya di-store off-chain
- **Estimasi gas sebelum deploy** — kamu perlu tahu berapa kira-kira gas yang dibutuhkan fungsimu agar pengguna tidak terkejut
- **Optimize untuk gas efficiency** — salah satu skill penting di Solidity adalah menulis kode yang hemat gas

---

Di halaman berikutnya, kita akan membahas smart contract — program yang hidup di blockchain dan menjadi fondasi semua aplikasi Web3.

Lanjut ke [Smart Contract →](/blockchain-untuk-programmer/smart-contract)

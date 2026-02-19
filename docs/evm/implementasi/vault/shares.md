---
title: Perhitungan Shares
sidebar_label: Perhitungan Shares
---

# Perhitungan Shares

Shares adalah representasi proporsional dari kepemilikan pengguna terhadap total aset di dalam Vault. Rumusnya:

```
sharesToMint = (amount * totalShares) / totalTokenBalance
```

## Kasus Pertama (Vault Kosong)

Jika `totalShares == 0` atau `totalTokenBalance == 0`, ini adalah deposit pertama. Shares yang diberikan sama dengan amount yang disetorkan (rasio 1:1). Ini menetapkan nilai awal shares.

## Kasus Selanjutnya

Rumus proporsional digunakan. Contoh:

- Vault memiliki 1000 MTK dan 1000 shares.
- Alice deposit 500 MTK.
- Shares yang diterima Alice: `(500 * 1000) / 1000 = 500 shares`.
- Total shares sekarang: 1500, total token: 1500 MTK.

Skenario dengan yield (misalnya Vault sudah menghasilkan reward):

- Vault memiliki 1200 MTK (karena ada yield 200 MTK) dan masih 1000 shares.
- Bob deposit 600 MTK.
- Shares yang diterima Bob: `(600 * 1000) / 1200 = 500 shares`.
- Total shares: 1500, total token: 1800 MTK.
- Nilai per share Bob saat ini: `1800 / 1500 = 1.2 MTK per share`.

Ketika Bob withdraw 500 shares: `(500 * 1800) / 1500 = 600 MTK` — dia mendapat kembali persis yang dia deposit karena dia masuk setelah yield terjadi.

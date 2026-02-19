---
title: Verbosity
sidebar_label: Verbosity
---

# Menggunakan Verbosity

Foundry mendukung berbagai level verbosity menggunakan flag `-v`. Semakin banyak flag `v`, semakin detail output yang ditampilkan.

```bash
# Level 1: Hanya menampilkan test yang gagal
forge test

# Level 2: Menampilkan semua test yang dijalankan (pass dan fail)
forge test -v

# Level 3: Menampilkan logs (console.log dari kontrak)
forge test -vv

# Level 4: Menampilkan stack trace untuk test yang gagal
forge test -vvv

# Level 5: Menampilkan stack trace untuk semua test (pass dan fail)
forge test -vvvv
```

Untuk debugging, level `-vvv` biasanya sudah cukup untuk melihat di mana tepatnya transaksi gagal dan apa yang terjadi di setiap langkah.

Kamu juga bisa menjalankan test spesifik menggunakan flag `--match-test` atau `--match-contract`:

```bash
# Jalankan hanya test yang namanya mengandung "Deposit"
forge test --match-test "Deposit" -vvv

# Jalankan hanya test dari kontrak MyVaultTest
forge test --match-contract MyVaultTest -vvv
```

Jika ingin melihat penggunaan gas per fungsi:

```bash
forge test --gas-report
```

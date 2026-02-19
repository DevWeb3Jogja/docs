---
title: Ownership
sidebar_label: Ownership
---

# Ownership Contract

Kontrak `Ownable` juga menyediakan fungsi untuk manajemen kepemilikan:

- `owner()`: Mengembalikan alamat owner saat ini.
- `transferOwnership(address newOwner)`: Memindahkan kepemilikan ke alamat baru. Hanya bisa dipanggil oleh owner.
- `renounceOwnership()`: Owner melepaskan kepemilikannya secara permanen. Setelah ini dipanggil, tidak ada lagi yang menjadi owner, dan semua fungsi `onlyOwner` tidak bisa dieksekusi lagi.

Penting untuk berhati-hati dengan `renounceOwnership()`. Jika kontrakmu memiliki fungsi admin kritis yang menggunakan `onlyOwner`, memanggil `renounceOwnership` akan membuat fungsi-fungsi tersebut terkunci selamanya.

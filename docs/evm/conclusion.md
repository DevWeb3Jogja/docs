---
title: Kesimpulan
sidebar_label: Kesimpulan
---

# Kesimpulan

Di bagian ini, kamu sudah mempelajari fondasi penting untuk menulis smart contract pertama di ekosistem EVM:

**Tentang tooling**: Foundry memberikan development experience yang cepat dan efisien. Semua test ditulis dalam Solidity, dan cheatcode seperti `vm.prank`, `vm.expectRevert`, dan `makeAddr` membuat penulisan test lebih ekspresif dan mudah dibaca.

**Tentang standar token**: ERC20 adalah standar token fungible yang paling umum. OpenZeppelin menyediakan implementasi yang sudah di-audit dan siap pakai. Kamu tidak perlu menulis implementasi ERC20 dari nol untuk proyek yang serius.

**Tentang access control**: Ownable adalah mekanisme access control paling sederhana. Gunakan `onlyOwner` untuk fungsi-fungsi yang seharusnya hanya bisa diakses oleh pemilik kontrak.

**Tentang keamanan**: Reentrancy adalah vulnerability yang nyata dan berbahaya. Selalu ikuti pola Checks-Effects-Interactions dan pertimbangkan penggunaan `ReentrancyGuard` dari OpenZeppelin untuk fungsi yang melakukan external call.

**Tentang desain Vault**: Sistem shares adalah cara elegan untuk merepresentasikan kepemilikan proporsional. Pastikan rumus perhitungan shares sudah benar: perkalian sebelum pembagian, dan validasi bahwa shares yang dihasilkan tidak nol.

**Langkah selanjutnya yang bisa kamu eksplorasi:**
- Mengintegrasikan yield generation ke dalam Vault (konsep dasar ERC4626).
- Menulis fuzz test di Foundry menggunakan `function testFuzz_*`.
- Mempelajari proxy pattern untuk kontrak yang upgradeable.
- Memahami gas optimization lebih dalam: packing variables, `calldata` vs `memory`, dan penggunaan `immutable`.

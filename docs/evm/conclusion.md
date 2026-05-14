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

## Lanjut ke Mana?

Kontrak sudah jadi — sekarang waktunya membuatnya bisa dipakai orang dan terhubung ke aplikasi:

- **[Frontend →](../frontend/pengenalan.md)** — bangun UI dApp yang terhubung wallet (wagmi + viem + RainbowKit), membaca & menulis ke kontrak yang baru kamu buat.
- **[Developer Tools →](../developer-tools/index.md)** — `viem` untuk berinteraksi dengan kontrak dari script/backend, dan `Ponder` untuk meng-index event kontrak jadi API.
- **[Advanced Topics →](../advanced-topics/index.md)** — proxy pattern & kontrak upgradeable (UUPS), Uniswap V4 Hooks, x402 Protocol.

Ide eksplorasi lain di level kontrak: integrasi yield generation ke Vault (konsep dasar ERC4626), fuzz test di Foundry (`function testFuzz_*`), dan gas optimization (packing variables, `calldata` vs `memory`, `immutable`).

---

Terima kasih sudah belajar bersama **DevWeb3Jogja**! 🚀

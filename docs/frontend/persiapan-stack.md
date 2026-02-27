---
id: persiapan-stack
title: Tech Stack & Persiapan
sidebar_label: Tech Stack & Set Up
sidebar_position: 2
---

# Persiapan Alat & Library

Untuk terhubung secara mulus antara frontend dan blockchain, industri memiliki standar _Library_ (Pustaka Program) khusus.

Dulu, Ethers.js atau Web3.js sangat dominan. Namun, untuk aplikasi dengan React modern, terdapat kombinasi andalan yang dikembangkan oleh tim besar di ekosistem saat ini, yang fokus ke _type-safety_, ukuran ringan, dan performa mulus.

---

## Memahami Tech Stack Modern

Berikut stack yang akan kita pelajari dan gunakan di tutorial ini:

1. **Next.js**: Framework React paling populer untuk merancang antarmuka dApp berkinerja stabil.
2. **Wagmi**: Layaknya "React Router" tapi untuk Web3, terdiri dari himpunan Hooks (contoh: `useAccount`, `useReadContract`) yang khusus dibuat untuk React dan mendata interaksi EVM.
3. **Viem**: Engine utamanya. Library low-level super ringan untuk mengganti Ethers.js guna berkomunikasi dengan node Ethereum.
4. **RainbowKit**: Pustaka komponen yang dirancang elegan agar proses koneksi tombol "Connect Wallet" tampil modern, instan, dan ramah pengguna lintas perangkat.
5. **TanStack Query**: Manajemen _state data server_. Oleh karena blockchain adalah 'Data Server', TanStack Query digunakan otomatis oleh Wagmi di belakang layar untuk efek _loading_ dan _caching_.

---

## 1. Instalasi Packages

Masuk ke dalam terminal folder aplikasi Next.js milikmu:

```bash
npm install wagmi viem @tanstack/react-query @rainbow-me/rainbowkit
```

_-atau jika kamu menggunakan pnpm / yarn-_

```bash
pnpm add wagmi viem @tanstack/react-query @rainbow-me/rainbowkit
```

---

## 2. Mengatur Konfigurasi Provider (config.ts)

Seluruh dApp kita butuh mengetahui akan tersambung ke jaringan apa. Apakah Mainnet (Ethereum), L2 (Base, Optimism), atau Testnet (Sepolia).

Buatlah satu file dengan nama `config.ts` (misal di folder `src/`).

```typescript title="src/config.ts"
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Dev Web3 Jogja App",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Dapatkan gratis di cloud.walletconnect.com
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true, // Sangat penting agar tidak terjadi error hydration di Next.js App Router
});
```

> **INFO:** Sebuah `projectId` dari WalletConnect diwajibkan untuk menjamin modul QR Code berfungsi di perangkat seluler pengguna. Kamu bisa mendaftar gratis melalui platform WalletConnect Cloud.

Setelah beres menyiapkan konfigurasi, kita melangkah mendaftarkannya pada "Root" dari aplikasi!

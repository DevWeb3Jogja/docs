---
id: connect-wallet
title: Menghubungkan Wallet
sidebar_label: Connect Wallet
sidebar_position: 3
---

# Membungkus Aplikasi & Tombol Login

Pada langkah sebelumnya, kita mengimpor tumpukan dependensi dan mengatur jaringannya dalam file `config.ts`.
Sekarang kita aplikasikan konfigurasi tersebut agar meliputi seluruh UI.

---

## 1. Setup Provider di Layout

Di Next.js (bila memakai fitur app router), perbarui di dalam file `layout.tsx`. Jika menggunakan pages router, perbarui pada `_app.tsx`.

Intinya, kamu membungkus `children` dengan seluruh Provider ini:

```tsx title="app/layout.tsx"
"use client"; // Tambahkan ini agar aman jika menggunakan hooks di Provider

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config"; // pastikan path sesuai tempat filenya
import "../styles/globals.css";

// inisialisasi manajemen cache klien
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* WagmiProvider -> QueryClient -> RainbowKit -> Aplikasi Anda! */}
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
```

---

## 2. Pasang Tombol Connect Wallet

Hal terkeren menggunakan **RainbowKit** adalah kita tak perlu membangun modal tampilan manual untuk puluhan dompet (Metamask, Rabby, Trust Wallet, dsb). Semuanya tersedia dari 1 baris kode saja.

Masuklah ke komponen kamu—seperti Navbar atau Header, lalu impor:

```tsx title="components/Navbar.tsx"
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <h1 className="font-bold text-xl">My dApp</h1>

      {/* Keajaibannya ada disini ✨ */}
      <ConnectButton />
    </header>
  );
}
```

Cobalah perhatikan aplikasimu di browser. Sebuah tombol mewah untuk terhubung ke wallet telah selesai dibuat! Jika pengguna mengklik tombol tersebut, mereka akan bisa menghubungkan wallet ekstensi atau di seluler lewat WalletConnect. Tombol tersebut secara otomatis menangani alamat dan profil.

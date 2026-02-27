---
id: read-contract
title: Membaca Data Contract
sidebar_label: Reading Data
sidebar_position: 4
---

# Membaca Data dari Blockchain

Ketika dompet pengguna sudah terhubung (`connected`) atau bahkan ketika masih _Logged-out_, kamu dapat mengekstrak dan menampilkan nilai data dari blockchain.

Aktivitas ini **100% Gratis**, kamu atau pengguna **tidak perlu** membayar Gas Fee apapun hanya untuk membaca data, sama saja seperti mengirim `GET request` konvensional.

Untuk membaca data, kita butuh informasi `address` dan `ABI`.

---

## Persiapan ABI (The Contract Schema)

`ABI` (Application Binary Interface) adalah struktur JSON panjang yang menjembatani JavaScript dan Smart Contract. Ia berisi daftar function dan tipe datanya.

Misal, mengacu pada contoh pembuatan kontrak **MyVault.sol** di modul EVM, kita buat `abi.ts`:

```typescript title="src/abi.ts"
export const MyVaultABI = [
  {
    type: "function",
    name: "totalShares",
    inputs: [],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "shares",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const; // "as const" penting agar Type-Safety oleh Wagmi+TypeScript bisa berlaku!
```

---

## Menggunakan Hook `useReadContract`

Mari kita coba menampilkan **total shares** dari kontrak Vault yang telah kita buat. Wagmi menyiapkan Hook khusus yang bernama `useReadContract`.

```tsx title="components/VaultTotalShares.tsx"
"use client";
import { useReadContract } from "wagmi";
import { MyVaultABI } from "../abi";
import { formatUnits } from "viem";

export function VaultTotalShares() {
  const vaultAddress = "0x123abc..."; // Alamat MyVault yang sudah di-deploy

  const { data, isLoading, isError, error } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: MyVaultABI,
    functionName: "totalShares",
  });

  if (isLoading) return <div>Memuat data vault...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  // Nilai token dalam EVM memiliki "18 decimals". formatUnits dipakai mengubah dari wei ke satuan normal.
  const formattedShares = data ? formatUnits(data, 18) : "0";

  return (
    <div className="p-4 border rounded">
      <h2>Volume Shares Beredar: {formattedShares} SHARES</h2>
    </div>
  );
}
```

---

## Trik Membaca Data Dinamis (ex: argumen)

Jika fungsinya mengharuskan sebuah parameter—misalnya fungsi `shares(address)` di dalam kontrak `MyVault` untuk mengetahui porsi seorang pengguna, gunakan _array_ di dalam struktur `args`:

```tsx title="components/UserShares.tsx"
"use client";
import { useAccount, useReadContract } from "wagmi";
import { MyVaultABI } from "../abi";

export function UserShares() {
  const { address } = useAccount(); // Dapat alamat wallet user aktif

  const { data } = useReadContract({
    address: "0x...", // Alamat MyVault
    abi: MyVaultABI,
    functionName: "shares",
    args: [address!], // Memasukkan parameter user address!
    query: {
      enabled: !!address, // Hanya akan dijalankan jika 'address' ada
    },
  });

  return <p>Porsi (Shares) kamu: {data?.toString()}</p>;
}
```

Selanjutnya, kita akan masuk ke tahap yang paling menantang: Memanipulasi state lewat _Transacting_ / Menulis data ke Contract!

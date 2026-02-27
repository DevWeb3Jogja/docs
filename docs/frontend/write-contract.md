---
id: write-contract
title: Mengirim Transaksi
sidebar_label: Writing Data
sidebar_position: 5
---

# Menulis Data ke Blockchain

Berbeda dengan membaca (yang gratis), aksi menulis data ke blockchain (seperti _Minting_, _Transfer_, _Approve_, atau _Swap_) disebut **Mutasi**.

Untuk setiap mutasi, dua hal wajib terjadi:

1. **Membutuhkan Signature** dari pemegang akun asli yang menggunakan wallet-nya.
2. **Membutuhkan Gas Fee** sebagai honor bagi _validators_ di jaringan untuk memproses mutasi tersebut menjadi blok.

---

## Menggunakan Hook `useWriteContract` (Dengan Simulasi)

Praktik terbaik sebelum mengirim transaksi di jaringan adalah melakukan simulasi terlebih dahulu. Jika parameter tidak valid, simulasi akan lebih dulu mendeteksi dan mencegah _Wallet_ muncul, sehingga menghemat _Gas Fee_.

Sebagai acuan pada materi EVM, kita akan membuat fungsi `deposit` untuk menyetorkan token ke `MyVault.sol`.

```tsx title="components/DepositVault.tsx"
"use client";

import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { MyVaultABI } from "../abi";
import { parseUnits } from "viem";

export function DepositVault() {
  const vaultAddress = "0x123abc..."; // Alamat MyVault yang sudah di-deploy
  const amountToDeposit = parseUnits("10", 18); // Setor 10 Token (18 desimal)

  // 1. Simulasi Transaksi (Hook ini akan mengecek apakah argumen deposit valid)
  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: vaultAddress as `0x${string}`,
    abi: MyVaultABI,
    functionName: "deposit",
    args: [amountToDeposit],
  });

  // 2. Transaksi Mutasi
  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
  } = useWriteContract();

  // 3. Menunggu Konfirmasi Jaringan
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleDeposit = () => {
    // Jalankan writeContract hanya jika hasil simulasi request telah tersedia
    if (simulateData?.request) {
      writeContract(simulateData.request);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md mt-4">
      <h2 className="text-xl mb-4">Setor Token ke Vault</h2>

      <button
        onClick={handleDeposit}
        // Tombol mati bila sedang diproses, atau apabila ada error dari simulasi
        disabled={isPending || isConfirming || !!simulateError}
        className="bg-blue-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
      >
        {isPending
          ? "Mempersiapkan Wallet..."
          : isConfirming
          ? "Menunggu Konfirmasi Jaringan..."
          : "Deposit 10 Token!"}
      </button>

      {/* Tampilkan visual error simulasi atau penulisan */}
      {(simulateError || writeError) && (
        <p className="text-red-500 mt-2 text-sm">
          Error: {(simulateError || writeError)?.message}
        </p>
      )}

      {hash && <p className="mt-2 text-yellow-600">Terkirim! Hash: {hash}</p>}

      {isConfirmed && (
        <p className="mt-2 text-green-600 font-bold">
          Deposit Berhasil Dikonfirmasi!
        </p>
      )}
    </div>
  );
}
```

---

## Mengapa Perlu Simulasi dan TransactionReceipt?

1. **`useSimulateContract`**: Saat pengguna mengklik tombol, transaksi belum secara nyata dikirim, tapi dicoba dulu (Dry-run) oleh node. Adanya instruksi ini sangat membantu pengembang untuk menampilkan detail error persis ("Mengapa deposit gagal? Oh, The token allowance is not enough") bahkan sebelum pengguna mendapati _Wallet pop-up_.
2. **`useWaitForTransactionReceipt`**: Saat fungsi `writeContract` dieksekusi dan diizinkan oleh pengguna lewat Wallet-nya, transaksi tersebut belum masuk ke _Blockchain_. Transaksi masih berupa _Transaction Hash_ (mengambang di Mempool). Oleh karena itu kita wajib melacak status resminya hingga tervalidasi ke dalam rantai blok menggunakan `useWaitForTransactionReceipt`. Hook akan otomatis bereaksi mengubah nilai `isConfirming` menjadi false, dan `isSuccess` menjadi true apabila transaksi telah 100% suskes dicatat jaringan!

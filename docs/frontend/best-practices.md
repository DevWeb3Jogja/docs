---
id: best-practices
title: Web3 UI/UX Best Practices
sidebar_label: Best Practices
sidebar_position: 6
---

# Web3 UI/UX Best Practices (Penting!)

Membangun dApp yang menawan tidak cuma berhenti di kode yang berhasil dieksekusi. Di ranah Web3, ketidaknyamanan teknis sangat rentan membuat pengguna umum panik—apalagi karena segala hal menyangkut uang asli.

Pastikan _Frontend_ yang kamu rancang senantiasa menaati standar industri UX berikut ini!

---

## 1. Selalu Tangani _Loading States_ Secara Transparan

Ingat bahwa Web3 itu lambat jika dibandingkan spesifikasi Web2. Memanggil sebuah API Server bisa kurang dari 100ms, sementara memvalidasi balok di blockchain memakan waktu beberapa detik (bahkah menit jika jaringan padat!).

Jangan pernah biarkan pengguna menebak apa yang sedang terjadi.
Gunakan _loading spinner_, pemblokiran UI, atau kerangka _skeleton loading_ setiap saat `isPending` dan `isConfirming` bernilai `true`.

```tsx
<button disabled={isPending || isConfirming}>
  {isPending
    ? "Silahkan Setujui di Wallet..."
    : isConfirming
    ? "Menunggu Validasi..."
    : "Kirim Transaksi"}
</button>
```

---

## 2. Pesan Error yang Ramah Manusia

Jangan lempar pesan error mentah dari mesin RPC seperti `insufficient funds for gas * price + value`! Hal ini membingungkan bagi pemula Web3.

Tangkap seluruh error dan ubah menjadi intruksi yang dapat ditindaklanjuti pengguna:

> ❌ **Buruk:**  
> `Reverted with error: User Denied Transaction Signature.`

> ✅ **Baik:**  
> _"Kamu membatalkan interaksi di halaman Wallet. Silakan klik kembali tombol jika ingin mengulang transaksi."_

---

## 3. Peringatan Salah Jaringan (Wrong Network)

Apabila Smart Contract dApp milikmu hanya rilis di jaringan **Base**, namun pengguna tersebut ternyata sedang terkoneksi menggunakan jaringan **Ethereum Mainnet**, transaksi akan selalu gagal atau terbaca _null_.

Bantu mereka bermigrasi secara otomatis dengan memunculkan tombol pindah:

```tsx
import { useAccount, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";

export function NetworkAlert() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  if (chain?.id !== base.id) {
    return (
      <div className="bg-red-500 text-white p-2 text-center text-sm">
        Dompetmu berada di jaringan yang salah.{" "}
        <button
          className="underline font-bold"
          onClick={() => switchChain({ chainId: base.id })}
        >
          Beralih ke Base
        </button>
      </div>
    );
  }

  return null;
}
```

---

## 4. Antisipasi Disconnect

Jangan paksa UI menampilkan profil dan data wallet ketika status aslinya sedang dalam masa tunggu, _idle_, atau malah sedang memutus sambungan.

Manfaatkan status dari hook `useAccount` untuk melabeli kondisi yang semestinya ditangani:

```tsx
const { isConnecting, isDisconnected } = useAccount();

if (isConnecting)
  return <div>Memuat ulang profil dompet dari sesi sebelumnya...</div>;
if (isDisconnected)
  return <div>Selamat datang! Hubungkan dompet untuk memulai.</div>;
```

---

## Kesimpulan

Membangun _Frontend Web3_ yang handal adalah soal mengelola **status koneksi jaringan**, menangkap setiap eror secara halus, serta memberikan **umpan balik visual** sejelas-jelasnya bagi pemakai awal. Dengan menggunakan Wagmi, Viem, dan RainbowKit, kita bisa mendemonstrasikan dApp dengan sentuhan profesional tanpa perlu menderita membuat implementasi `Web3.js` manual dari dasarnya.

**Langkah Selanjutnya:**

- Pelajari cara integrasi penyimpanan **IPFS** seperti Pinata, mengingat biayanya jauh lebih efisien untuk menyimpan ukuran Data (seperti Gambar dan Metadata NFT) dibandingkan mengupload-nya "On-Chain".
- Kuasai pemakaian **The Graph / Subsquid** saat membutuhkan indeksasi puluhan ratusan event transaksi dari Contract.

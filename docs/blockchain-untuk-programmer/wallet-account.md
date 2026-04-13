---
title: Wallet & Account
sidebar_label: Wallet & Account
---

# Wallet & Account

Di Web2, identitasmu di sebuah platform adalah username dan password. Platform yang menyimpan datamu, platform yang memverifikasi identitasmu, dan platform yang bisa me-reset akses kalau kamu lupa password.

Di blockchain, semua itu digantikan oleh **kriptografi**. Tidak ada server yang menyimpan identitasmu. Tidak ada "forgot password". Dan tidak ada platform yang bisa memblokir akses ke akunmu.

## Dua Jenis Account di Ethereum

### EOA (Externally Owned Account)

Ini adalah akun yang dimiliki dan dikendalikan oleh manusia — atau lebih tepatnya, oleh siapapun yang memegang **private key**-nya.

Karakteristik EOA:
- Dikontrol oleh private key
- Bisa menginisiasi transaksi
- Tidak punya kode program di dalamnya
- Contoh: akun MetaMask kamu

### Contract Account

Ini adalah akun yang dimiliki oleh **smart contract** — kode program yang di-deploy ke blockchain.

Karakteristik Contract Account:
- Tidak dikontrol oleh private key
- Tidak bisa menginisiasi transaksi sendiri (hanya bisa bereaksi ketika dipanggil)
- Punya kode program yang menentukan perilakunya
- Contoh: kontrak token ERC20, kontrak DEX

**Analogi programmer:** EOA itu seperti user dengan credentials. Contract Account itu seperti service account yang dikontrol oleh kode, bukan manusia.

## Public Key & Private Key

Setiap EOA di Ethereum dibuat dari sepasang kunci kriptografi:

### Private Key

String 64 karakter hexadecimal yang dibuat secara acak. Ini adalah **satu-satunya bukti kepemilikan** akunmu.

```
Contoh (JANGAN PERNAH PAKAI INI):
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Penting sekali:**
- Tidak ada "forgot private key"
- Siapapun yang punya private key-mu, punya kontrol penuh atas semua aset di akunmu
- Jika hilang, akses ke akunmu hilang **selamanya**
- Jika bocor ke orang lain, semua asetmu bisa dicuri

**Analogi programmer:** Private key itu seperti password root server production — tapi lebih ekstrem. Kalau password root bocor, kamu masih bisa revoke dan ganti. Private key tidak bisa di-revoke. Pernah ada satu kali, berlaku selamanya sampai seluruh aset berpindah.

### Public Key & Address

Dari private key, secara matematis bisa diturunkan **public key**, dan dari public key diturunkan lagi **address** (20 byte / 40 karakter hex).

```
Address contoh:
0x742d35Cc6634C0532925a3b8D4C9B3E2b30E9d12
```

Address ini adalah **identitas publikmu** di blockchain. Seperti nomor rekening bank — kamu bisa membagikannya ke siapapun agar mereka bisa mengirim aset kepadamu.

**Proses derivasi (satu arah):**
```
Private Key → Public Key → Address
(tidak bisa dibalik: Address ≠→ Public Key ≠→ Private Key)
```

**Analogi programmer:** Address itu seperti username yang di-generate otomatis dari password-mu menggunakan one-way hash. Kamu tidak bisa memilih address-mu, dan dari address-mu tidak bisa ditebak private key-mu.

## Seed Phrase (Mnemonic)

Karena private key adalah string panjang yang susah diingat, ada standar yang memungkinkan satu **seed phrase** (12 atau 24 kata bahasa Inggris biasa) untuk menurunkan banyak private key.

```
Contoh seed phrase (JANGAN PERNAH PAKAI INI):
abandon abandon abandon abandon abandon abandon 
abandon abandon abandon abandon abandon about
```

Seed phrase = master key. Siapapun yang punya seed phrase-mu bisa mengakses **semua** akun yang diturunkan darinya.

> **Aturan emas:** JANGAN PERNAH share private key atau seed phrase ke siapapun, dalam kondisi apapun. Tidak ada aplikasi legitimate yang perlu memintanya.

## Wallet: Aplikasi untuk Mengelola Key

**Wallet** (seperti MetaMask) bukan tempat menyimpan "koin" — koin selalu ada di blockchain. Wallet adalah **aplikasi yang menyimpan private key-mu** dan memudahkan kamu untuk menandatangani transaksi.

Fungsi wallet:
- Menyimpan private key secara terenkripsi di device-mu
- Menampilkan saldo dan history transaksi
- Memudahkan signing transaksi (kamu approve, wallet yang tanda tangan)
- Interface untuk berinteraksi dengan dApp

**Analogi programmer:** Wallet itu seperti password manager (1Password, Bitwarden) — dia tidak menyimpan "uangmu", dia menyimpan kunci yang memberimu akses ke uangmu di blockchain.

## Setup MetaMask untuk Development

Untuk mengikuti kursus ini, kamu perlu MetaMask:

1. **Install MetaMask** dari [metamask.io](https://metamask.io) (ekstensi browser Chrome/Firefox/Brave)
2. **Buat akun baru** → ikuti wizard setup
3. **Simpan seed phrase** di tempat aman (untuk development, bisa di notes — tapi JANGAN untuk akun yang menyimpan uang sungguhan)
4. **Tambahkan Sepolia Testnet:**
   - Buka MetaMask → klik nama network di atas (biasanya "Ethereum Mainnet")
   - Aktifkan "Show test networks"
   - Pilih "Sepolia"

Setelah setup, kamu akan punya address Ethereum pertamamu — ini yang akan kita gunakan sepanjang kursus.

---

Di halaman berikutnya, kita akan membahas bagaimana transaksi bekerja dan apa itu "gas" yang selalu disebut dalam konteks blockchain.

Lanjut ke [Transaksi & Gas →](/blockchain-untuk-programmer/transaksi-gas)

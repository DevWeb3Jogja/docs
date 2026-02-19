---
title: Kesalahan Umum
sidebar_label: Kesalahan Umum
---

# Kesalahan Umum

## 1. Tidak Mengimplementasikan Fungsi Abstract dari ERC20

**Error**: `TypeError: Contract "MyToken" should be marked as abstract`

Ini terjadi ketika kamu mendeklarasikan kontrak yang inherit dari `ERC20` tapi tidak menyertakan argumen yang dibutuhkan oleh constructor parent.

**Penyebab umum:**

```solidity
// SALAH: Constructor parent ERC20 tidak dipanggil
contract MyToken is ERC20 {
    constructor() {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}
```

**Perbaikan:**

```solidity
// BENAR: Constructor parent dipanggil dengan argumen yang tepat
contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}
```

Jika kamu menggunakan OpenZeppelin v5 dengan Ownable, pastikan `initialOwner` juga disertakan:

```solidity
contract MyToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("MyToken", "MTK")
        Ownable(initialOwner)
    {
        _mint(initialOwner, 1_000_000 * 10 ** decimals());
    }
}
```

## 2. Kesalahan Perhitungan Shares

**Masalah**: Pengguna mendapatkan 0 shares atau jumlah shares yang tidak proporsional.

**Penyebab 1: Integer division truncation**

Solidity menggunakan integer division, artinya hasil pembagian selalu dibulatkan ke bawah. Jika pembilang lebih kecil dari penyebut, hasilnya adalah 0.

```solidity
// Jika amount sangat kecil relatif terhadap totalShares/totalTokenBalance,
// hasil bisa menjadi 0 dan menyebabkan ZeroSharesMinted
sharesToMint = (amount * totalShares) / totalTokenBalance;
```

**Solusi**: Selalu validasi `sharesToMint != 0` setelah perhitungan dan gunakan `revert ZeroSharesMinted()`.

**Penyebab 2: Urutan operasi yang salah**

```solidity
// SALAH: Pembagian sebelum perkalian, kehilangan presisi
sharesToMint = (amount / totalTokenBalance) * totalShares;

// BENAR: Perkalian sebelum pembagian
sharesToMint = (amount * totalShares) / totalTokenBalance;
```

Selalu lakukan perkalian lebih dulu sebelum pembagian untuk memaksimalkan presisi.

## 3. Lupa Memanggil approve Sebelum deposit

**Error**: `ERC20InsufficientAllowance` atau transaksi revert tanpa pesan yang jelas di sisi pengguna.

**Penyebab**: Vault menggunakan `token.transferFrom(msg.sender, address(this), amount)`, yang membutuhkan allowance terlebih dahulu. Jika pengguna langsung memanggil `deposit()` tanpa approve dulu, transaksi akan selalu gagal.

**Urutan yang benar:**

```solidity
// 1. Pengguna harus approve dulu (bisa dilakukan di transaksi terpisah)
token.approve(address(vault), amount);

// 2. Baru bisa deposit
vault.deposit(amount);
```

Dalam konteks test Foundry, kesalahan ini sering menyebabkan test gagal dengan error yang membingungkan. Pastikan `setUp()` atau setiap test case menyertakan langkah approve sebelum deposit.

## 4. Menggunakan tx.origin Sebagai Pengganti msg.sender

**Masalah**: Developer kadang menggunakan `tx.origin` untuk mendapatkan alamat pengguna, padahal ini berbahaya.

**Perbedaan**:
- `msg.sender`: Alamat yang langsung memanggil fungsi kontrak saat ini. Bisa berupa EOA atau kontrak.
- `tx.origin`: Alamat EOA yang memulai seluruh rantai transaksi. Selalu berupa EOA, tidak pernah kontrak.

**Kenapa berbahaya**: Jika digunakan untuk autentikasi, kontrak jahat bisa mengeksploitasinya. Bayangkan skenario ini:

1. `ContractA` menggunakan `tx.origin == owner` sebagai validasi admin.
2. Pengguna (owner) secara tidak sengaja berinteraksi dengan `MaliciousContract`.
3. `MaliciousContract` memanggil fungsi admin di `ContractA`.
4. Di `ContractA`, `tx.origin` masih menunjuk ke owner (EOA asli), sehingga validasi lolos.
5. `MaliciousContract` berhasil mengeksekusi aksi admin tanpa sepengetahuan owner.

**Solusi**: Selalu gunakan `msg.sender` untuk validasi identitas pemanggil. Gunakan `onlyOwner` dari OpenZeppelin.

```solidity
// SALAH
require(tx.origin == owner, "Not owner");

// BENAR
require(msg.sender == owner(), "Not owner");
// Atau lebih baik, gunakan modifier onlyOwner dari Ownable
```

## 5. Tidak Menghandle Return Value dari token.transfer()

**Masalah**: Fungsi `transfer()` dan `transferFrom()` pada ERC20 mengembalikan nilai `bool`. Beberapa implementasi ERC20 yang tidak standar tidak akan revert jika transfer gagal, melainkan hanya mengembalikan `false`.

```solidity
// Berbahaya: return value diabaikan
token.transfer(msg.sender, amount);

// Lebih aman: cek return value
bool success = token.transfer(msg.sender, amount);
require(success, "Token transfer failed");
```

Namun, pendekatan yang paling direkomendasikan adalah menggunakan `SafeERC20` dari OpenZeppelin yang menangani token non-standar secara otomatis:

```solidity
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyVault {
    using SafeERC20 for IERC20;

    // Sekarang bisa gunakan safeTransfer dan safeTransferFrom
    token.safeTransfer(msg.sender, amount);
    token.safeTransferFrom(msg.sender, address(this), amount);
}
```

`SafeERC20` membungkus fungsi transfer dan secara otomatis merevert jika transfer gagal, bahkan untuk token yang tidak mengikuti standar ERC20 secara ketat.

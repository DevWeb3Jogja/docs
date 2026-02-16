---
title: Viem - TypeScript Ethereum Library
sidebar_label: Viem
sidebar_position: 2
---

# Viem

## 1.1 Pendahuluan

### 1.1.1 Apa itu Viem?

Viem adalah library TypeScript untuk berinteraksi dengan Ethereum dan blockchain yang kompatibel dengan EVM. Library ini menyediakan interface modern dan type-safe untuk operasi blockchain umum seperti membaca data, mengirim transaksi, dan berinteraksi dengan smart contract.

Bayangkan Viem sebagai jembatan antara aplikasi TypeScript/JavaScript kamu dengan blockchain. Daripada membuat panggilan JSON-RPC secara langsung, Viem memberikan fungsi-fungsi yang bersih dan well-typed untuk:

- Membaca data blockchain (saldo, info block, state contract)
- Mengirim transaksi (transfer ETH, memanggil fungsi contract)
- Menandatangani pesan dan typed data
- Mendengarkan event dan log

### 1.1.2 Kenapa Viem?

**Keunggulan Viem:**

- **Type Safety**: Dukungan TypeScript penuh dengan autocompletion dan pengecekan error saat compile
- **Tree-shakable**: Hanya bundle apa yang kamu pakai, menghasilkan build yang lebih kecil
- **API Modern**: Menggunakan native BigInt, bukan class BigNumber custom
- **Performa**: Dioptimasi untuk kecepatan dengan overhead minimal
- **Modular**: Client terpisah untuk use case berbeda (public, wallet, test)

**Perbandingan dengan alternatif lain:**

| Fitur | Viem | ethers.js | web3.js |
|-------|------|-----------|---------|
| TypeScript | First-class | Baik | Membaik |
| Ukuran bundle | Kecil (tree-shakable) | Sedang | Besar |
| Dukungan BigInt | Native | Class custom | Class custom |
| Kurva belajar | Sedang | Mudah | Mudah |

Viem adalah pilihan yang direkomendasikan untuk proyek baru, terutama yang membutuhkan type safety kuat dan tooling modern.

### 1.1.3 Tujuan

Di akhir panduan ini, kamu akan mampu:

- Menyiapkan proyek Viem dengan TypeScript
- Membaca saldo ETH dari blockchain
- Mengirim transaksi ETH
- Memahami apa itu ABI dan kenapa diperlukan
- Membaca data dari smart contract
- Menulis ke smart contract (mint token, transfer token)

---

## 1.2 Setup

### 1.2.1 Instalasi

**Prasyarat:**
- Node.js 18+
- npm atau yarn
- Code editor (VS Code direkomendasikan untuk dukungan TypeScript)

**Buat proyek baru:**

```bash
git clone git@github.com:DevWeb3Jogja/template-ts.git workshop-viem
cd workshop-viem
npm install
```

**Verifikasi setup:**

```bash
npx ts-node src/test-001-hello-world.ts
```

**Install Viem:**

```bash
npm install viem
```

### 1.2.2 Konfigurasi Environment

Buat file `.env` di root proyek untuk menyimpan data sensitif seperti private key:

`.env`

```bash
MY_PRIVATE_KEY=<YOUR_PRIVATE_KEY>
```

Buat file config untuk memuat environment variable:

`src/config.ts`

```typescript
import dotenv from 'dotenv';

dotenv.config();

const MY_PRIVATE_KEY = process.env.MY_PRIVATE_KEY;

if (!MY_PRIVATE_KEY) {
  throw new Error('MY_PRIVATE_KEY is required');
}

export { MY_PRIVATE_KEY };
```

> **Catatan Keamanan**: Jangan pernah commit file `.env` ke version control. Tambahkan ke `.gitignore`.

---

## 1.3 Konsep Dasar

### 1.3.1 Client (Public vs Wallet)

Viem menggunakan tipe client berbeda untuk operasi yang berbeda:

**Public Client** - Untuk operasi read-only:
- Membaca saldo
- Mengambil data block
- Memanggil view function di contract
- Tidak butuh private key

```typescript
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
```

**Wallet Client** - Untuk operasi write:
- Mengirim transaksi
- Menandatangani pesan
- Memanggil state-changing function di contract
- Membutuhkan private key

```typescript
import { createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount('<YOUR_PRIVATE_KEY>');
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});
```

### 1.3.2 Chain

Viem memiliki dukungan built-in untuk banyak chain EVM. Kamu import dari `viem/chains`:

```typescript
import { mainnet, sepolia, baseSepolia, arbitrum, polygon } from 'viem/chains';
```

Setiap objek chain berisi:
- Chain ID
- Nama
- Info native currency
- URL RPC
- URL block explorer

> **Catatan**: Panduan ini menggunakan testnet Base Sepolia. Kamu bisa mengganti dengan chain EVM-compatible lainnya dengan mengimport chain yang berbeda dan memperbarui kode.

### 1.3.3 Transport

Transport mendefinisikan bagaimana Viem berkomunikasi dengan blockchain. Yang paling umum adalah HTTP:

```typescript
import { http } from 'viem';

// RPC publik default
const transport = http();

// URL RPC custom
const customTransport = http('https://your-rpc-url.com');
```

Opsi transport lainnya termasuk WebSocket untuk subscription real-time.

---

## 1.4 Native Action

### 1.4.1 Membaca Saldo

Untuk membaca saldo ETH, gunakan fungsi `getBalance` di public client:

`src/test-002-balance-eth.ts`

```typescript
import { baseSepolia } from 'viem/chains';
import { createPublicClient, formatUnits, http } from 'viem';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

async function main() {
  // Dapatkan saldo ETH (mengembalikan nilai dalam wei)
  const ethBalance = await publicClient.getBalance({
    address: '<YOUR_WALLET_ADDRESS>',
  });
  console.log('Saldo ETH (wei):', ethBalance);

  // Format dari wei ke ETH (18 desimal)
  const ethBalanceFmt = formatUnits(ethBalance, 18);
  console.log('Saldo ETH (ETH):', ethBalanceFmt);
}

main();
```

**Konsep penting:**
- Saldo dikembalikan dalam **wei** (unit terkecil, seperti sen terhadap rupiah)
- 1 ETH = 10^18 wei
- `formatUnits(value, decimals)` mengkonversi dari wei ke format yang mudah dibaca

### 1.4.2 Mengirim ETH

Untuk mengirim ETH, kamu butuh wallet client dengan private key:

`src/test-003-send-eth.ts`

```typescript
import { baseSepolia } from 'viem/chains';
import { createWalletClient, http, parseUnits } from 'viem';
import { Address, privateKeyToAccount } from 'viem/accounts';
import { MY_PRIVATE_KEY } from './config';

const walletAccount = privateKeyToAccount(MY_PRIVATE_KEY as Address);
const walletClient = createWalletClient({
  account: walletAccount,
  chain: baseSepolia,
  transport: http(),
});

async function main() {
  // Kirim 0.001 ETH
  const hash = await walletClient.sendTransaction({
    account: walletAccount,
    to: '<RECEIVER_ADDRESS>',
    value: parseUnits('0.001', 18), // 0.001 ETH dalam wei
  });

  console.log('Transaction Hash:', hash);
}

main();
```

**Konsep penting:**
- `parseUnits(value, decimals)` mengkonversi nilai yang mudah dibaca ke wei
- Fungsi mengembalikan transaction hash yang bisa kamu cek di block explorer
- Transaksi akan gagal jika kamu tidak punya ETH cukup untuk value + gas fee

---

## 1.5 Interaksi dengan Contract

### 1.5.1 Apa itu ABI?

**ABI (Application Binary Interface)** adalah spesifikasi JSON yang menjelaskan cara berinteraksi dengan smart contract. ABI memberi tahu aplikasimu:

- Fungsi apa saja yang ada di contract
- Parameter apa yang dibutuhkan setiap fungsi
- Tipe data apa yang digunakan
- Event apa yang di-emit oleh contract

Tanpa ABI, kamu tidak bisa memanggil fungsi contract karena kamu tidak tahu:
- Signature fungsi
- Cara encode parameter
- Cara decode return value

**Di mana mendapatkan ABI:**
1. Dari source code contract di block explorer (jika sudah verified)
2. Dari dokumentasi proyek atau GitHub
3. Generate dari source code Solidity

**Contoh**: Mendapatkan ABI dari BaseScan

1. Buka halaman contract: https://sepolia.basescan.org/address/0x726da6f345ddd8d081f690f02cb9f636929ffa1e
2. Klik tab "Contract"
3. Klik "ABI" dan copy JSON-nya

Buat file ABI:

`src/abi.ts`

```typescript
export const mockTokenABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
```

> **Catatan**: Assertion `as const` mengaktifkan type inference Viem untuk autocompletion yang lebih baik.

### 1.5.2 Membaca Contract (view function)

View function adalah read-only dan tidak memerlukan gas. Gunakan `readContract` di public client:

`src/test-004-read-contract.ts`

```typescript
import { baseSepolia } from 'viem/chains';
import { createPublicClient, formatUnits, http } from 'viem';
import { mockTokenABI } from './abi';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

async function main() {
  const tokenAddress = '0x726da6f345ddd8d081f690f02cb9f636929ffa1e';

  // Baca nama token
  const tokenName = await publicClient.readContract({
    address: tokenAddress,
    abi: mockTokenABI,
    functionName: 'name',
  });

  // Baca simbol token
  const tokenSymbol = await publicClient.readContract({
    address: tokenAddress,
    abi: mockTokenABI,
    functionName: 'symbol',
  });

  console.log('Nama Token:', tokenName);
  console.log('Simbol Token:', tokenSymbol);

  // Baca saldo token untuk sebuah address
  const tokenBalance = await publicClient.readContract({
    address: tokenAddress,
    abi: mockTokenABI,
    functionName: 'balanceOf',
    args: ['<YOUR_WALLET_ADDRESS>'],
  });

  const tokenBalanceFmt = formatUnits(tokenBalance, 18);

  console.log('Saldo Token (raw):', tokenBalance);
  console.log('Saldo Token (formatted):', tokenBalanceFmt);
}

main();
```

**Konsep penting:**
- `readContract` membutuhkan: address, ABI, dan nama fungsi
- Untuk fungsi dengan parameter, pass di array `args`
- Viem menyediakan type checking untuk nama fungsi dan argumen

### 1.5.3 Menulis ke Contract (state-changing function)

State-changing function mengubah data blockchain dan membutuhkan:
- Wallet client dengan private key
- ETH untuk gas fee

#### a. Mint Token

`src/test-005-mint-token.ts`

```typescript
import { baseSepolia } from 'viem/chains';
import { createWalletClient, http, parseUnits } from 'viem';
import { mockTokenABI } from './abi';
import { Address, privateKeyToAccount } from 'viem/accounts';
import { MY_PRIVATE_KEY } from './config';

const walletAccount = privateKeyToAccount(MY_PRIVATE_KEY as Address);
const walletClient = createWalletClient({
  account: walletAccount,
  chain: baseSepolia,
  transport: http(),
});

async function main() {
  const txHash = await walletClient.writeContract({
    address: '<TOKEN_ADDRESS>',
    abi: mockTokenABI,
    functionName: 'mint',
    args: [
      '<YOUR_WALLET_ADDRESS>',
      parseUnits('1000', 18), // Mint 1000 token
    ],
  });

  console.log('Transaction Hash:', txHash);
}

main();
```

#### b. Transfer Token

`src/test-006-transfer-token.ts`

```typescript
import { baseSepolia } from 'viem/chains';
import { createWalletClient, http, parseUnits } from 'viem';
import { mockTokenABI } from './abi';
import { Address, privateKeyToAccount } from 'viem/accounts';
import { MY_PRIVATE_KEY } from './config';

const walletAccount = privateKeyToAccount(MY_PRIVATE_KEY as Address);
const walletClient = createWalletClient({
  account: walletAccount,
  chain: baseSepolia,
  transport: http(),
});

async function main() {
  const txHash = await walletClient.writeContract({
    address: '<TOKEN_ADDRESS>',
    abi: mockTokenABI,
    functionName: 'transfer',
    args: [
      '<RECEIVER_ADDRESS>',
      parseUnits('100', 18), // Transfer 100 token
    ],
  });

  console.log('Transaction Hash:', txHash);
}

main();
```

**Konsep penting:**
- `writeContract` mengembalikan transaction hash langsung (tidak menunggu konfirmasi)
- Gunakan hash untuk mengecek status transaksi di block explorer
- Jika perlu menunggu konfirmasi, gunakan `waitForTransactionReceipt`

---

## 1.6 Kesimpulan

Di panduan ini, kamu belajar:

1. **Apa itu Viem** - Library TypeScript modern untuk interaksi blockchain
2. **Kenapa Viem** - Type safety, tree-shaking, dukungan native BigInt
3. **Konsep dasar** - Public vs Wallet client, chain, transport
4. **Native action** - Membaca saldo, mengirim ETH
5. **Interaksi contract** - Apa itu ABI, membaca contract, menulis ke contract

**Skill yang didapat:**
- Menyiapkan proyek Viem
- Membaca data on-chain tanpa wallet
- Mengirim transaksi dengan wallet
- Berinteraksi dengan contract token ERC20

**Langkah selanjutnya:**
- Eksplorasi kemampuan event listening Viem
- Pelajari multicall untuk batching request
- Cek [dokumentasi Viem](https://viem.sh) untuk fitur lanjutan

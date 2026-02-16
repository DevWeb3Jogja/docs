---
title: Ponder - Blockchain Indexing
sidebar_label: Ponder
sidebar_position: 1
---

# Ponder

## Pendahuluan

### Apa itu Ponder?

Ponder adalah framework indexing blockchain yang memudahkan pembuatan backend API untuk dApp. Ponder mendengarkan event smart contract, memprosesnya, menyimpan data ke database, dan otomatis men-generate GraphQL API.

Bayangkan Ponder sebagai database khusus yang selalu sinkron dengan data blockchain. Daripada query blockchain secara langsung (yang lambat dan terbatas), kamu query data yang sudah di-index oleh Ponder (yang cepat dan fleksibel).

### Masalahnya: Kenapa Butuh Indexing?

**Tantangan dengan data blockchain:**

Blockchain dioptimasi untuk menulis data (transaksi), bukan membacanya. Ketika kamu perlu:
- Mendapatkan semua transfer untuk address tertentu
- Menghitung total volume sepanjang waktu
- Menampilkan riwayat transaksi dengan filter dan pagination

...query blockchain secara langsung itu:
- **Lambat** - Kamu perlu scan ribuan block
- **Mahal** - Setiap panggilan RPC membutuhkan resource
- **Terbatas** - Tidak ada query kompleks, join, atau agregasi

**Solusinya: Indexing**

Indexer seperti Ponder:
1. Mendengarkan event blockchain secara real-time
2. Memproses dan mentransformasi data
3. Menyimpannya di database yang bisa di-query
4. Menyediakan API cepat untuk frontend

```
Event Blockchain → Ponder Indexer → Database → GraphQL API → Aplikasi Kamu
```

### Tujuan

Di akhir panduan ini, kamu akan mampu:

- Memahami kenapa indexing blockchain diperlukan
- Menyiapkan proyek Ponder dari awal
- Mengkonfigurasi Ponder untuk mendengarkan contract tertentu
- Mendefinisikan schema database untuk data yang di-index
- Menulis event handler untuk memproses event blockchain
- Query data yang sudah di-index menggunakan GraphQL
- Mengimplementasikan pattern lanjutan seperti agregasi dan relasi

---

## Setup

### Instalasi

Buat proyek Ponder baru menggunakan CLI:

```bash
npm init ponder@latest
```

Ikuti prompt:
```
Welcome to create-ponder – the quickest way to get started with Ponder!
✔ What's the name of your project? … my-ponder-app
✔ Which template would you like to use? › Default
```

Navigasi ke proyek dan mulai development:

```bash
cd my-ponder-app
npm run dev
```

### Struktur Proyek

Proyek Ponder memiliki tiga file utama:

```
my-ponder-app/
├── abis/           # ABI Contract
│   └── abi.ts
├── src/
│   └── index.ts    # Event handler
├── ponder.config.ts    # Konfigurasi chain dan contract
└── ponder.schema.ts    # Definisi schema database
```

| File | Fungsi |
|------|--------|
| `ponder.config.ts` | Mendefinisikan chain dan contract mana yang akan di-index |
| `ponder.schema.ts` | Mendefinisikan tabel database dan kolomnya |
| `src/index.ts` | Menulis handler untuk setiap event yang ingin di-index |
| `abis/*.ts` | Menyimpan ABI contract |

---

## Konsep Dasar

### Config (ponder.config.ts)

File config memberitahu Ponder apa yang harus di-index:

`ponder.config.ts`

```typescript
import { createConfig } from "ponder";
import { mockTokenABI } from "./abis/abi";

export default createConfig({
  chains: {
    baseSepolia: {
      id: 84532,
      rpc: "https://sepolia.base.org",
    },
  },
  contracts: {
    SawitToken: {
      chain: "baseSepolia",
      abi: mockTokenABI,
      address: "<TOKEN_ADDRESS>",
      startBlock: <START_BLOCK>,
    },
  },
});
```

**Field penting:**

- `chains` - Mendefinisikan network yang ingin di-index
  - `id` - Chain ID (84532 untuk Base Sepolia)
  - `rpc` - URL endpoint RPC

- `contracts` - Mendefinisikan contract yang akan dipantau
  - `chain` - Chain mana contract ini berada
  - `abi` - ABI contract (untuk decode event)
  - `address` - Address contract
  - `startBlock` - Nomor block untuk mulai indexing (mempercepat sync)

> **Tip**: Set `startBlock` ke block saat contract di-deploy. Ini mencegah Ponder men-scan block historis yang tidak relevan.

### Schema (ponder.schema.ts)

Schema mendefinisikan tabel database menggunakan fungsi `onchainTable` dari Ponder:

`ponder.schema.ts`

```typescript
import { onchainTable } from "ponder";

export const transfer = onchainTable("transfer", (t) => ({
  id: t.text().primaryKey(),
  hash: t.hex(),
  from: t.hex(),
  to: t.hex(),
  timestamp: t.bigint(),
  amount: t.bigint(),
}));
```

**Tipe kolom:**

| Tipe | Deskripsi | Contoh |
|------|-----------|--------|
| `t.text()` | String | ID transaksi, nama |
| `t.hex()` | String hex | Address, hash |
| `t.bigint()` | Integer besar | Jumlah token, timestamp |
| `t.integer()` | Integer biasa | Counter, index |
| `t.boolean()` | True/false | Flag |

**Aturan:**
- Setiap tabel butuh `primaryKey()`
- Gunakan `t.hex()` untuk address dan transaction hash
- Gunakan `t.bigint()` untuk jumlah token (bisa melebihi limit number JavaScript)

### Event Handler (src/index.ts)

Event handler memproses event blockchain dan menyimpan data ke database:

`src/index.ts`

```typescript
import { ponder } from "ponder:registry";
import { transfer } from "ponder:schema";

ponder.on("SawitToken:Transfer", async ({ event, context }) => {
  await context.db.insert(transfer).values({
    id: event.transaction.hash + "-" + event.log.logIndex,
    hash: event.transaction.hash,
    from: event.args.from,
    to: event.args.to,
    timestamp: event.block.timestamp,
    amount: event.args.value,
  });
});
```

**Struktur handler:**

- `ponder.on("ContractName:EventName", handler)` - Mendaftarkan handler untuk event tertentu
- `event.args` - Parameter event yang sudah di-decode (dari ABI)
- `event.transaction` - Detail transaksi (hash, from, to)
- `event.block` - Detail block (number, timestamp)
- `context.db` - Operasi database (insert, update, delete)

**Membuat ID unik:**

Event tidak punya ID unik secara natural. Pattern umum adalah menggabungkan transaction hash dengan log index:

```typescript
id: event.transaction.hash + "-" + event.log.logIndex
```

Ini memastikan keunikan bahkan ketika satu transaksi meng-emit multiple event.

---

## Implementasi Dasar

### Mendengarkan Event Transfer

Mari implementasikan contoh lengkap yang meng-index event Transfer ERC20.

**1. Tambahkan ABI:**

`abis/abi.ts`

```typescript
export const mockTokenABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;
```

**2. Konfigurasi contract:**

`ponder.config.ts`

```typescript
import { createConfig } from "ponder";
import { mockTokenABI } from "./abis/abi";

export default createConfig({
  chains: {
    baseSepolia: {
      id: 84532,
      rpc: "https://sepolia.base.org",
    },
  },
  contracts: {
    SawitToken: {
      chain: "baseSepolia",
      abi: mockTokenABI,
      address: "<TOKEN_ADDRESS>",
      startBlock: <START_BLOCK>,
    },
  },
});
```

**3. Definisikan schema:**

`ponder.schema.ts`

```typescript
import { onchainTable } from "ponder";

export const transfer = onchainTable("transfer", (t) => ({
  id: t.text().primaryKey(),
  hash: t.hex(),
  from: t.hex(),
  to: t.hex(),
  timestamp: t.bigint(),
  amount: t.bigint(),
}));
```

**4. Tulis event handler:**

`src/index.ts`

```typescript
import { ponder } from "ponder:registry";
import { transfer } from "ponder:schema";

ponder.on("SawitToken:Transfer", async ({ event, context }) => {
  await context.db.insert(transfer).values({
    id: event.transaction.hash + "-" + event.log.logIndex,
    hash: event.transaction.hash,
    from: event.args.from,
    to: event.args.to,
    timestamp: event.block.timestamp,
    amount: event.args.value,
  });
});
```

**5. Jalankan indexer:**

```bash
npm run dev
```

Ponder akan mulai sync dari `startBlock` dan memproses event.

### Query dengan GraphQL

Setelah berjalan, Ponder menyediakan GraphQL API di http://localhost:42069/

**Query sederhana - Dapatkan semua transfer:**

```graphql
{
  transfers {
    items {
      id
      hash
      from
      to
      amount
      timestamp
    }
  }
}
```

**Contoh response:**

```json
{
  "data": {
    "transfers": {
      "items": [
        {
          "id": "0x22718046...640a56-143",
          "hash": "0x22718046de0455847539ad9a4470d70f9b33394d955c0b9524ab332cc3640a56",
          "from": "0x0000000000000000000000000000000000000000",
          "to": "0x40623781fdce5a4589e5a6f138d9fab42e62bbf4",
          "amount": "1000000000000000000000",
          "timestamp": "1763221646"
        }
      ]
    }
  }
}
```

**Filtering - Dapatkan transfer dari address tertentu:**

```graphql
{
  transfers(
    where: {
      from: "0x0000000000000000000000000000000000000000",
      to: "0x40623781fdce5a4589e5a6f138d9fab42e62bbf4"
    }
  ) {
    items {
      id
      hash
      from
      to
      amount
      timestamp
    }
  }
}
```

**Operator filter yang tersedia:**
- Equality: `where: { field: "value" }`
- Perbandingan: `where: { amount_gt: "1000" }` (juga `_lt`, `_gte`, `_lte`)
- Multiple condition di-AND-kan bersama

---

## Pattern Lanjutan

### Agregasi (onConflictDoUpdate)

Seringkali kamu perlu track data agregat, seperti total transfer per user. Daripada insert row baru untuk setiap event, kamu bisa update row yang sudah ada.

**Update schema untuk menambah tabel user:**

`ponder.schema.ts`

```typescript
import { onchainTable } from "ponder";

export const transfer = onchainTable("transfer", (t) => ({
  id: t.text().primaryKey(),
  hash: t.hex(),
  from: t.hex(),
  to: t.hex(),
  timestamp: t.bigint(),
  amount: t.bigint(),
}));

// Track statistik agregat per address
export const user = onchainTable("user", (t) => ({
  id: t.text().primaryKey(),          // Address
  totalTransferCount: t.bigint(),     // Jumlah transfer
  totalTransferAmount: t.bigint(),    // Total amount yang ditransfer
}));
```

**Update handler untuk agregasi:**

`src/index.ts`

```typescript
import { ponder } from "ponder:registry";
import { user, transfer } from "ponder:schema";

ponder.on("SawitToken:Transfer", async ({ event, context }) => {
  // Insert record transfer individual
  await context.db.insert(transfer).values({
    id: event.transaction.hash + "-" + event.log.logIndex,
    hash: event.transaction.hash,
    from: event.args.from,
    to: event.args.to,
    timestamp: event.block.timestamp,
    amount: event.args.value,
  });

  // Update agregasi user (pattern upsert)
  await context.db
    .insert(user)
    .values({
      id: event.args.from,
      totalTransferCount: 1n,
      totalTransferAmount: event.args.value,
    })
    .onConflictDoUpdate((row) => ({
      totalTransferCount: (row.totalTransferCount || 0n) + 1n,
      totalTransferAmount: (row.totalTransferAmount || 0n) + event.args.value,
    }));
});
```

**Cara kerja `onConflictDoUpdate`:**

1. Coba insert row baru
2. Jika row dengan ID itu sudah ada (conflict), update saja
3. Callback menerima row yang sudah ada, memungkinkan kamu increment nilai

**Query data agregat:**

```graphql
{
  users {
    items {
      id
      totalTransferCount
      totalTransferAmount
    }
  }
}
```

### Relasi (one-to-many)

Ponder mendukung query relasional menggunakan syntax relation Drizzle. Ini memungkinkan kamu query data nested, seperti mendapatkan user dengan semua transfer-nya.

**Update schema dengan relasi:**

`ponder.schema.ts`

```typescript
import { onchainTable, relations } from "ponder";

export const transfer = onchainTable("transfer", (t) => ({
  id: t.text().primaryKey(),
  hash: t.hex(),
  from: t.hex(),
  to: t.hex(),
  timestamp: t.bigint(),
  amount: t.bigint(),
}));

export const user = onchainTable("user", (t) => ({
  id: t.text().primaryKey(),
  totalTransferCount: t.bigint(),
  totalTransferAmount: t.bigint(),
}));

// Satu user punya banyak transfer (one-to-many)
export const userRelations = relations(user, ({ many }) => ({
  transfers: many(transfer),
}));

// Setiap transfer milik satu user (many-to-one)
export const transferRelations = relations(transfer, ({ one }) => ({
  user: one(user, {
    fields: [transfer.from],
    references: [user.id],
  }),
}));
```

**Query dengan data nested:**

```graphql
{
  users {
    items {
      id
      totalTransferCount
      totalTransferAmount
      transfers {
        items {
          id
          from
          to
          amount
        }
      }
    }
  }
}
```

---

## Kesimpulan

Di panduan ini, kamu belajar:

1. **Kenapa indexing** - Blockchain lambat untuk di-query; indexer menyediakan API yang cepat dan fleksibel
2. **Arsitektur Ponder** - Config, Schema, dan Event Handler bekerja bersama
3. **Indexing dasar** - Mendengarkan event, menyimpan data, query dengan GraphQL
4. **Pattern lanjutan** - Agregasi dengan upsert, query relasional

**Skill yang didapat:**
- Menyiapkan proyek Ponder dari awal
- Mengkonfigurasi contract dan chain
- Mendefinisikan schema database
- Menulis event handler
- Query data yang di-index dengan GraphQL
- Mengimplementasikan pattern agregasi
- Menyiapkan relasi antar tabel

**Langkah selanjutnya:**
- Eksplorasi pagination dan sorting di query GraphQL
- Tambah lebih banyak tipe event (Approval, Mint, Burn)
- Deploy indexer ke production
- Cek [dokumentasi Ponder](https://ponder.sh) untuk fitur lebih lanjut

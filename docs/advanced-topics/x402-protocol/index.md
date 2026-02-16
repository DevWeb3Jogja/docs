---
title: x402 Protocol - HTTP Payment for Web3
sidebar_label: x402 Protocol
sidebar_position: 3
---

# x402 Beginner

## Prinsip Umum

- **Target Pembaca:** Developer Web2 yang ingin monetisasi API & Developer Web3 pemula.
- **Fokus:** Memahami fondasi protokol (Handshake & Architecture) dan membuat implementasi dasar yg jalan.
- **Structure:**
  1.  **Fundamental Theory:** Konsep dasar "Why x402?".
  2.  **The Handshake:** Mekanisme "Request-Reject-Retry".
  3.  **Implementation:** Kode lengkap (Seller & Buyer).
  4.  **Troubleshooting:** Solusi error umum.

---

## 1. Fundamental Theory (Concept First)

Sebelum menulis baris kode pertama, kita harus paham "siapa melakukan apa" dan "kenapa x402 berbeda".

### 1.1 The Triangle Architecture

x402 tidak bekerja sendirian. Ada tiga pihak yang terlibat:

1.  **Client (Buyer):** Pihak yang ingin membeli data/layanan. Bisa berupa manusia (via script) atau AI Agent.
2.  **Server (Seller):** Pihak yang memiliki data/layanan. Mereka yang melempar "tagihan".
3.  **Facilitator (Wasit):** Pihak ketiga yang netral. Tugasnya memverifikasi pembayaran di blockchain dan memberi tahu Server "Hei, pembayaran ini valid!".
    - _Analogi:_ Facilitator itu seperti mesin EDC kartu kredit. Kasir (Server) tidak perlu nelpon bank sendiri; cukup lihat respon "Approved" dari mesin EDC (Facilitator).

### 1.2 Kenapa HTTP 402?

Status code `402 Payment Required` sudah ada sejak tahun 90-an tapi jarang dipakai. x402 menghidupkannya kembali untuk membuat **Native Web Payments**.

### 1.3 Perbandingan: x402 vs Metode Tradisional

| Aspek                      | Subscription (Web2)       | Manual Payment (Web3)      | x402 Protocol                   |
| -------------------------- | ------------------------- | -------------------------- | ------------------------------- |
| **Model Pembayaran**       | Bayar bulanan di depan    | Bayar manual per transaksi | Pay-per-request otomatis        |
| **Autentikasi**            | Login/logout, session     | Connect wallet manual      | Stateless, tanpa login          |
| **Friction**               | Tinggi (sign up, KYC)     | Sedang (approve setiap tx) | Rendah (otomatis di background) |
| **Cocok untuk AI Agent?**  | ❌ Tidak (butuh akun)     | ⚠️ Sulit (butuh interaksi) | ✅ Ya (zero-interaction)        |
| **Database User**          | Wajib                     | Tidak perlu                | Tidak perlu                     |
| **Granularitas**           | Per bulan/tahun           | Per transaksi              | Per HTTP request                |
| **Unused Credits**         | Terbuang jika tidak pakai | Tidak ada                  | Tidak ada                       |
| **Integration Complexity** | Tinggi (OAuth, session)   | Sedang (smart contract)    | Rendah (HTTP native)            |

**Kesimpulan:** x402 menggabungkan yang terbaik dari kedua dunia:

- **Otomatis** seperti subscription, tapi **tanpa komitmen bulanan**
- **Granular** seperti manual payment, tapi **tanpa friction**
- **Web3 native**, tapi **menggunakan protokol HTTP standar**

### 1.4 Use Case Utama

1. **AI Agent Marketplace:** AI yang beli data dari API lain secara otomatis
2. **Micropayment API:** Bayar $0.001 per request (tidak ekonomis dengan gas fee biasa)
3. **Pay-per-use Services:** Bayar hanya untuk apa yang digunakan
4. **Cross-chain Payments:** Satu protokol untuk berbagai blockchain

---

## 2. The x402 Handshake (Protocol Flow)

Bagaimana cara komputer "membayar"? Prosesnya disebut **x402 Handshake** dengan siklus **Request-Reject-Retry**.

### Alur Transaksi:

1.  **Request Awal (Polos):**
    Client meminta data ke Server.
    `GET /premium`
    _(Client belum tahu harga, belum bawa uang)_

2.  **Challenge (Penolakan 402):**
    Server menolak request tersebut.
    `402 Payment Required`
    Header: `PAYMENT-REQUIRED: amount=0.01; currency=USDC; chain=Base; address=0xSeller...`
    _(Server: "Eits, bayar dulu 0.01 USDC ke alamat ini kalau mau masuk!")_

3.  **Signing (Tanda Tangan):**
    Client membaca tagihan tersebut di background, lalu menandatangani transaksi pembayaran menggunakan Private Key dompetnya.

4.  **Request Ulang (Dengan Bukti):**
    Client mengirim request yang sama persis, tapi kali ini melampirkan bukti.
    `GET /premium`
    Header: `PAYMENT-SIGNATURE: <bukti_tanda_tangan_valid>`

5.  **Validasi & Response:**
    Server tanya Facilitator: "Ini signature valid gak?". Facilitator cek ke blockchain.
    Jika Valid -> Server kirim data (`200 OK`).

---

## 3. Implementation (Level 1)

Kita akan membuat implementasi paling dasar: Server (Seller) menjual satu rute seharga tetap, dan Script Buyer membelinya.

### Persiapan Project

Buka terminal dan siapkan folder kerja:

```bash
mkdir x402-demo
cd x402-demo
npm init -y
```

Tambahkan `"type": "module"` di `package.json` agar bisa menggunakan syntax `import`.

---

## 3.1 Aturan & Common Mistakes

Sebelum mulai coding, pahami aturan penting ini untuk menghindari kesalahan umum yang sering terjadi.

### 3.1.1 Aturan Environment Variables

**Bedakan Private Key vs Public Address**

Ini adalah kesalahan paling umum yang sering terjadi di x402.

```javascript
// ❌ SALAH - pakai private key untuk seller (berbahaya!)
payTo: process.env.SELLER_EVM_PRIVATE_KEY; // Jangan expose private key!

// ✅ BENAR - pakai public address untuk seller
payTo: process.env.SELLER_EVM_ADDRESS; // Aman, cuma address
```

**Aturan:**

- **Buyer**: Butuh PRIVATE KEY (untuk sign payment)
- **Seller**: Butuh PUBLIC ADDRESS (untuk terima payment)

### 3.1.2 Aturan Network & Facilitator

**1. Gunakan testnet facilitator untuk development**

```javascript
// ❌ SALAH - langsung pakai production tanpa API key
const facilitator = new HTTPFacilitatorClient({
  url: "https://api.cdp.coinbase.com/platform/v2/x402",
  // Akan error: unauthorized
});

// ✅ BENAR - pakai testnet untuk development
const facilitator = new HTTPFacilitatorClient({
  url: "https://www.x402.org/facilitator", // Gratis, tanpa API key
});
```

**2. Network ID harus konsisten antara buyer dan seller**

```javascript
// ❌ SALAH - buyer dan seller pakai network berbeda
// seller.js
network: "eip155:84532"; // Base Sepolia

// buyer.js
// (tidak ada konfigurasi network, pakai default mainnet)
// Payment akan gagal karena network mismatch!

// ✅ BENAR - pastikan sama-sama Base Sepolia
// seller.js
network: "eip155:84532"; // Base Sepolia

// buyer.js
registerExactEvmScheme(client, {
  signer: buyerAccount,
  // Library otomatis detect network dari seller's challenge
});
```

### 3.1.3 Aturan Payment Configuration

**1. Format harga harus benar**

```javascript
// ❌ SALAH - format harga tidak valid
price: "0.01"; // Missing currency symbol
price: "1 USDC"; // Space tidak diperbolehkan
price: "$1"; // Tidak ada decimal untuk micropayment

// ✅ BENAR - format: $amount
price: "$0.01"; // Benar
price: "$0.001"; // Benar untuk micropayment
price: "$1.50"; // Benar
```

**2. Scheme harus didaftarkan di server**

```javascript
// ❌ SALAH - lupa register scheme
const server = new x402ResourceServer(facilitator);
// Langsung pakai tanpa register
app.use(paymentMiddleware(routeConfig, server));
// Error: scheme "exact" not supported

// ✅ BENAR - register scheme dulu
const server = new x402ResourceServer(facilitator);
server.register("eip155:84532", new ExactEvmScheme());
app.use(paymentMiddleware(routeConfig, server));
```

**3. Route config harus match dengan route handler**

```javascript
// ❌ SALAH - route config tidak match
const routeConfig = {
  "GET /premium": { ... }  // Config untuk /premium
};
app.get("/api/premium", (req, res) => { ... });  // Handler di /api/premium
// Payment tidak akan ter-trigger!

// ✅ BENAR - route harus sama persis
const routeConfig = {
  "GET /premium": { ... }
};
app.get("/premium", (req, res) => { ... });
```

### 3.1.4 Aturan Middleware Order

**1. Payment middleware harus dipasang SEBELUM route handler**

```javascript
// ❌ SALAH - middleware dipasang setelah route
app.get("/premium", (req, res) => {
  res.json({ data: "premium" });
});
app.use(paymentMiddleware(routeConfig, server)); // Terlambat!
// Route sudah didefinisikan, middleware tidak akan jalan

// ✅ BENAR - middleware dipasang sebelum route
app.use(paymentMiddleware(routeConfig, server));
app.get("/premium", (req, res) => {
  res.json({ data: "premium" });
});
```

**2. Custom logging middleware harus sebelum payment middleware**

```javascript
// ❌ SALAH - logging setelah payment middleware
app.use(paymentMiddleware(routeConfig, server));
app.use((req, res, next) => {
  console.log("Request masuk"); // Tidak akan log request tanpa payment
  next();
});

// ✅ BENAR - logging sebelum payment middleware
app.use((req, res, next) => {
  console.log("Request masuk");
  next();
});
app.use(paymentMiddleware(routeConfig, server));
```

### 3.1.5 Aturan Wallet & Saldo

**1. Wallet buyer harus punya saldo USDC testnet**

```javascript
// ❌ SALAH - wallet kosong atau cuma punya ETH
// Wallet: 0x... (Balance: 0.5 ETH, 0 USDC)
// Error: insufficient USDC balance

// ✅ BENAR - wallet punya USDC testnet
// Wallet: 0x... (Balance: 0.1 ETH, 10 USDC)
// Payment berhasil
```

**Cara dapat USDC testnet:**

1. Buka [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-sepolia-faucet)
2. Claim ETH testnet dulu
3. Swap ETH ke USDC di testnet DEX atau gunakan faucet USDC

**2. Seller tidak perlu saldo (hanya butuh address)**

```javascript
// ✅ BENAR - seller cuma butuh address untuk terima payment
// Tidak perlu ada saldo di wallet seller
SELLER_EVM_ADDRESS = 0x8a5250a8fc6670469c3ed02b7e7277c4e7daa590;
```

### 3.1.6 Common Error Messages & Solutions

| Error Message                                                | Penyebab                                          | Solusi                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------ |
| `Cannot read properties of undefined (reading 'initialize')` | Lupa create `x402ResourceServer`                  | Tambahkan `const server = new x402ResourceServer(facilitator)`           |
| `Facilitator does not support scheme "exact"`                | Lupa register scheme atau pakai facilitator salah | Register scheme: `server.register("eip155:84532", new ExactEvmScheme())` |
| `Payment Required` terus menerus                             | Saldo USDC buyer habis                            | Top up USDC testnet di wallet buyer                                      |
| `insufficient funds for gas`                                 | Saldo ETH buyer habis                             | Top up ETH testnet untuk gas fee                                         |
| `Invalid signature`                                          | Private key salah atau network mismatch           | Cek `BUYER_EVM_PRIVATE_KEY` dan pastikan network sama                    |
| `404 Not Found`                                              | Seller tidak jalan atau URL salah                 | Pastikan `node seller.js` jalan di terminal lain                         |

---

### 3.2 Basic Seller (Toko Penjual)

**What:** Server Express.js dengan konfigurasi Resource Server.
**Why:** Kita menggunakan `x402ResourceServer` untuk mengelola state pembayaran dan koneksi ke Facilitator. PENTING: Gunakan Facilitator Testnet (`x402.org`) agar tidak perlu API Key di tahap awal.
**How:**

1.  **Install Library:**

    ```bash
    npm install express @x402/express @x402/evm @x402/core dotenv
    ```

    **Penjelasan Library (Seller Side):**

    | Library         | Fungsi                        | Peran dalam x402                                                                       |
    | --------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
    | `express`       | Web framework Node.js         | Membuat HTTP server untuk menerima request                                             |
    | `@x402/express` | x402 middleware untuk Express | Menyediakan `paymentMiddleware` yang otomatis handle 402 response dan validasi payment |
    | `@x402/evm`     | EVM scheme implementation     | Menangani payment scheme untuk EVM chains (Ethereum, Base, dll)                        |
    | `@x402/core`    | Core x402 protocol            | Menyediakan `HTTPFacilitatorClient` untuk komunikasi dengan facilitator                |
    | `dotenv`        | Environment variable loader   | Memuat konfigurasi sensitif (wallet address) dari file `.env`                          |

2.  **Setup `.env`:**
    Buat file `.env` di root folder dan isi dengan wallet address seller:

    ```env
    # Alamat wallet untuk menerima pembayaran (PUBLIC ADDRESS, bukan private key)
    SELLER_EVM_ADDRESS=0x1234567890123456789012345678901234567890
    ```

    **⚠️ PENTING:**
    - Gunakan **PUBLIC ADDRESS** saja, BUKAN private key
    - Gunakan wallet testnet untuk development
    - Jangan commit file `.env` ke Git (tambahkan ke `.gitignore`)

3.  **Buat File `seller.js`:**
    _(Copy-paste seluruh kode di bawah)_

    ```javascript
    // seller.js
    import express from "express";
    import dotenv from "dotenv";
    import { paymentMiddleware, x402ResourceServer } from "@x402/express";
    import { ExactEvmScheme } from "@x402/evm/exact/server";
    import { HTTPFacilitatorClient } from "@x402/core/server";

    dotenv.config();

    const app = express();
    const PORT = 3000;

    if (!process.env.SELLER_EVM_ADDRESS) {
      console.error(
        "[failed] Error: Harap buat file .env dan isi SELLER_EVM_ADDRESS",
      );
      process.exit(1);
    }

    // Facilitator Client menghubungkan kita ke validator
    const facilitator = new HTTPFacilitatorClient({
      // GUNAKAN TESTNET FACILITATOR (Gratis & Tanpa API Key untuk dev)
      url: "https://www.x402.org/facilitator",

      // Jika nanti pakai CDP production:
      // url: "https://api.cdp.coinbase.com/platform/v2/x402"
    });

    // Resource Server mengelola state pembayaran
    const server = new x402ResourceServer(facilitator);

    // Daftarkan Skema EVM (Base Sepolia) ke Server
    server.register("eip155:84532", new ExactEvmScheme());

    const routeConfig = {
      "GET /premium": {
        accepts: [
          {
            scheme: "exact",
            price: "$0.01",
            network: "eip155:84532", // Base Sepolia Chain ID
            payTo: process.env.SELLER_EVM_ADDRESS,
          },
        ],
      },
    };

    // Custom logging middleware untuk tracking request
    app.use((req, res, next) => {
      const timestamp = new Date().toISOString();

      if (req.path === "/premium") {
        console.log(
          "          📥 REQUEST MASUK (SELLER SIDE)                    ",
        );
        console.log(`Waktu: ${timestamp}`);
        console.log(`Path: ${req.method} ${req.path}`);
        console.log(`From: ${req.ip}`);

        const paymentSig = req.headers["payment-signature"];
        if (paymentSig) {
          console.log("\n💳 Request membawa Payment Signature");
          console.log("🔍 Memverifikasi pembayaran ke Facilitator...");
        } else {
          console.log("\n⚠️  Request tanpa Payment Signature");
          console.log("📤 Akan mengirim 402 Payment Required");
        }

        // Intercept response untuk logging
        const originalJson = res.json.bind(res);
        res.json = function (data) {
          if (res.statusCode === 200) {
            console.log("\n[success] PEMBAYARAN VALID - Mengirim data premium");
            console.log(`Seller menerima: $0.01 USDC`);
            console.log(`Ke alamat: ${process.env.SELLER_EVM_ADDRESS}`);
          }
          return originalJson(data);
        };
      }

      next();
    });

    // Pasang Middleware Global
    app.use(paymentMiddleware(routeConfig, server));

    app.get("/", (req, res) => {
      res.send("Halo! Masuk ke /premium untuk membeli data.");
    });

    // Route Berbayar
    app.get("/premium", (req, res) => {
      res.json({
        status: "LUNAS",
        data: "Selamat! Ini adalah konten berbayar.",
        timestamp: new Date(),
      });
    });

    app.listen(PORT, () => {
      console.log(
        "            🏪 SELLER SERVER AKTIF (x402)                  ",
      );
      console.log(`\nServer URL: http://localhost:${PORT}`);
      console.log(`Harga /premium: $0.01 USDC`);
      console.log(`Penerima: ${process.env.SELLER_EVM_ADDRESS}`);
      console.log(`Network: Base Sepolia (eip155:84532)`);
      console.log(`Facilitator: https://www.x402.org/facilitator`);
      console.log(`\nSiap menerima pembayaran!\n`);
    });
    ```

    ### 🔍 Penjelasan Kode Seller (Detail)

    **1. HTTPFacilitatorClient**
    - Jembatan komunikasi ke "Wasit" (Facilitator)
    - Testnet facilitator (`x402.org`) gratis dan tanpa API key
    - Production facilitator (CDP) butuh API key tapi lebih reliable

    **2. x402ResourceServer**
    - Komponen inti yang memvalidasi pembayaran
    - Bertanya ke Facilitator: "Apakah signature ini valid?"
    - Mengelola state pembayaran per-request

    **3. ExactEvmScheme**
    - Implementasi payment scheme untuk EVM chains
    - "Exact" = harga pasti (bukan auction/dynamic pricing)
    - Menggunakan EIP-3009 (transferWithAuthorization) untuk gasless payment

    **4. routeConfig (Payment Menu)**
    - Mendefinisikan route mana yang berbayar
    - Harga per route (`$0.01` USDC)
    - Network yang diterima (`eip155:84532` = Base Sepolia)
    - Alamat penerima dana (`payTo`)

    **5. Custom Logging Middleware**
    - Menampilkan detail setiap request yang masuk
    - Membedakan request dengan/tanpa payment signature
    - Logging saat pembayaran valid

    **6. paymentMiddleware**
    - Middleware otomatis yang:
      - Intercept semua request ke route berbayar
      - Kirim 402 jika belum ada payment
      - Validasi payment signature ke facilitator
      - Pass request ke handler jika payment valid

4.  **Jalankan Server:**
    ```bash
    node seller.js
    ```

---

### 3.2 Basic Buyer (Script Pembeli)

**What:** Script Node.js yang beli data otomatis.
**Why:** Browser biasa belum support x402 native. Kita butuh script client yang bisa handle `402` error dan melakukan signing.
**How:**

1.  **Install Library Client:**

    ```bash
    npm install @x402/fetch @x402/evm viem dotenv
    ```

    **Penjelasan Library (Buyer Side):**

    | Library       | Fungsi                      | Peran dalam x402                                                          |
    | ------------- | --------------------------- | ------------------------------------------------------------------------- |
    | `@x402/fetch` | x402-enabled fetch wrapper  | Otomatis handle 402 response, create payment signature, dan retry request |
    | `@x402/evm`   | EVM payment scheme (client) | Generate EIP-712 signature untuk payment authorization                    |
    | `viem`        | Ethereum library            | Manage wallet account dan signing operations                              |
    | `dotenv`      | Environment variable loader | Memuat private key dari file `.env` secara aman                           |

2.  **Setup `.env`:**
    Buat file `.env` dan isi dengan Private Key wallet testnet kamu.

    ```env
    # CONTOH ISI FILE .ENV
    # Gunakan Wallet Testnet! Jangan wallet utama.
    # Private Key untuk pembayaran (Buyer) - HARUS PUNYA SALDO USDC TESTNET
    BUYER_EVM_PRIVATE_KEY=0xabcd1234...
    ```

    **⚠️ KEAMANAN:**
    - Gunakan wallet **testnet** untuk development
    - **JANGAN PERNAH** commit file `.env` ke Git
    - Tambahkan `.env` ke `.gitignore`
    - Private key ini digunakan untuk sign payment, bukan untuk login

3.  **Buat File `buyer.js`:**
    _(Copy-paste seluruh kode di bawah)_

    ```javascript
    // buyer.js
    import dotenv from "dotenv";
    import {
      x402Client,
      wrapFetchWithPayment,
      x402HTTPClient,
    } from "@x402/fetch";
    import { registerExactEvmScheme } from "@x402/evm/exact/client";
    import { privateKeyToAccount } from "viem/accounts";

    dotenv.config();

    if (!process.env.BUYER_EVM_PRIVATE_KEY) {
      console.error(
        "[failed] Error: Harap buat file .env dan isi BUYER_EVM_PRIVATE_KEY",
      );
      process.exit(1);
    }

    // 1. Setup Wallet Pembeli (Signer)
    const buyerAccount = privateKeyToAccount(process.env.BUYER_EVM_PRIVATE_KEY);
    console.log(`[info] Login sebagai: ${buyerAccount.address}`);

    // 2. Setup Client x402
    const client = new x402Client();
    registerExactEvmScheme(client, {
      signer: buyerAccount,
    });

    // Kita membuat 'Spy' untuk mengintip apa yang terjadi di jaringan.
    // Agar kita bisa melihat proses: Request -> 402 -> Sign -> Retry 200
    const originalFetch = globalThis.fetch;
    let capturedPaymentSignature = null;

    const spyFetch = async (url, options) => {
      console.log(`\n[Outbound] Request ke ${url}`);

      // Capture payment signature jika ada
      if (options?.headers?.["payment-signature"]) {
        console.log("   [info] Request membawa Payment Signature");
        capturedPaymentSignature = options.headers["payment-signature"];

        // Parse dan tampilkan detail signature
        try {
          const sigData = JSON.parse(atob(capturedPaymentSignature));
          console.log("\n   PAYMENT SIGNATURE (EIP-712):");
          console.log(`   Scheme: ${sigData.scheme || "exact"}`);
          if (sigData.payload && sigData.payload.signature) {
            console.log(
              `   Signature: ${sigData.payload.signature.substring(0, 30)}...`,
            );
          }
          if (sigData.payload && sigData.payload.authorization) {
            const auth = sigData.payload.authorization;
            console.log(`   From: ${auth.from}`);
            console.log(`   To: ${auth.to}`);
            console.log(
              `   Value: $${(parseInt(auth.value) / 1000000).toFixed(6)} USDC`,
            );
            console.log(`   Nonce: ${auth.nonce.substring(0, 30)}...`);
          }
        } catch (e) {
          console.log(
            `   Signature (base64): ${capturedPaymentSignature.substring(0, 50)}...`,
          );
        }
      }

      const response = await originalFetch(url, options);

      console.log(
        `[Inbound] Response: ${response.status} ${response.statusText}`,
      );

      if (response.status === 402) {
        console.log(
          "   [info] Terkena '402 Payment Required'. Mulai proses signing...",
        );
        const challenge =
          response.headers.get("www-authenticate") ||
          response.headers.get("payment-required");

        // Parse payment requirements untuk menampilkan detail
        try {
          const decoded = JSON.parse(atob(challenge));
          if (decoded.accepts && decoded.accepts[0]) {
            const paymentInfo = decoded.accepts[0];
            console.log("\n   DETAIL PEMBAYARAN:");
            console.log(
              `   Harga: $${(parseInt(paymentInfo.amount) / 1000000).toFixed(6)} USDC`,
            );
            console.log(`   Network: ${paymentInfo.network}`);
            console.log(`   Bayar ke: ${paymentInfo.payTo}`);
            console.log(`   Token: ${paymentInfo.asset}`);
          }
        } catch (e) {
          console.log(
            `   [info] Challenge Header: ${challenge.substring(0, 50)}...`,
          );
        }
      } else if (response.status === 200) {
        console.log("   [success] Pembayaran diterima & Akses diberikan!");
      }

      return response;
    };

    // Bungkus 'spyFetch' kita dengan logika x402
    const fetchBayar = wrapFetchWithPayment(spyFetch, client);

    async function main() {
      console.log("\n========================================");
      console.log("MEMULAI TRANSAKSI x402 (BUYER SIDE)");
      console.log("========================================");
      console.log(`Wallet Buyer: ${buyerAccount.address}\n`);

      try {
        // Panggil API. Di balik layar, fetchBayar akan menggunakan 'spyFetch'
        const response = await fetchBayar("http://localhost:3000/premium");

        if (response.ok) {
          const data = await response.json();

          console.log("\n========================================");
          console.log("TRANSAKSI BERHASIL");
          console.log("========================================");

          console.log("\nBUKTI PEMBAYARAN:");

          // Tampilkan payment signature yang sudah di-capture
          if (capturedPaymentSignature) {
            console.log("\n1. Payment Signature (yang dikirim Buyer):");
            console.log(`   Header: payment-signature`);
            console.log(
              `   Payload (base64): ${capturedPaymentSignature.substring(0, 60)}...`,
            );
          }

          // Debug: tampilkan semua response headers
          console.log("\n2. Response Headers (dari server):");
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
          console.log(JSON.stringify(headers, null, 2));

          console.log("\nDATA YANG DITERIMA:");
          console.log(JSON.stringify(data, null, 2));
          console.log("\nPembayaran berhasil! Data premium telah diterima.\n");
        } else {
          console.log("\n[failed] Gagal:", await response.text());
        }
      } catch (error) {
        console.error("\n[failed] Error Koneksi:", error.message);
        console.error(error);
      }
    }

    main();
    ```

    ### 🔍 Penjelasan Kode Buyer (Detail)

    **1. Setup Wallet & x402 Client**

    ```javascript
    const buyerAccount = privateKeyToAccount(process.env.BUYER_EVM_PRIVATE_KEY);
    const client = new x402Client();
    registerExactEvmScheme(client, { signer: buyerAccount });
    ```

    - `privateKeyToAccount`: Convert private key menjadi account object (dari viem)
    - `x402Client`: Core client untuk handle x402 protocol
    - `registerExactEvmScheme`: Daftarkan EVM payment scheme dengan signer

    **2. Spy Fetch Pattern**

    ```javascript
    const spyFetch = async (url, options) => { ... }
    const fetchBayar = wrapFetchWithPayment(spyFetch, client);
    ```

    - **Spy Fetch**: Custom fetch wrapper untuk logging (educational purpose)
    - **wrapFetchWithPayment**: Membungkus spy fetch dengan x402 logic
    - Hasilnya: fetch yang otomatis handle 402 + logging detail

    **3. Alur Transaksi (yang terjadi di background):**

    | Step | Action                           | Keterangan                                        |
    | ---- | -------------------------------- | ------------------------------------------------- |
    | 1    | `[Outbound]` Request pertama     | Tanpa payment signature                           |
    | 2    | `[Inbound] 402` Payment Required | Server kirim challenge (tagihan)                  |
    | 3    | **Auto-signing**                 | Library parse challenge, create EIP-712 signature |
    | 4    | `[Outbound]` Request kedua       | Dengan payment signature di header                |
    | 5    | `[Inbound] 200` OK               | Server validasi payment, kirim data               |

    **4. Payment Signature (EIP-712)**
    - Bukan transaksi on-chain biasa
    - Menggunakan EIP-3009 `transferWithAuthorization`
    - Buyer sign off-chain, Facilitator submit on-chain
    - Gasless untuk buyer (gas dibayar facilitator)

    **5. Response Headers**
    - `payment-response`: Berisi tx hash dan settlement info (base64 encoded)
    - Decode untuk lihat transaction hash di blockchain explorer
    - Contoh: `https://sepolia.basescan.org/tx/0x...`

4.  **Jalankan Buyer:**
    Pastikan server (`node seller.js`) masih jalan di terminal lain.

    ```bash
    node buyer.js
    ```

    **Expected Output:**

    ```
    ========================================
    MEMULAI TRANSAKSI x402 (BUYER SIDE)
    ========================================
    Wallet Buyer: 0xa5Bf993C53Da4C86a0d41C37086E3449f088e86E

    [Outbound] Request ke [object Request]
    [Inbound] Response: 402 Payment Required
       [info] Terkena '402 Payment Required'. Mulai proses signing...

       DETAIL PEMBAYARAN:
       Harga: $0.010000 USDC
       Network: eip155:84532
       Bayar ke: 0x8A5250a8fc6670469C3eD02B7e7277C4E7DaA590
       Token: 0x036CbD53842c5426634e7929541eC2318f3dCF7e

    [Outbound] Request ke [object Request]
    [Inbound] Response: 200 OK
       [success] Pembayaran diterima & Akses diberikan!

    ========================================
    TRANSAKSI BERHASIL
    ========================================

    BUKTI PEMBAYARAN:

    1. Payment Signature (yang dikirim Buyer):
       Header: payment-signature
       Payload (base64): eyJzY2hlbWUiOiJleGFjdCIsInBheWxvYWQiOnsic2lnbmF0dXJlIjoi...

    2. Response Headers (dari server):
    {
      "connection": "keep-alive",
      "content-type": "application/json; charset=utf-8",
      "payment-response": "eyJzdWNjZXNzIjp0cnVlLCJ0cmFuc2FjdGlvbiI6IjB4ZDc2NzVjN2NkMmVkNGM0ZTJjYzE5YmJiNTNlNmQ0YjY2NTkxOTFkODg1OWRlNjliMzQ0MzEzZjMxOTRhMzZhNCIsIm5ldHdvcmsiOiJlaXAxNTU6ODQ1MzIiLCJwYXllciI6IjB4YTVCZjk5M0M1M0RhNEM4NmEwZDQxQzM3MDg2RTM0NDlmMDg4ZTg2RSJ9"
    }

    DATA YANG DITERIMA:
    {
      "status": "LUNAS",
      "data": "Selamat! Ini adalah konten berbayar.",
      "timestamp": "2026-02-15T20:55:10.731Z"
    }

    Pembayaran berhasil! Data premium telah diterima.
    ```

---

## 4. Troubleshooting

- **Error: `Facilitator does not support scheme "exact" on network...`**
  - _Penyebab:_ Anda menggunakan URL Facilitator CDP (`api.cdp.coinbase.com`) tanpa API Key, atau URL Facilitator yang salah.
  - _Solusi:_ Gunakan URL Testnet: `https://www.x402.org/facilitator` di `seller.js` (seperti contoh di atas).

- **Error: `Cannot read properties of undefined (reading 'initialize')`**
  - _Penyebab:_ Versi library x402 terbaru membutuhkan inisialisasi `x402ResourceServer` secara eksplisit.
  - _Solusi:_ Ikuti contoh kode `seller.js` terbaru di atas yang menggunakan `new x402ResourceServer(facilitator)`.

- **Error: `Payment Required` terus menerus (Looping)**
  - _Penyebab:_ Saldo wallet habis (perlu ETH Sepolia buat gas, ATAU USDC Sepolia buat bayar).
  - _Solusi:_ Cek saldo di Base Sepolia faucet.

---

## 5. Kesimpulan Implementasi

Apa yang sebenarnya baru saja kita capai di Level beginner ini?

1.  **Native Web Payment:** Kita berhasil mentransaksikan nilai (uang) murni menggunakan protokol HTTP standar, tanpa perantara payment gateway tradisional (seperti Stripe/PayPal) dan tanpa login/register.
2.  **Stateless Revenue:** Server Anda menerima uang tanpa perlu punya database user atau saldo. Validasi dilakukan _on-the-fly_ oleh Facilitator & Blockchain.
3.  **Zero-Interaction:** Client (Buyer) melakukan pembayaran sepenuhnya otomatis di background. Ini adalah fondasi utama untuk **AI Agent** yang bisa berbelanja data secara mandiri.

Sistem ini baru permulaan. Di level selanjutnya, kita akan belajar bagaimana agar layanan ini bisa "ditemukan" otomatis oleh mesin lain (Discovery) tanpa client harus hardcode URL-nya.

---

## 6. Glossary

- **Handshake:** Proses negosiasi pembayaran antara Client dan Server.
- **Scheme:** Metode pembayaran yang dipakai (misal: `exact` = harga pas).
- **Facilitator:** Pihak ketiga penyedia jasa validasi pembayaran.

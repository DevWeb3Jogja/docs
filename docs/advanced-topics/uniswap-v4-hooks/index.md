---
title: Uniswap V4 Hooks
sidebar_label: Uniswap V4 Hooks
sidebar_position: 1
---

# Uniswap V4 Hooks — Panduan untuk Developer Indonesia

## 1.1 Pendahuluan

### 1.1.1 Apa itu Uniswap V4?

Uniswap adalah DEX (Decentralized Exchange) terbesar di ekosistem Ethereum. Sejak versi pertama diluncurkan tahun 2018, Uniswap terus berevolusi:

| Versi | Tahun | Fitur Utama |
|-------|-------|-------------|
| V1 | 2018 | AMM pertama, hanya pair ETH ↔ ERC20 |
| V2 | 2020 | Pair ERC20 ↔ ERC20, Flash Swaps, TWAP Oracle |
| V3 | 2021 | Concentrated Liquidity, LP bisa pilih price range |
| V4 | 2025 | Hooks, Singleton Design, Flash Accounting, ERC-6909 |

Uniswap V4 (diluncurkan 31 Januari 2025) membawa perubahan arsitektur besar-besaran. Salah satu fitur paling revolusioner adalah **Hooks** — smart contract yang bisa kamu tulis untuk memodifikasi perilaku liquidity pool.

### 1.1.2 Apa itu Hooks?

Hooks adalah smart contract yang bisa "menempel" ke liquidity pool dan menjalankan logika custom di titik-titik penting dalam alur operasi pool. Analoginya mirip dengan React hooks (`useState`, `useEffect`) yang memungkinkan kamu "plug in" ke lifecycle sebuah komponen.

Dengan hooks, kamu bisa membuat DEX turunan di atas Uniswap **tanpa perlu fork** seluruh codebase. Ini membuka peluang besar untuk inovasi:

- Onchain orderbook (limit orders)
- Custom pricing curve (misalnya untuk stablecoin)
- Dynamic fees yang menyesuaikan kondisi pasar
- Proteksi dari MEV (sandwich attacks)
- Auto-compounding LP fees
- KYC'd pools untuk enterprise
- Dan masih banyak lagi!

### 1.1.3 Prasyarat

Panduan ini ditujukan untuk developer yang sudah memiliki:

- Pengalaman menulis smart contract dalam **Solidity**
- Familiar dengan **Foundry** (forge, cast, anvil), khususnya menulis test
- Pemahaman dasar tentang **AMM** dan konsep **xy = k** (Uniswap V2)
- Ketertarikan dalam perkembangan DeFi

### 1.1.4 Tujuan

Di akhir panduan ini, kamu akan mampu:

- Memahami arsitektur Uniswap V4 (Singleton, Flash Accounting, ERC-6909)
- Memahami jenis-jenis hook yang tersedia dan kapan menggunakannya
- Membangun hook sederhana (Points Hook) dari nol
- Menulis test suite untuk hook menggunakan Foundry
- Memahami konsep Dynamic Fees dan Limit Orders
- Mengenal Return Delta hooks untuk custom pricing curve
- Memahami pertimbangan keamanan saat membangun hooks

---

## 1.2 Arsitektur Uniswap V4

### 1.2.1 Singleton Design

Di Uniswap V3, setiap pool adalah contract terpisah yang di-deploy melalui Factory contract. Ini mahal untuk multi-hop swap karena perlu transfer token antar contract.

Uniswap V4 menggunakan **Singleton Design** — satu contract `PoolManager` mengelola **semua** pool.

```
V3: Factory → Pool A (contract sendiri)
           → Pool B (contract sendiri)
           → Pool C (contract sendiri)

V4: PoolManager (satu contract berisi semua pool)
     ├── Pool A (library call)
     ├── Pool B (library call)
     └── Pool C (library call)
```

Pool di V4 diimplementasikan sebagai **Solidity library**, bukan contract terpisah:

```solidity
// Pool sebagai Library
library Pool {
    function initialize(State storage self, ...) { ... }
    function swap(State storage self, ...) { ... }
    function modifyPosition(State storage self, ...) { ... }
}

// PoolManager menggunakan library
contract PoolManager {
    using Pools for *;
    mapping(PoolId id => Pool.State) internal pools;

    function swap(PoolId id, ...) {
        pools[id].swap(...); // Library call, bukan external call
    }
}
```

**Keuntungan Singleton Design:**

- Tidak perlu deploy contract baru untuk setiap pool
- Multi-hop swap lebih murah (tidak perlu transfer token antar contract)
- Memungkinkan Flash Accounting

### 1.2.2 Flash Accounting

Di V3, setiap swap (termasuk multi-hop) harus melakukan transfer token ERC-20 di setiap langkah. Ini mahal karena setiap `transfer()` adalah external call ke contract token.

Dengan Flash Accounting di V4, token hanya ditransfer di **awal dan akhir** transaksi. Langkah-langkah di tengah hanya menghitung "utang" (balance delta) tanpa transfer nyata.

```
Contoh: Swap ETH → DAI via USDC (multi-hop)

V3 (3x transfer):
  1. ETH masuk ke pool ETH/USDC
  2. USDC keluar dari pool ETH/USDC, masuk ke pool USDC/DAI
  3. DAI keluar dari pool USDC/DAI ke user

V4 (2x transfer saja):
  1. ETH masuk ke PoolManager
  2. PoolManager hitung output USDC (tanpa transfer)
  3. PoolManager hitung output DAI dari USDC (tanpa transfer)
  4. DAI keluar ke user
```

### 1.2.3 Mekanisme Unlock (Locking)

Untuk menjamin atomicity, V4 menggunakan mekanisme **unlock**. Semua operasi penting (swap, modifikasi likuiditas) harus dilakukan dalam konteks "unlock":

```solidity
function unlock(bytes calldata data) external returns (bytes memory result) {
    if (Lock.isUnlocked()) revert AlreadyUnlocked();

    Lock.unlock();

    // Callback ke pemanggil untuk melakukan operasi
    result = IUnlockCallback(msg.sender).unlockCallback(data);

    // Pastikan semua saldo sudah diselesaikan
    if (NonZeroDeltaCount.read() != 0) revert CurrencyNotSettled();
    Lock.lock();
}
```

**Alur unlock:**

1. Periphery contract memanggil `unlock()` pada PoolManager
2. PoolManager membuka kunci dan memanggil `unlockCallback()` pada periphery
3. Di dalam callback, periphery melakukan swap/modifikasi likuiditas
4. Setelah callback selesai, PoolManager memastikan tidak ada saldo yang belum diselesaikan
5. PoolManager mengunci dirinya kembali

### 1.2.4 Transient Storage (EIP-1153)

V4 menggunakan **Transient Storage** untuk efisiensi gas. Ini adalah lokasi penyimpanan baru di EVM (selain storage, memory, calldata) yang:

- Hanya bertahan selama **satu transaksi**
- Sangat murah untuk baca/tulis dibanding storage biasa
- Sempurna untuk data sementara seperti status lock dan balance delta

```solidity
library Lock {
    uint256 constant IS_UNLOCKED_SLOT = uint256(keccak256("Unlocked")) - 1;

    function unlock() internal {
        assembly { tstore(IS_UNLOCKED_SLOT, true) }
    }

    function lock() internal {
        assembly { tstore(IS_UNLOCKED_SLOT, false) }
    }

    function isUnlocked() internal view returns (bool unlocked) {
        assembly { unlocked := tload(IS_UNLOCKED_SLOT) }
    }
}
```

### 1.2.5 ERC-6909 Claim Tokens

ERC-6909 adalah standar multi-token sederhana. Di V4, ini digunakan untuk **claim tokens** — representasi kepemilikan token yang disimpan di PoolManager.

Trader yang sering melakukan swap bisa memilih untuk **tidak menarik token** dari PoolManager. Sebagai gantinya, PoolManager menerbitkan ERC-6909 claim token yang mewakili saldo mereka. Swap berikutnya cukup burn/mint claim token tanpa transfer ERC-20 yang mahal.

**Keuntungan:**
- Tidak perlu external call ke contract ERC-20
- Gas cost konstan tanpa terpengaruh logika custom token (misalnya blacklist USDC)
- Cocok untuk trader high-frequency

---

## 1.3 Hooks dalam Uniswap V4

### 1.3.1 Jenis-jenis Hook

Hook bisa mengimplementasikan subset dari fungsi-fungsi berikut:

| Hook Function | Kapan Dipanggil |
|---------------|-----------------|
| `beforeInitialize` | Sebelum pool diinisialisasi |
| `afterInitialize` | Setelah pool diinisialisasi |
| `beforeAddLiquidity` | Sebelum likuiditas ditambahkan |
| `afterAddLiquidity` | Setelah likuiditas ditambahkan |
| `beforeRemoveLiquidity` | Sebelum likuiditas dihapus |
| `afterRemoveLiquidity` | Setelah likuiditas dihapus |
| `beforeSwap` | Sebelum swap dilakukan |
| `afterSwap` | Setelah swap dilakukan |
| `beforeDonate` | Sebelum donasi ke LP |
| `afterDonate` | Setelah donasi ke LP |
| `beforeSwapReturnDelta` | beforeSwap yang bisa bypass swap logic |
| `afterSwapReturnDelta` | afterSwap yang bisa modifikasi output |
| `afterAddLiquidityReturnDelta` | afterAddLiquidity dengan delta kustom |
| `afterRemoveLiquidityReturnDelta` | afterRemoveLiquidity dengan delta kustom |

**Donate** adalah fungsi untuk langsung memberikan tip ke LP yang sedang aktif (in-range). Hook bisa memanfaatkan ini untuk mekanisme distribusi reward.

### 1.3.2 Hook Address Bitmap

PoolManager mengetahui fungsi hook mana yang diimplementasikan berdasarkan **bit tertentu di address** contract hook.

Setiap hook function punya flag yang merepresentasikan bit tertentu di address. Misalnya:

```
Address: 0x...0090
Binary (8 bit terakhir): 1001 0000

Bit ke-5 = 1 → AFTER_DONATE_FLAG aktif
Bit ke-8 = 1 → BEFORE_SWAP aktif
```

Saat deploy hook ke network sungguhan, kamu perlu **mining address** yang bit-bitnya sesuai dengan fungsi yang kamu implementasikan. Untuk testing lokal, Foundry punya cheat code `deployCodeTo` yang memungkinkan deploy ke address manapun.

Daftar lengkap flags: [Hooks.sol di v4-core](https://github.com/Uniswap/v4-core/blob/main/src/libraries/Hooks.sol)

### 1.3.3 Alur Swap dengan Hooks

```
1. User → Periphery (SwapRouter)
2. Periphery → PoolManager.unlock()
3. PoolManager → Periphery.unlockCallback()
4. Periphery → PoolManager.swap()
5. PoolManager → Hook.beforeSwap() (jika aktif)
6. PoolManager menjalankan swap logic
7. PoolManager → Hook.afterSwap() (jika aktif)
8. BalanceDelta dikembalikan ke Periphery
9. Periphery menyelesaikan saldo (transfer token)
10. PoolManager memastikan tidak ada saldo pending, lalu lock
```

### 1.3.4 BalanceDelta

`BalanceDelta` adalah dua nilai `int128` yang merepresentasikan perubahan saldo `amount0` dan `amount1` **dari perspektif user**:

- **Nilai positif** = PoolManager berhutang ke user (user menerima token)
- **Nilai negatif** = User berhutang ke PoolManager (user mengirim token)

Saldo bisa diselesaikan dengan dua cara:
1. Transfer token ERC-20 secara langsung
2. Mint/burn ERC-6909 claim token

---

## 1.4 Ticks dan sqrtPriceX96

### 1.4.1 Apa itu Tick?

Uniswap V3/V4 menggunakan **concentrated liquidity** dengan pricing curve yang terbatas (finite). Curve ini dipecah menjadi titik-titik diskrit yang disebut **ticks**.

Setiap tick merepresentasikan harga spesifik:

```
Harga pada tick i = 1.0001^i
```

**Contoh:**
- Tick = 0: harga = 1.0001^0 = 1 (kedua token bernilai sama)
- Tick = 10: harga = 1.0001^10 ≈ 1.001 (Token 0 sedikit lebih mahal)
- Tick = -10: harga = 1.0001^-10 ≈ 0.999 (Token 1 sedikit lebih mahal)

Angka 1.0001 dipilih karena setiap tick bergerak **1 basis point (0.01%)** — satuan yang umum dalam dunia keuangan.

**Token 0 vs Token 1**: Ditentukan berdasarkan sorting lexicographic dari address contract. Address yang lebih kecil menjadi Token 0. Native token (ETH) selalu menjadi Token 0 karena direpresentasikan oleh `address(0)`.

**Tick spacing**: Jarak minimum antar tick yang bisa digunakan. Misalnya jika tick spacing = 60, maka trade hanya bisa terjadi di tick ..., -120, -60, 0, 60, 120, ...

### 1.4.2 sqrtPriceX96 (Q64.96)

Solidity tidak mendukung floating point. Untuk perhitungan harga di dalam contract, Uniswap menggunakan **Q64.96 notation** — format fixed-point yang menggunakan 64 bit untuk integer dan 96 bit untuk pecahan.

```
Nilai Q64.96 = Nilai desimal × 2^96
```

Contoh: angka 1.000234 tidak bisa disimpan di Solidity secara langsung. Tapi dalam Q64.96:
```
1.000234 × 2^96 = 79246701904292675448540839620 (bisa disimpan sebagai uint256)
```

**Kenapa hook developer perlu tahu ini?**

Parameter `sqrtPriceLimitX96` dalam `SwapParams` menggunakan format ini untuk menentukan batas slippage:

```solidity
struct SwapParams {
    int24 tickSpacing;
    bool zeroForOne;
    int256 amountSpecified;
    uint160 sqrtPriceLimitX96; // Batas slippage dalam format Q64.96
}
```

Saat membangun hook seperti onchain orderbook, kamu perlu mengkonversi antara harga yang user-friendly dan `sqrtPriceLimitX96`.

---

## 1.5 Membangun Hook Pertama: Points Hook

### 1.5.1 Deskripsi

Kita akan membuat hook sederhana yang memberikan **POINTS token (ERC-1155)** ke user sebagai insentif saat mereka membeli TOKEN dengan ETH.

**Aturan:**
- Pool: ETH ↔ TOKEN
- Ketika user swap ETH → TOKEN, mereka dapat POINTS = 20% dari jumlah ETH yang diswap
- POINTS diterbitkan sebagai ERC-1155 token

**Repository**: [github.com/haardikk21/points-hook](https://github.com/haardikk21/points-hook)

### 1.5.2 Kenapa afterSwap?

Kita perlu mengetahui **berapa ETH yang benar-benar dihabiskan** user. Ada dua jenis swap:

1. **Exact Input for Output**: User tentukan jumlah ETH yang mau dijual (`amountSpecified < 0`)
2. **Exact Output for Input**: User tentukan jumlah TOKEN yang mau dibeli (`amountSpecified > 0`)

Untuk kasus ke-2, kita tidak tahu pasti berapa ETH yang dihabiskan sampai swap selesai. `afterSwap` menyediakan `BalanceDelta` yang berisi jumlah pasti, sementara `beforeSwap` tidak.

### 1.5.3 Setup Foundry

```bash
forge init points-hook
cd points-hook
forge install https://github.com/Uniswap/v4-periphery
forge remappings > remappings.txt
rm ./**/Counter*.sol
```

Konfigurasi `foundry.toml`:

```toml
solc_version = '0.8.26'
evm_version = "cancun"
optimizer_runs = 800
via_ir = false
ffi = true
```

### 1.5.4 Kode Hook

`src/PointsHook.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {ERC1155} from "solmate/src/tokens/ERC1155.sol";

import {Currency} from "v4-core/types/Currency.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId} from "v4-core/types/PoolId.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {SwapParams, ModifyLiquidityParams} from "v4-core/types/PoolOperation.sol";

import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

import {Hooks} from "v4-core/libraries/Hooks.sol";

contract PointsHook is BaseHook, ERC1155 {
    constructor(
        IPoolManager _manager
    ) BaseHook(_manager) {}

    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: false,
                afterInitialize: false,
                beforeAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterAddLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: false,
                afterSwap: true, // Kita hanya butuh afterSwap
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    function uri(uint256) public view virtual override returns (string memory) {
        return "https://api.example.com/token/{id}";
    }

    // Helper: mint points ke user
    function _assignPoints(
        PoolId poolId,
        bytes calldata hookData,
        uint256 points
    ) internal {
        if (hookData.length == 0) return;
        address user = abi.decode(hookData, (address));
        if (user == address(0)) return;

        uint256 poolIdUint = uint256(PoolId.unwrap(poolId));
        _mint(user, poolIdUint, points, "");
    }

    function _afterSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata swapParams,
        BalanceDelta delta,
        bytes calldata hookData
    ) internal override returns (bytes4, int128) {
        // Hanya untuk pool ETH-TOKEN (currency0 harus native/ETH)
        if (!key.currency0.isAddressZero()) return (this.afterSwap.selector, 0);

        // Hanya saat user membeli TOKEN dengan ETH (zeroForOne)
        if (!swapParams.zeroForOne) return (this.afterSwap.selector, 0);

        // Hitung 20% dari ETH yang dihabiskan
        uint256 ethSpendAmount = uint256(int256(-delta.amount0()));
        uint256 pointsForSwap = ethSpendAmount / 5;

        _assignPoints(key.toId(), hookData, pointsForSwap);

        return (this.afterSwap.selector, 0);
    }
}
```

**Penjelasan kode:**

| Bagian | Fungsi |
|--------|--------|
| `BaseHook` | Abstract contract dari v4-periphery, base untuk semua hook |
| `ERC1155` | Token multi-asset untuk menerbitkan POINTS |
| `getHookPermissions` | Mendeklarasikan hook mana yang aktif (hanya `afterSwap`) |
| `hookData` | Data arbitrary dari user, berisi address penerima points |
| `delta.amount0()` | Jumlah ETH yang dihabiskan (negatif = keluar dari wallet user) |

> **Catatan**: Parameter `sender` di hook function berisi address **router contract**, bukan user. Untuk mendapatkan address user, gunakan `hookData`.

### 1.5.5 Testing

`test/PointsHook.t.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";

import {Deployers} from "@uniswap/v4-core/test/utils/Deployers.sol";
import {PoolSwapTest} from "v4-core/test/PoolSwapTest.sol";
import {MockERC20} from "solmate/src/test/utils/mocks/MockERC20.sol";

import {PoolManager} from "v4-core/PoolManager.sol";
import {SwapParams, ModifyLiquidityParams} from "v4-core/types/PoolOperation.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

import {Currency, CurrencyLibrary} from "v4-core/types/Currency.sol";
import {PoolId} from "v4-core/types/PoolId.sol";

import {Hooks} from "v4-core/libraries/Hooks.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {SqrtPriceMath} from "v4-core/libraries/SqrtPriceMath.sol";
import {LiquidityAmounts} from "@uniswap/v4-core/test/utils/LiquidityAmounts.sol";

import {ERC1155TokenReceiver} from "solmate/src/tokens/ERC1155.sol";

import "forge-std/console.sol";
import {PointsHook} from "../src/PointsHook.sol";

contract TestPointsHook is Test, Deployers, ERC1155TokenReceiver {

    MockERC20 token;

    Currency ethCurrency = Currency.wrap(address(0));
    Currency tokenCurrency;

    PointsHook hook;

    function setUp() public {
        // Deploy PoolManager dan router
        deployFreshManagerAndRouters();

        // Deploy token
        token = new MockERC20("Test Token", "TEST", 18);
        tokenCurrency = Currency.wrap(address(token));
        token.mint(address(this), 1000 ether);
        token.mint(address(1), 1000 ether);

        // Deploy hook ke address yang sesuai flag
        uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);
        deployCodeTo("PointsHook.sol", abi.encode(manager), address(flags));
        hook = PointsHook(address(flags));

        // Approve token
        token.approve(address(swapRouter), type(uint256).max);
        token.approve(address(modifyLiquidityRouter), type(uint256).max);

        // Inisialisasi pool ETH/TOKEN
        (key, ) = initPool(
            ethCurrency,
            tokenCurrency,
            hook,
            3000,
            SQRT_PRICE_1_1
        );

        // Tambah likuiditas
        uint160 sqrtPriceAtTickLower = TickMath.getSqrtPriceAtTick(-60);
        uint160 sqrtPriceAtTickUpper = TickMath.getSqrtPriceAtTick(60);

        uint256 ethToAdd = 0.003 ether;
        uint128 liquidityDelta = LiquidityAmounts.getLiquidityForAmount0(
            SQRT_PRICE_1_1,
            sqrtPriceAtTickUpper,
            ethToAdd
        );

        modifyLiquidityRouter.modifyLiquidity{value: ethToAdd}(
            key,
            ModifyLiquidityParams({
                tickLower: -60,
                tickUpper: 60,
                liquidityDelta: int256(uint256(liquidityDelta)),
                salt: bytes32(0)
            }),
            ZERO_BYTES
        );
    }

    function test_swap() public {
        uint256 poolIdUint = uint256(PoolId.unwrap(key.toId()));
        uint256 pointsBalanceOriginal = hook.balanceOf(address(this), poolIdUint);

        bytes memory hookData = abi.encode(address(this));

        // Swap 0.001 ETH → TOKEN
        // Harusnya dapat 20% × 0.001e18 = 2e14 POINTS
        swapRouter.swap{value: 0.001 ether}(
            key,
            SwapParams({
                zeroForOne: true,
                amountSpecified: -0.001 ether,
                sqrtPriceLimitX96: TickMath.MIN_SQRT_PRICE + 1
            }),
            PoolSwapTest.TestSettings({
                takeClaims: false,
                settleUsingBurn: false
            }),
            hookData
        );

        uint256 pointsBalanceAfterSwap = hook.balanceOf(address(this), poolIdUint);
        assertEq(pointsBalanceAfterSwap - pointsBalanceOriginal, 2 * 10 ** 14);
    }
}
```

**Jalankan test:**

```bash
forge test
```

### 1.5.6 Deploy Hook

Untuk deploy ke network sungguhan, kamu perlu mining address yang sesuai dengan hook flags. Gunakan `HookMiner` library untuk ini.

```solidity
// script/DeployHook.s.sol
contract DeployHook is Script {
    function run() external {
        uint privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        // TODO: Gunakan HookMiner untuk generate salt yang valid
        PointsHook hook = new PointsHook();

        vm.stopBroadcast();
    }
}
```

```bash
forge script script/DeployHook.s.sol --rpc-url $RPC_URL --chain-id 1 --broadcast
```

> **Tips Testing Foundry:**

| Perintah | Fungsi |
|----------|--------|
| `forge test` | Jalankan semua test |
| `forge test --mc TestPointsHook` | Jalankan test contract tertentu |
| `forge test --mt test_swap` | Jalankan test function tertentu |
| `forge test -vv` | Tampilkan console.log output |
| `forge test -vvvv` | Tampilkan detail trace |
| `forge test --gas-report` | Laporan gas per function |

---

## 1.6 Dynamic Fees

### 1.6.1 Konsep Dynamic Fees

Dynamic fees memungkinkan pool menyesuaikan biaya swap berdasarkan kondisi tertentu. Ada dua cara mengupdate fees:

1. **`poolManager.updateDynamicLPFee()`** — untuk update yang tidak perlu setiap swap (misalnya per block)
2. **Return override fee dari `beforeSwap`** — untuk update per-swap

Saat menginisialisasi pool, gunakan flag `LPFeeLibrary.DYNAMIC_FEE_FLAG` sebagai fee agar pool mendukung dynamic fees.

### 1.6.2 Contoh: Gas Price Based Fees

Hook ini menyesuaikan fee berdasarkan rata-rata gas price:

- Gas price ≈ rata-rata → charge BASE_FEE (0.5%)
- Gas price > 110% rata-rata → charge setengah fee (gas mahal, kasihan swapper)
- Gas price < 90% rata-rata → charge double fee (gas murah, LP bisa charge lebih)

**Repository**: [github.com/haardikk21/gas-price-hook](https://github.com/haardikk21/gas-price-hook)

```solidity
contract GasPriceFeesHook is BaseHook {
    using LPFeeLibrary for uint24;

    uint128 public movingAverageGasPrice;
    uint104 public movingAverageGasPriceCount;
    uint24 public constant BASE_FEE = 5000; // 0.5%

    error MustUseDynamicFee();

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {
        updateMovingAverage();
    }

    function getHookPermissions() public pure override
        returns (Hooks.Permissions memory)
    {
        return Hooks.Permissions({
            beforeInitialize: true,  // Pastikan pool pakai dynamic fee
            afterInitialize: false,
            beforeAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterAddLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,        // Override fee sebelum swap
            afterSwap: true,         // Update moving average setelah swap
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function _beforeInitialize(address, PoolKey calldata key, uint160)
        internal pure override returns (bytes4)
    {
        if (!key.fee.isDynamicFee()) revert MustUseDynamicFee();
        return this.beforeInitialize.selector;
    }

    function updateMovingAverage() internal {
        uint128 gasPrice = uint128(tx.gasprice);
        movingAverageGasPrice =
            ((movingAverageGasPrice * movingAverageGasPriceCount) + gasPrice) /
            (movingAverageGasPriceCount + 1);
        movingAverageGasPriceCount++;
    }

    function getFee() internal view returns (uint24) {
        uint128 gasPrice = uint128(tx.gasprice);
        if (gasPrice > (movingAverageGasPrice * 11) / 10) {
            return BASE_FEE / 2;   // Gas tinggi → fee rendah
        }
        if (gasPrice < (movingAverageGasPrice * 9) / 10) {
            return BASE_FEE * 2;   // Gas rendah → fee tinggi
        }
        return BASE_FEE;
    }

    function _beforeSwap(address, PoolKey calldata, SwapParams calldata, bytes calldata)
        internal view override returns (bytes4, BeforeSwapDelta, uint24)
    {
        uint24 fee = getFee();
        uint24 feeWithFlag = fee | LPFeeLibrary.OVERRIDE_FEE_FLAG;
        return (this.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, feeWithFlag);
    }

    function _afterSwap(address, PoolKey calldata, SwapParams calldata, BalanceDelta, bytes calldata)
        internal override returns (bytes4, int128)
    {
        updateMovingAverage();
        return (this.afterSwap.selector, 0);
    }
}
```

### 1.6.3 Nezlobin Directional Fee (Konseptual)

Masalah utama LP: **impermanent loss** yang disebabkan oleh **toxic order flow** (arbitrageur mendominasi trading volume).

**Ide Nezlobin**: Gunakan dynamic fees yang **tidak simetris** berdasarkan arah swap:

- Jika harga bergerak naik → naikkan fee untuk beli (arbitrageur biasanya beli)
- Turunkan fee untuk jual (mendorong rebalancing dari trader biasa)

Simulasi Nezlobin menunjukkan pengurangan kerugian LP hingga **13.1%** dan peningkatan total fees LP hingga **9.2%**.

**Cara implementasi:**
1. Tracking perubahan tick per-block (simpan `lastTick` per pool)
2. Di `beforeSwap`, hitung selisih tick dari block sebelumnya (Delta)
3. Hitung adjustment `c * Delta` dimana `c < fee/Delta`
4. Naikkan fee di arah yang merugikan LP, turunkan di arah sebaliknya

---

## 1.7 Limit Orders (Take-Profit)

### 1.7.1 Konsep

Take-profit order: "Jual 1 ETH ketika harganya naik ke 4000 USDC"

**Mekanisme:**
1. Alice menempatkan order di hook untuk menjual Token A pada tick tertentu
2. Bob melakukan swap normal yang menggerakkan tick
3. `afterSwap` mengecek apakah tick sudah melewati order Alice
4. Jika ya, hook melakukan swap tambahan untuk memenuhi order Alice
5. Alice bisa klaim output token nanti

**Repository**: [github.com/haardikk21/take-profits-hook](https://github.com/haardikk21/take-profits-hook)

### 1.7.2 Desain Penting

**Kenapa afterSwap, bukan beforeSwap?**
Eksekusi order akan menggerakkan tick lebih jauh. Melakukannya di `beforeSwap` akan memengaruhi swap Bob. Kita ingin swap Bob berjalan normal, baru eksekusi order setelahnya.

**Masalah rekursi**: `afterSwap` memicu swap baru yang memicu `afterSwap` lagi. Solusi: cek apakah `sender == address(this)` dan skip jika ya.

**Masalah tick shift**: Setiap order yang dieksekusi menggerakkan tick. Order yang tadinya eligible bisa jadi tidak eligible lagi setelah order sebelumnya dieksekusi.

```solidity
// Contoh masalah tick shift:
// Tick awal: 500, Order Alice di tick 550 dan 600
// Swap Bob: tick naik ke 650
// Eksekusi order di tick 550 → tick turun (mungkin di bawah 600)
// Order di tick 600 tidak bisa dieksekusi lagi!
```

**Solusi**: Loop `while` yang mengecek ulang tick setelah setiap eksekusi:

```solidity
function afterSwap(...) external override returns (bytes4, int128) {
    if (sender == address(this)) return (this.afterSwap.selector, 0);

    bool tryMore = true;
    int24 currentTick;

    while (tryMore) {
        (tryMore, currentTick) = tryExecutingOrders(key, !params.zeroForOne);
    }

    lastTicks[key.toId()] = currentTick;
    return (this.afterSwap.selector, 0);
}
```

### 1.7.3 Fitur Utama

- **placeOrder**: User menempatkan order, menyetor input token, menerima ERC-1155 claim token
- **cancelOrder**: User membatalkan order, menerima kembali input token, burn claim token
- **redeem**: Setelah order tereksekusi, user menukar claim token dengan output token
- **afterSwap**: Mengecek dan mengeksekusi pending orders berdasarkan pergerakan tick

---

## 1.8 Return Delta Hooks (Custom Curve)

### 1.8.1 Konsep

Return Delta hooks adalah hook yang bisa **memodifikasi atau sepenuhnya bypass** core swap logic di PoolManager. Ini memungkinkan kamu membuat **custom pricing curve**.

`beforeSwapReturnDelta` bisa mengembalikan `BeforeSwapDelta` yang mengubah `amountToSwap`:

```
Alur normal: amountToSwap = params.amountSpecified
Dengan return delta: amountToSwap = params.amountSpecified + hookDeltaSpecified
```

Jika hook "mengonsumsi" seluruh input → `amountToSwap = 0` → core swap logic **di-skip sepenuhnya**.

### 1.8.2 BeforeSwapDelta vs BalanceDelta

| | BalanceDelta | BeforeSwapDelta |
|--|-------------|-----------------|
| Format | `(amount0, amount1)` | `(amountSpecified, amountUnspecified)` |
| Sorting | Selalu Token 0, Token 1 | Berdasarkan token mana yang di-specify user |

Contoh: Exact Input swap ETH→USDC (`zeroForOne = true, amountSpecified = -1 ETH`)
- Specified token = ETH (Token 0)
- Unspecified token = USDC (Token 1)

### 1.8.3 Contoh: CSMM (Constant Sum Market Maker)

CSMM trading 1:1 — kirim 5 Token A, dapat 5 Token B. Sederhana tapi bagus untuk demo.

**Repository**: [github.com/haardikk21/csmm-noop-hook](https://github.com/haardikk21/csmm-noop-hook)

**Poin penting implementasi:**

1. **Disable default liquidity**: Hook revert di `beforeAddLiquidity`, buat fungsi `addLiquidity` sendiri
2. **Custom liquidity management**: Hook menyimpan token di PoolManager sebagai ERC-6909 claim token
3. **beforeSwap**: Return BeforeSwapDelta `(-amountSpecified, +amountSpecified)` untuk swap 1:1

```solidity
// Inti dari beforeSwap CSMM
BeforeSwapDelta beforeSwapDelta = toBeforeSwapDelta(
    int128(-params.amountSpecified), // Konsumsi input
    int128(params.amountSpecified)   // Berikan output yang sama
);

if (params.zeroForOne) {
    key.currency0.take(poolManager, address(this), amountInOutPositive, true);
    key.currency1.settle(poolManager, address(this), amountInOutPositive, true);
} else {
    key.currency0.settle(poolManager, address(this), amountInOutPositive, true);
    key.currency1.take(poolManager, address(this), amountInOutPositive, true);
}
```

> **Peringatan**: CSMM hanya untuk pembelajaran. Dalam produksi, asumsikan aset selalu trading 1:1 adalah berbahaya (ingat UST/Terra Luna).

---

## 1.9 MEV Protection

### 1.9.1 Sandwich Attack

Sandwich attack terjadi ketika MEV searcher:

1. **Frontrun**: Beli token sebelum swap user, naikkan harga
2. **User swap**: User mendapat harga lebih buruk (sesuai slippage limit)
3. **Backrun**: Searcher jual token di harga lebih tinggi, profit

### 1.9.2 Async Swaps (Mitigasi Sandwich)

Sandwich attack hanya berhasil jika frontrun → swap → backrun terjadi dalam satu block. Dengan **async swap**, kita bisa:

1. Lock input token di hook saat `beforeSwap` (bypass swap)
2. Eksekusi swap di block berikutnya secara acak (melalui offchain processor)
3. Searcher tidak tahu kapan swap sebenarnya terjadi → tidak bisa sandwich

### 1.9.3 Coincidence of Wants (CoW)

CoW memungkinkan matching order secara peer-to-peer tanpa lewat AMM:

- Alice mau jual ETH → DAI
- Bob mau jual DAI → ETH
- Mereka bisa trade langsung: **zero slippage, zero LP fees**

**Implementasi dengan hooks:**
1. User bisa signal kesediaan menunggu (via `hookData`)
2. `beforeSwap` cek apakah ada pending order yang bisa di-match
3. Jika match: eksekusi P2P, bypass AMM
4. Jika tidak match dan user mau tunggu: simpan order, bypass swap
5. Jika tidak match dan user tidak mau tunggu: swap normal lewat AMM

---

## 1.10 Custom Router

### 1.10.1 Apa itu Router?

Router adalah periphery contract yang menjadi perantara antara user dan PoolManager. Semua router mengikuti pattern **unlock → callback → settle**:

```
User → Router.swap()
        → PoolManager.unlock()
        → Router.unlockCallback()
            → PoolManager.swap()
            → Settle balances
        → PoolManager.lock()
```

### 1.10.2 Kapan Pakai Router vs Hook?

| Gunakan Router | Gunakan Hook |
|----------------|-------------|
| Interaksi dengan multiple pool | Modifikasi perilaku pool tertentu |
| Integrasi dengan protocol eksternal (bridge, aggregator) | Logika yang auto-run untuk setiap swap |
| Fitur UX (batching, multi-hop) | Dynamic fees, limit orders, MEV protection |
| User-facing interface | State tracking per-pool |

### 1.10.3 Contoh: Swap & Bridge Router

Router yang melakukan swap di Uniswap lalu bridge output token ke Optimism L2 dalam satu transaksi.

**Repository**: [github.com/haardikk21/v4-swap-bridge-router](https://github.com/haardikk21/v4-swap-bridge-router)

---

## 1.11 Keamanan Hook

### 1.11.1 Kenapa Keamanan Hook Sangat Penting

Hook yang vulnerable bisa **mengkompromi semua pool** yang menggunakannya. Fakta bahwa hook terintegrasi dengan Uniswap V4 yang sudah diaudit **tidak berarti hook kamu aman**.

### 1.11.2 Vulnerability Umum

**1. Permission Mismatch**

Pastikan hook address flags sesuai dengan fungsi yang benar-benar diimplementasikan.

**2. Reentrancy**

Ikuti pattern **Checks-Effects-Interactions**: update state sebelum external call.

```solidity
// SALAH - external call sebelum update state
rewardsToken.transfer(sender, rewards);
pendingRewards[sender] = 0;

// BENAR - update state dulu
pendingRewards[sender] = 0;
rewardsToken.transfer(sender, rewards);
```

**3. First Depositor Attack**

Saat hook mengelola likuiditas sendiri, attacker bisa manipulasi share price di deposit pertama. Solusi: minimum deposit dan dead shares.

**4. Dynamic Fee Manipulation**

Jangan gunakan data yang bisa dimanipulasi dalam satu transaksi (current pool price, block.timestamp) untuk menentukan fee. Gunakan TWAP atau data historis, dan selalu beri batas min/max fee.

**5. Unvalidated Pool State**

Jangan buat keputusan berdasarkan current tick yang bisa dimanipulasi via flash loan. Gunakan snapshot dari block sebelumnya.

### 1.11.3 Checklist Keamanan

- [ ] Hook address bits sesuai dengan permissions yang diimplementasikan
- [ ] Hanya PoolManager yang bisa memanggil hook functions
- [ ] State changes terjadi sebelum external calls
- [ ] Reentrancy guard pada fungsi yang modifikasi state
- [ ] Semua input divalidasi (termasuk cek `hookData.length`)
- [ ] Semua balance delta diselesaikan dengan benar
- [ ] Fuzz testing untuk operasi numerik
- [ ] Integration test dengan PoolManager sungguhan

### 1.11.4 Uniswap Foundation Security Fund

Uniswap Foundation menyediakan dana **$1M USD** untuk mensubsidi audit keamanan hook. Project yang eligible bisa mendapat coverage **hingga 100%** biaya audit.

**Referensi keamanan:**
- [Uniswap V4 Hooks Security Deep Dive (Cyfrin)](https://www.cyfrin.io/)
- [Solodit - Database Vulnerability Smart Contract](https://solodit.xyz/)
- [Uniswap Foundation Security Fund](https://gov.uniswap.org/)

---

## 1.12 Concern Umum Uniswap V4

### 1.12.1 Gas Cost

Hook dengan logika kompleks (onchain orderbook) bisa meningkatkan gas cost signifikan. Tapi:
- Pool populer akan tetap punya versi tanpa hook
- User yang pakai hook pool memang mencari fungsionalitas spesifik
- Di L2, perbedaan gas cost tidak terlalu terasa

### 1.12.2 Liquidity Fragmentation

Pool di V4 diidentifikasi oleh 5 hal: Token 0, Token 1, Hook Address, Tick Spacing, Swap Fees. Ini berarti bisa ada banyak pool untuk token pair yang sama.

Tapi ini sudah terjadi di V3 (beda tick spacing/fees), dan solver seperti UniswapX akan menemukan route optimal.

### 1.12.3 BSL License

Sebagian v4-core menggunakan Business Source License. Tapi:
- v4-periphery (yang dipakai hook developer) sepenuhnya MIT
- BSL akan expire (seperti V3 yang BSL-nya sudah expire 2023)
- Tujuannya mencegah fork low-effort, bukan membatasi developer

---

## 1.13 Kesimpulan

Di panduan ini, kamu telah belajar:

1. **Arsitektur V4** — Singleton PoolManager, Flash Accounting, Transient Storage, ERC-6909
2. **Hooks** — 14 jenis hook function, address bitmap, alur swap dengan hooks
3. **Ticks & Pricing** — Discrete pricing curve, Q64.96 notation, sqrtPriceX96
4. **Points Hook** — Hook pertama dengan ERC-1155 rewards
5. **Testing & Deploy** — Foundry test suite, deployCodeTo, HookMiner, forge script
6. **Dynamic Fees** — Gas price based fees, Nezlobin Directional Fee
7. **Limit Orders** — Take-profit orders, tick tracking, order execution di afterSwap
8. **Return Delta** — Custom pricing curve (CSMM), BeforeSwapDelta
9. **MEV Protection** — Async swaps, Coincidence of Wants
10. **Custom Router** — Swap & Bridge, pattern unlock callback
11. **Keamanan** — Vulnerability umum, checklist, Security Fund

**Langkah selanjutnya:**
- Eksplorasi [v4-core](https://github.com/Uniswap/v4-core) dan [v4-periphery](https://github.com/Uniswap/v4-periphery) source code
- Bangun hook kamu sendiri — mulai dari ide sederhana
- Join komunitas Uniswap untuk diskusi dan feedback
- Pertimbangkan audit sebelum deploy ke mainnet (manfaatkan Security Fund!)
- Cek [Uniswap V4 Documentation](https://docs.uniswap.org/) untuk referensi terbaru

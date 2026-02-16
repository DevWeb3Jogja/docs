---
title: Smart Contract Upgradeable (UUPS Pattern)
sidebar_label: UUPS Upgradeable
sidebar_position: 2
---

# Smart Contract Upgradeable (UUPS Pattern)

## 1.1 Pendahuluan

### 1.1.1 Apa itu Upgradeable Smart Contract?

Smart contract di blockchain bersifat **immutable** — sekali di-deploy, kodenya tidak bisa diubah. Ini bagus untuk kepercayaan, tapi menjadi masalah ketika kamu perlu:

- Memperbaiki bug atau vulnerability
- Menambah fitur baru
- Mengoptimasi penggunaan gas
- Menyesuaikan logika bisnis

Upgradeable smart contract adalah pattern yang memungkinkan kamu **memperbarui logika contract** tanpa mengubah address contract atau kehilangan data yang sudah tersimpan.

### 1.1.2 Kenapa UUPS?

Ada beberapa pattern untuk membuat contract upgradeable. Dua yang paling populer adalah **Transparent Proxy** dan **UUPS (Universal Upgradeable Proxy Standard)**.

**Perbandingan pattern:**

| Fitur | UUPS | Transparent Proxy |
|-------|------|-------------------|
| Logika upgrade | Di implementation contract | Di proxy contract |
| Biaya deploy proxy | Lebih murah | Lebih mahal |
| Biaya gas per call | Lebih murah | Lebih mahal (ada pengecekan admin) |
| Bisa hapus upgradeability | Ya | Tidak |
| Standar | EIP-1822 | EIP-1967 |

**Keunggulan UUPS:**

- **Gas lebih efisien** - Tidak ada pengecekan admin di proxy untuk setiap call
- **Proxy lebih ringan** - Logika upgrade ada di implementation, bukan di proxy
- **Fleksibel** - Bisa menghapus kemampuan upgrade di versi mendatang jika diinginkan
- **Standar modern** - Direkomendasikan oleh OpenZeppelin untuk proyek baru

### 1.1.3 Bagaimana Cara Kerjanya?

Pattern proxy bekerja dengan konsep **delegatecall**:

```
User → Proxy Contract → (delegatecall) → Implementation Contract
         ↑ data                              ↑ logika
         disimpan di sini                     kode dijalankan dari sini
```

**Komponen utama:**

1. **Proxy Contract** - Contract yang menyimpan data (state) dan meneruskan semua call ke implementation
2. **Implementation Contract** - Contract yang berisi logika bisnis (kode yang bisa diganti)
3. **delegatecall** - Mekanisme Solidity yang menjalankan kode contract lain dalam konteks storage pemanggil

**Alur upgrade:**

```
Versi 1:
User → Proxy → (delegatecall) → Implementation V1
                                  - fungsi mint()
                                  - fungsi transfer()

Versi 2 (setelah upgrade):
User → Proxy → (delegatecall) → Implementation V2
                                  - fungsi mint() (diperbaiki)
                                  - fungsi transfer()
                                  - fungsi burn() (baru!)
```

Address proxy tetap sama, data tetap tersimpan, tapi logikanya sudah berubah.

### 1.1.4 Tujuan

Di akhir panduan ini, kamu akan mampu:

- Memahami konsep proxy pattern dan delegatecall
- Menyiapkan proyek Foundry dengan OpenZeppelin Upgradeable
- Menulis smart contract upgradeable menggunakan pattern UUPS
- Men-deploy proxy dan implementation contract menggunakan `forge script`
- Meng-upgrade contract ke versi baru
- Memahami aturan storage layout untuk menghindari data corruption
- Menulis test dalam Solidity untuk contract upgradeable

---

## 1.2 Setup

### 1.2.1 Instalasi

**Prasyarat:**
- Foundry (forge, cast, anvil)
- Code editor (VS Code direkomendasikan)

**Install Foundry** (jika belum):

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**Buat proyek Foundry baru:**

```bash
forge init uups-workshop
cd uups-workshop
```

**Install dependency OpenZeppelin:**

```bash
forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### 1.2.2 Konfigurasi Foundry

Update `foundry.toml` untuk mengatur remapping:

`foundry.toml`

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
    "@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/",
]

[rpc_endpoints]
base_sepolia = "https://sepolia.base.org"
```

**Buat file `.env`:**

`.env`

```bash
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
```

> **Catatan Keamanan**: Jangan pernah commit file `.env` ke version control. Pastikan `.gitignore` sudah mencakup `.env`.

### 1.2.3 Struktur Proyek

```
uups-workshop/
├── src/
│   ├── MyTokenV1.sol          # Implementation versi 1
│   └── MyTokenV2.sol          # Implementation versi 2
├── script/
│   ├── Deploy.s.sol           # Script deploy proxy + implementation
│   └── Upgrade.s.sol          # Script upgrade ke versi baru
├── test/
│   └── MyToken.t.sol          # Test untuk contract upgradeable
├── lib/                       # Dependency (OpenZeppelin, forge-std)
├── foundry.toml
└── .env
```

---

## 1.3 Konsep Dasar

### 1.3.1 Aturan Contract Upgradeable

Ada beberapa aturan penting yang **harus** diikuti saat menulis contract upgradeable:

**1. Tidak boleh ada constructor**

Constructor hanya berjalan sekali saat deploy dan menyimpan data di storage implementation, bukan di proxy. Gunakan fungsi `initialize` sebagai gantinya.

```solidity
// ❌ SALAH - jangan pakai constructor
contract MyToken {
    constructor(string memory name) {
        _name = name;
    }
}

// ✅ BENAR - pakai initializer
contract MyToken is Initializable {
    function initialize(string memory name) public initializer {
        _name = name;
    }
}
```

**2. Harus pakai library upgradeable**

Gunakan `@openzeppelin/contracts-upgradeable` bukan `@openzeppelin/contracts`. Versi upgradeable sudah didesain tanpa constructor.

```solidity
// ❌ SALAH
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ✅ BENAR
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
```

**3. Storage layout tidak boleh berubah**

Saat upgrade, urutan dan tipe variabel state yang sudah ada **tidak boleh diubah**. Variabel baru hanya boleh ditambahkan di akhir.

```solidity
// Versi 1
contract MyTokenV1 {
    uint256 public totalMinted;    // slot 0
    address public admin;          // slot 1
}

// ❌ SALAH - mengubah urutan
contract MyTokenV2 {
    address public admin;          // slot 0 (tadinya totalMinted!)
    uint256 public totalMinted;    // slot 1
}

// ❌ SALAH - menghapus variabel
contract MyTokenV2 {
    address public admin;          // slot 0 (totalMinted hilang!)
}

// ✅ BENAR - tambahkan variabel baru di akhir
contract MyTokenV2 {
    uint256 public totalMinted;    // slot 0 (tetap)
    address public admin;          // slot 1 (tetap)
    uint256 public maxSupply;      // slot 2 (baru)
}
```

### 1.3.2 Initializer vs Constructor

Karena proxy pattern menggunakan delegatecall, constructor di implementation contract **tidak ada efeknya** terhadap data di proxy. Solusinya adalah menggunakan **initializer**.

**Bagaimana initializer bekerja:**

```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyToken is Initializable {
    string public name;

    // Modifier `initializer` memastikan fungsi ini hanya bisa dipanggil sekali
    function initialize(string memory _name) public initializer {
        name = _name;
    }
}
```

- `Initializable` - Base contract dari OpenZeppelin yang menyediakan modifier `initializer`
- `initializer` - Modifier yang memastikan fungsi hanya bisa dipanggil satu kali
- `reinitializer(n)` - Modifier untuk inisialisasi ulang di versi upgrade berikutnya

### 1.3.3 Fungsi _authorizeUpgrade

Di pattern UUPS, logika otorisasi upgrade ada di implementation contract. Kamu **harus** meng-override fungsi `_authorizeUpgrade`:

```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyToken is UUPSUpgradeable, OwnableUpgradeable {
    // Hanya owner yang bisa upgrade contract
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
```

Fungsi ini dipanggil sebelum upgrade dilakukan. Jika tidak ada akses kontrol, **siapa saja bisa meng-upgrade contract kamu** — ini adalah vulnerability kritis.

> **Peringatan**: Selalu tambahkan access control (seperti `onlyOwner`) di `_authorizeUpgrade`. Tanpa ini, contract kamu bisa di-hijack oleh siapa saja.

---

## 1.4 Implementasi

### 1.4.1 Menulis Contract V1

Mari buat token ERC20 upgradeable sederhana dengan fungsi mint.

`src/MyTokenV1.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyTokenV1 is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __ERC20_init("MyToken", "MTK");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
```

**Penjelasan kode:**

| Bagian | Fungsi |
|--------|--------|
| `_disableInitializers()` | Mencegah siapa pun memanggil `initialize` di implementation contract secara langsung |
| `__ERC20_init("MyToken", "MTK")` | Inisialisasi ERC20 dengan nama dan simbol (pengganti constructor) |
| `__Ownable_init(initialOwner)` | Inisialisasi ownership |
| `__UUPSUpgradeable_init()` | Inisialisasi UUPS |
| `onlyOwner` di `mint` | Hanya owner yang bisa mint token |
| `_authorizeUpgrade` | Hanya owner yang bisa upgrade contract |

**Tentang `_disableInitializers()`:**

```solidity
/// @custom:oz-upgrades-unsafe-allow constructor
constructor() {
    _disableInitializers();
}
```

Ini adalah best practice keamanan. Tanpa ini, seseorang bisa memanggil `initialize` langsung di implementation contract (bukan lewat proxy) dan menjadi owner.

**Compile untuk memastikan tidak ada error:**

```bash
forge build
```

### 1.4.2 Men-deploy Contract

Buat script deploy menggunakan `forge script`. Script ini men-deploy implementation, lalu men-deploy ERC1967 proxy yang menunjuk ke implementation tersebut.

`script/Deploy.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {MyTokenV1} from "../src/MyTokenV1.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy implementation contract
        MyTokenV1 implementation = new MyTokenV1();
        console.log("Implementation address:", address(implementation));

        // 2. Encode data untuk memanggil initialize()
        bytes memory initData = abi.encodeCall(
            MyTokenV1.initialize,
            (deployer)
        );

        // 3. Deploy ERC1967 proxy yang menunjuk ke implementation
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            initData
        );
        console.log("Proxy address:", address(proxy));

        // 4. Verifikasi: baca nama token lewat proxy
        MyTokenV1 token = MyTokenV1(address(proxy));
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        console.log("Owner:", token.owner());

        vm.stopBroadcast();
    }
}
```

**Apa yang terjadi saat deploy:**

1. Men-deploy implementation contract (MyTokenV1)
2. Meng-encode call data untuk `initialize(deployer)`
3. Men-deploy ERC1967 proxy yang menunjuk ke implementation dan langsung memanggil `initialize`
4. Memverifikasi bahwa proxy sudah terkonfigurasi dengan benar

**Jalankan deploy:**

```bash
# Deploy ke local Anvil (untuk testing)
# Terminal 1: jalankan local node
anvil

# Terminal 2: jalankan deploy script
source .env
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

# Deploy ke Base Sepolia testnet
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast
```

**Contoh output:**

```
== Logs ==
  Implementation address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  Proxy address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
  Token name: MyToken
  Token symbol: MTK
  Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

> **Penting**: Simpan proxy address! Ini adalah address yang akan dipakai user untuk berinteraksi dan tetap sama setelah upgrade.

### 1.4.3 Menulis Contract V2 (Upgrade)

Sekarang mari buat versi baru dengan fitur tambahan: fungsi `burn` dan variabel `maxSupply`.

`src/MyTokenV2.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyTokenV2 is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    // Variabel baru ditambahkan di akhir (tidak mengubah slot V1)
    uint256 public maxSupply;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __ERC20_init("MyToken", "MTK");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    // Fungsi inisialisasi untuk V2 (dijalankan saat upgrade)
    function initializeV2(uint256 _maxSupply) public reinitializer(2) {
        maxSupply = _maxSupply;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        // Fitur baru: cek maxSupply
        require(
            totalSupply() + amount <= maxSupply,
            "MyTokenV2: melebihi max supply"
        );
        _mint(to, amount);
    }

    // Fitur baru: burn token
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
```

**Perubahan di V2:**

| Perubahan | Penjelasan |
|-----------|------------|
| `uint256 public maxSupply` | Variabel baru, ditambahkan di akhir |
| `initializeV2(uint256 _maxSupply)` | Initializer baru dengan `reinitializer(2)` |
| `mint` diperbarui | Sekarang mengecek `maxSupply` sebelum mint |
| `burn` ditambahkan | Fitur baru untuk membakar token |

**Tentang `reinitializer(2)`:**

```solidity
function initializeV2(uint256 _maxSupply) public reinitializer(2) {
    maxSupply = _maxSupply;
}
```

- `reinitializer(2)` berarti ini adalah inisialisasi versi ke-2
- Hanya bisa dipanggil sekali, seperti `initializer` biasa
- Nomor versi harus naik setiap upgrade (2, 3, 4, ...)

### 1.4.4 Meng-upgrade Contract

Buat script upgrade. Di Foundry, upgrade dilakukan dengan men-deploy implementation baru lalu memanggil `upgradeToAndCall` di proxy.

`script/Upgrade.s.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {MyTokenV2} from "../src/MyTokenV2.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UpgradeScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Ganti dengan proxy address dari deploy sebelumnya
        address proxyAddress = vm.envAddress("PROXY_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy implementation baru
        MyTokenV2 newImplementation = new MyTokenV2();
        console.log("Implementation baru:", address(newImplementation));

        // 2. Encode data untuk memanggil initializeV2()
        bytes memory initV2Data = abi.encodeCall(
            MyTokenV2.initializeV2,
            (1_000_000 ether) // maxSupply: 1 juta token
        );

        // 3. Upgrade proxy ke implementation baru + panggil initializeV2
        UUPSUpgradeable(proxyAddress).upgradeToAndCall(
            address(newImplementation),
            initV2Data
        );

        // 4. Verifikasi upgrade berhasil
        MyTokenV2 upgradedToken = MyTokenV2(proxyAddress);
        console.log("Max Supply:", upgradedToken.maxSupply());
        console.log("Token name:", upgradedToken.name());

        vm.stopBroadcast();
    }
}
```

**Apa yang terjadi saat upgrade:**

1. Men-deploy implementation baru (MyTokenV2)
2. Meng-encode call data untuk `initializeV2(1_000_000 ether)`
3. Memanggil `upgradeToAndCall` di proxy — ini mengganti implementation address dan memanggil `initializeV2` dalam satu transaksi
4. Proxy address **tetap sama**, tapi sekarang menunjuk ke logika V2

**Jalankan upgrade:**

```bash
# Tambahkan PROXY_ADDRESS ke .env
# PROXY_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Upgrade di local Anvil
source .env
forge script script/Upgrade.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

# Upgrade di Base Sepolia testnet
forge script script/Upgrade.s.sol --rpc-url base_sepolia --broadcast
```

**Contoh output:**

```
== Logs ==
  Implementation baru: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
  Max Supply: 1000000000000000000000000
  Token name: MyToken
```

**Verifikasi dengan `cast`:**

Setelah upgrade, kamu bisa memverifikasi langsung dari terminal menggunakan `cast`:

```bash
# Cek nama token (harus tetap "MyToken")
cast call <PROXY_ADDRESS> "name()(string)" --rpc-url http://127.0.0.1:8545

# Cek maxSupply (fitur baru dari V2)
cast call <PROXY_ADDRESS> "maxSupply()(uint256)" --rpc-url http://127.0.0.1:8545

# Cek owner (harus tetap sama)
cast call <PROXY_ADDRESS> "owner()(address)" --rpc-url http://127.0.0.1:8545
```

---

## 1.5 Testing

### 1.5.1 Menulis Test untuk Contract Upgradeable

Foundry menggunakan Solidity untuk test, bukan JavaScript/TypeScript. Test untuk contract upgradeable perlu mensimulasikan deploy proxy, interaksi, dan proses upgrade.

`test/MyToken.t.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {MyTokenV1} from "../src/MyTokenV1.sol";
import {MyTokenV2} from "../src/MyTokenV2.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyTokenTest is Test {
    MyTokenV1 public implementation;
    ERC1967Proxy public proxy;
    MyTokenV1 public token; // proxy yang di-cast ke MyTokenV1

    address public owner = address(this);
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        // Deploy implementation
        implementation = new MyTokenV1();

        // Deploy proxy + initialize
        bytes memory initData = abi.encodeCall(
            MyTokenV1.initialize,
            (owner)
        );
        proxy = new ERC1967Proxy(address(implementation), initData);

        // Cast proxy ke MyTokenV1 untuk kemudahan akses
        token = MyTokenV1(address(proxy));
    }

    // ==================== Test V1 ====================

    function test_V1_NamaDanSimbol() public view {
        assertEq(token.name(), "MyToken");
        assertEq(token.symbol(), "MTK");
    }

    function test_V1_OwnerBisaMint() public {
        token.mint(alice, 100 ether);
        assertEq(token.balanceOf(alice), 100 ether);
    }

    function test_V1_NonOwnerTidakBisaMint() public {
        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(
                OwnableUpgradeable.OwnableUnauthorizedAccount.selector,
                alice
            )
        );
        token.mint(alice, 100 ether);
    }

    function test_V1_TidakBisaInitializeLagi() public {
        vm.expectRevert();
        token.initialize(alice);
    }

    function test_V1_NonOwnerTidakBisaUpgrade() public {
        MyTokenV2 newImpl = new MyTokenV2();
        bytes memory initV2Data = abi.encodeCall(
            MyTokenV2.initializeV2,
            (1_000_000 ether)
        );

        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(
                OwnableUpgradeable.OwnableUnauthorizedAccount.selector,
                alice
            )
        );
        UUPSUpgradeable(address(proxy)).upgradeToAndCall(
            address(newImpl),
            initV2Data
        );
    }

    // ==================== Test Upgrade ke V2 ====================

    function _upgradeKeV2() internal returns (MyTokenV2) {
        MyTokenV2 newImpl = new MyTokenV2();
        bytes memory initV2Data = abi.encodeCall(
            MyTokenV2.initializeV2,
            (1_000_000 ether)
        );
        UUPSUpgradeable(address(proxy)).upgradeToAndCall(
            address(newImpl),
            initV2Data
        );
        return MyTokenV2(address(proxy));
    }

    function test_Upgrade_DataTetapAda() public {
        // Mint di V1
        token.mint(alice, 500 ether);
        assertEq(token.balanceOf(alice), 500 ether);

        // Upgrade ke V2
        MyTokenV2 tokenV2 = _upgradeKeV2();

        // Saldo harus tetap ada
        assertEq(tokenV2.balanceOf(alice), 500 ether);
    }

    function test_Upgrade_NamaDanSimbolTetap() public {
        _upgradeKeV2();
        MyTokenV2 tokenV2 = MyTokenV2(address(proxy));

        assertEq(tokenV2.name(), "MyToken");
        assertEq(tokenV2.symbol(), "MTK");
    }

    function test_Upgrade_MaxSupplyTerset() public {
        MyTokenV2 tokenV2 = _upgradeKeV2();
        assertEq(tokenV2.maxSupply(), 1_000_000 ether);
    }

    function test_Upgrade_BurnBerfungsi() public {
        token.mint(alice, 500 ether);
        MyTokenV2 tokenV2 = _upgradeKeV2();

        vm.prank(alice);
        tokenV2.burn(100 ether);

        assertEq(tokenV2.balanceOf(alice), 400 ether);
    }

    function test_Upgrade_MintGagalJikaMelebihiMaxSupply() public {
        MyTokenV2 tokenV2 = _upgradeKeV2();

        vm.expectRevert("MyTokenV2: melebihi max supply");
        tokenV2.mint(alice, 1_000_001 ether);
    }

    function test_Upgrade_MintBerhasilDibawahMaxSupply() public {
        MyTokenV2 tokenV2 = _upgradeKeV2();

        tokenV2.mint(alice, 1_000_000 ether);
        assertEq(tokenV2.balanceOf(alice), 1_000_000 ether);
    }

    function test_Upgrade_ProxyAddressTetapSama() public {
        address proxySebelum = address(proxy);
        _upgradeKeV2();
        address proxySesudah = address(proxy);

        assertEq(proxySebelum, proxySesudah);
    }

    function test_Upgrade_OwnerTetapSama() public {
        MyTokenV2 tokenV2 = _upgradeKeV2();
        assertEq(tokenV2.owner(), owner);
    }
}
```

**Jalankan test:**

```bash
forge test -vv
```

**Contoh output:**

```
Ran 11 tests for test/MyToken.t.sol:MyTokenTest
[PASS] test_Upgrade_BurnBerfungsi() (gas: ...)
[PASS] test_Upgrade_DataTetapAda() (gas: ...)
[PASS] test_Upgrade_MaxSupplyTerset() (gas: ...)
[PASS] test_Upgrade_MintBerhasilDibawahMaxSupply() (gas: ...)
[PASS] test_Upgrade_MintGagalJikaMelebihiMaxSupply() (gas: ...)
[PASS] test_Upgrade_NamaDanSimbolTetap() (gas: ...)
[PASS] test_Upgrade_OwnerTetapSama() (gas: ...)
[PASS] test_Upgrade_ProxyAddressTetapSama() (gas: ...)
[PASS] test_V1_NamaDanSimbol() (gas: ...)
[PASS] test_V1_NonOwnerTidakBisaMint() (gas: ...)
[PASS] test_V1_NonOwnerTidakBisaUpgrade() (gas: ...)
[PASS] test_V1_OwnerBisaMint() (gas: ...)
[PASS] test_V1_TidakBisaInitializeLagi() (gas: ...)
Suite result: ok. 13 passed; 0 failed; 0 skipped;
```

**Test penting untuk contract upgradeable:**

| Test | Kenapa Penting |
|------|---------------|
| Data tetap ada setelah upgrade | Memastikan storage tidak corrupt |
| Fitur baru berfungsi | Memvalidasi logika V2 (burn, maxSupply) |
| Access control upgrade | Memastikan hanya owner yang bisa upgrade |
| Proxy address tetap sama | Memverifikasi user tidak perlu ganti address |
| Tidak bisa initialize ulang | Mencegah re-initialization attack |

**Tip Foundry test:**

| Flag | Fungsi |
|------|--------|
| `forge test -vv` | Tampilkan log dari `console.log` |
| `forge test -vvvv` | Tampilkan detail trace setiap call |
| `forge test --match-test test_Upgrade` | Jalankan test tertentu saja |
| `forge test --gas-report` | Tampilkan laporan penggunaan gas |

---

## 1.6 Pattern Lanjutan

### 1.6.1 Storage Gap

Ketika contract kamu meng-inherit dari base contract upgradeable yang kamu buat sendiri, gunakan **storage gap** untuk mereservasi slot storage.

```solidity
contract BaseContractV1 is Initializable {
    uint256 public value;

    // Reservasi 49 slot untuk upgrade mendatang
    uint256[49] private __gap;
}
```

**Kenapa storage gap diperlukan:**

Tanpa gap, jika kamu menambah variabel di base contract, slot storage di child contract akan bergeser dan menyebabkan data corruption.

```solidity
// Tanpa gap - BERBAHAYA
contract BaseV1 {
    uint256 public a;       // slot 0
}
contract ChildV1 is BaseV1 {
    uint256 public x;       // slot 1
}

// Jika BaseV2 menambah variabel...
contract BaseV2 {
    uint256 public a;       // slot 0
    uint256 public b;       // slot 1 ← CONFLICT dengan ChildV1.x!
}
contract ChildV2 is BaseV2 {
    uint256 public x;       // slot 2 (tapi data masih di slot 1!)
}
```

```solidity
// Dengan gap - AMAN
contract BaseV1 {
    uint256 public a;       // slot 0
    uint256[49] private __gap; // slot 1-49 (direservasi)
}
contract ChildV1 is BaseV1 {
    uint256 public x;       // slot 50
}

// BaseV2 menambah variabel, gap dikurangi
contract BaseV2 {
    uint256 public a;       // slot 0
    uint256 public b;       // slot 1
    uint256[48] private __gap; // slot 2-49 (dikurangi 1)
}
contract ChildV2 is BaseV2 {
    uint256 public x;       // slot 50 (tetap di tempat yang sama!)
}
```

> **Catatan**: Contract OpenZeppelin Upgradeable sudah menggunakan storage gap secara internal, jadi kamu hanya perlu menambahkannya di base contract custom milikmu.

### 1.6.2 Inspeksi Storage Layout dengan Foundry

Foundry menyediakan tool `forge inspect` untuk melihat storage layout contract. Ini sangat berguna untuk memverifikasi bahwa layout V2 kompatibel dengan V1.

```bash
# Lihat storage layout V1
forge inspect MyTokenV1 storage-layout

# Lihat storage layout V2
forge inspect MyTokenV2 storage-layout
```

**Contoh output:**

```
| Name       | Type    | Slot | Offset | Bytes |
|------------|---------|------|--------|-------|
| maxSupply  | uint256 | 0    | 0      | 32    |
```

Pastikan variabel yang ada di V1 tidak berubah posisi slot-nya di V2. Variabel baru harus muncul di slot yang lebih tinggi.

### 1.6.3 Menghapus Kemampuan Upgrade

Salah satu keunggulan UUPS adalah kamu bisa menghapus kemampuan upgrade di versi mendatang. Ini berguna ketika contract sudah stabil dan kamu ingin membuatnya benar-benar immutable.

```solidity
contract MyTokenFinal is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    // ... fungsi lainnya

    // Override _authorizeUpgrade agar selalu revert
    function _authorizeUpgrade(address newImplementation)
        internal
        pure
        override
    {
        revert("Upgrade telah dinonaktifkan");
    }
}
```

Setelah upgrade ke versi ini, **tidak ada yang bisa meng-upgrade contract lagi** — termasuk owner. Proxy address dan semua data tetap ada, tapi logikanya menjadi permanen.

---

## 1.7 Kesimpulan

Di panduan ini, kamu belajar:

1. **Kenapa upgradeable contract** - Memungkinkan perbaikan bug dan penambahan fitur tanpa kehilangan data atau mengganti address
2. **Pattern UUPS** - Logika upgrade ada di implementation, lebih efisien dari Transparent Proxy
3. **Aturan penting** - Gunakan initializer bukan constructor, jaga storage layout, selalu pakai access control
4. **Implementasi lengkap** - Menulis, deploy, dan upgrade contract ERC20 dengan UUPS menggunakan Foundry
5. **Testing** - Menulis test Solidity yang memastikan data preserved dan fitur baru berfungsi setelah upgrade
6. **Pattern lanjutan** - Storage gap, inspeksi layout dengan `forge inspect`, menghapus upgradeability

**Skill yang didapat:**
- Menyiapkan proyek Foundry dengan OpenZeppelin Upgradeable
- Menulis contract upgradeable yang aman
- Men-deploy proxy dan implementation dengan `forge script`
- Meng-upgrade contract ke versi baru dengan `upgradeToAndCall`
- Menulis test Solidity yang komprehensif untuk upgrade
- Memverifikasi storage layout dengan `forge inspect`
- Menggunakan `cast` untuk verifikasi on-chain

**Langkah selanjutnya:**
- Eksplorasi multi-sig ownership untuk keamanan upgrade yang lebih baik
- Pelajari Transparent Proxy pattern sebagai perbandingan
- Implementasikan time-lock untuk upgrade (governance)
- Cek [dokumentasi OpenZeppelin Upgrades](https://docs.openzeppelin.com/upgrades) untuk fitur lanjutan
- Cek [dokumentasi Foundry](https://book.getfoundry.sh/) untuk fitur forge lainnya

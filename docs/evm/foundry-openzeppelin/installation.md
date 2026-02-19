---
title: Instalasi
sidebar_label: Instalasi
---

# Instalasi Foundry dan OpenZeppelin

## Instalasi Foundry

Jalankan perintah berikut di terminal:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

Setelah instalasi selesai, refresh shell kamu:

```bash
source ~/.bashrc
# atau untuk zsh:
source ~/.zshrc
```

Kemudian jalankan `foundryup` untuk menginstall versi terbaru:

```bash
foundryup
```

Verifikasi instalasi berhasil:

```bash
forge --version
# Output contoh: forge 0.2.0 (...)
```

## Inisialisasi Project

Buat project baru dengan Foundry:

```bash
forge init myproject
cd myproject
```

Struktur direktori yang dihasilkan:

```
myproject/
├── lib/                  # Dependencies (git submodules)
├── script/               # Deployment scripts
├── src/                  # Source code kontrak
├── test/                 # File test
└── foundry.toml          # Konfigurasi project
```

## Instalasi OpenZeppelin

Di dalam direktori project kamu, install OpenZeppelin sebagai dependency:

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

Setelah terinstall, tambahkan remapping di `foundry.toml` agar import path lebih bersih:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

remappings = [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
]
```

Atau kamu bisa generate remappings secara otomatis:

```bash
forge remappings > remappings.txt
```

Sekarang kamu bisa mengimport OpenZeppelin di kontrak dengan sintaks:

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

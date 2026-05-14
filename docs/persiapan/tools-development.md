---
title: Tools Development
sidebar_label: Tools Development
---

# Tools Development

Halaman ini memandu instalasi semua tool yang dipakai sepanjang materi: **Node.js**, **pnpm**, **Git**, **code editor**, dan **Foundry**. Kerjakan berurutan, dan verifikasi tiap langkah sebelum lanjut.

:::warning Pengguna Windows: baca bagian 0 dulu
Foundry dan sebagian besar tool di halaman ini dibuat untuk lingkungan Unix. Di Windows, kamu **harus** memasang **WSL2** dulu dan mengerjakan semua langkah di dalamnya — bukan di PowerShell/CMD. Lihat [bagian 0](#0-pengguna-windows--pasang-wsl2-dulu-wajib).
:::

## 0. Pengguna Windows — Pasang WSL2 Dulu (Wajib)

> Pakai **macOS atau Linux**? Lewati bagian ini, langsung ke [bagian 1](#1-nodejs-v22-lewat-nvm).

**Foundry tidak punya build native Windows yang resmi** — install script-nya `bash`, dan toolchain-nya (`forge`, `cast`, `anvil`) memang dirancang untuk lingkungan Unix. Banyak tool lain (nvm versi bash, beberapa package native) juga sama. Cara yang benar dan didukung di Windows adalah lewat **WSL2** (Windows Subsystem for Linux): kamu menjalankan Ubuntu di dalam Windows, dan **semua langkah di halaman ini dikerjakan di terminal Ubuntu itu**, bukan di PowerShell atau CMD.

### Pasang WSL2

1. Buka **PowerShell sebagai Administrator** (klik kanan ikon PowerShell → "Run as administrator").
2. Jalankan:

   ```powershell
   wsl --install
   ```

   Perintah ini memasang WSL2 beserta Ubuntu secara default.
3. **Restart komputer** bila diminta.
4. Setelah restart, buka aplikasi **Ubuntu** dari Start Menu. Tunggu proses setup selesai, lalu buat **username & password Linux** (catat password-nya — dipakai untuk perintah `sudo`).

Sekarang kamu punya terminal Ubuntu. **Semua perintah di bagian 1–5 di bawah dijalankan di terminal Ubuntu ini.**

### Hal Penting Saat Pakai WSL

- **Simpan project di filesystem Linux** (mis. di `~/projects/...`), **bukan** di `/mnt/c/Users/...`. Project di drive Windows (`/mnt/c`) jauh lebih lambat saat `pnpm install` / `forge build`.
- **VS Code**: install VS Code di Windows seperti biasa, lalu pasang ekstensi **"WSL"** (dari Microsoft). Dari terminal Ubuntu, di dalam folder project, jalankan `code .` — VS Code akan terbuka dalam mode "tersambung ke WSL", dan semua ekstensi (Solidity, ESLint, dll) jalan di sisi Linux.
- **Update WSL sesekali**: dari PowerShell jalankan `wsl --update`.
- Kalau `wsl --install` gagal: pastikan Windows kamu cukup baru (Windows 10 versi 2004+ atau Windows 11), fitur "Virtual Machine Platform" aktif, dan virtualization enabled di BIOS. Detail troubleshooting: [dokumentasi WSL Microsoft](https://learn.microsoft.com/windows/wsl/install).

> Alternatif tanpa WSL (tidak disarankan): ada [nvm-windows](https://github.com/coreybutler/nvm-windows) untuk Node, tapi Foundry tetap bermasalah di Windows native. Sebagian besar materi dan starter repo mengasumsikan lingkungan Unix/WSL — pakai WSL akan menghemat banyak waktu.

## 1. Node.js (v22) lewat nvm

Kita pakai **nvm** (Node Version Manager) supaya gampang ganti-ganti versi Node.

```bash
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# tutup & buka ulang terminal, lalu:
nvm install 22
nvm use 22
```

Verifikasi:

```bash
node -v
# Output contoh: v22.x.x
```

## 2. pnpm

Kita pakai **pnpm** sebagai package manager (lebih cepat & hemat disk). Aktifkan lewat `corepack` yang sudah bawaan Node:

```bash
corepack enable pnpm
corepack use pnpm@10
```

Verifikasi:

```bash
pnpm -v
# Output contoh: 10.x.x
```

## 3. Git

Cek apakah Git sudah terpasang:

```bash
git --version
```

Kalau belum ada:

- **macOS**: `xcode-select --install` (atau install lewat [git-scm.com](https://git-scm.com))
- **Linux / WSL (Ubuntu)**: `sudo apt update && sudo apt install git`

Set identitas (sekali saja):

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"
```

## 4. Code Editor

Pakai **[VS Code](https://code.visualstudio.com)** (gratis, paling banyak dukungan ekstensi). Setelah install, tambahkan ekstensi berikut:

| Ekstensi | Gunanya |
|---|---|
| **Solidity** (Nomic Foundation) | Syntax highlighting & autocomplete untuk Solidity |
| **ESLint** | Linter untuk kode JavaScript/TypeScript |
| **Prettier** | Auto-format kode |
| **WSL** (Microsoft) | **Khusus pengguna Windows** — biar VS Code bisa membuka folder di dalam WSL |

Editor lain (Cursor, Zed, Neovim, dll) juga boleh — sesuaikan ekstensinya.

## 5. Foundry

**Foundry** adalah toolkit untuk compile, test, dan deploy smart contract (`forge`, `cast`, `anvil`).

:::note
Pengguna Windows: pastikan kamu sudah menyelesaikan [bagian 0 (WSL2)](#0-pengguna-windows--pasang-wsl2-dulu-wajib) dan menjalankan perintah berikut di terminal Ubuntu, **bukan** di PowerShell.
:::

```bash
curl -L https://foundry.paradigm.xyz | bash

# refresh shell:
source ~/.bashrc   # atau ~/.zshrc kalau pakai zsh

foundryup
```

Verifikasi:

```bash
forge --version
# Output contoh: forge 0.2.0 (...)
```

:::info
Detail penggunaan Foundry — inisialisasi project, install OpenZeppelin, remappings — dibahas di **[Instalasi Foundry dan OpenZeppelin](../evm/foundry-openzeppelin/installation.md)**. Untuk persiapan ini, cukup pastikan `forge --version` jalan.
:::

## Ringkasan Verifikasi

Jalankan semua perintah ini (di terminal Ubuntu/WSL untuk pengguna Windows) — semuanya harus keluar versi, bukan error:

```bash
node -v        # v22.x.x
pnpm -v        # 10.x.x
git --version  # git version 2.x.x
forge --version
```

Kalau semua keluar versinya, environment development kamu siap. Lanjut ke [Wallet & Testnet →](./wallet-testnet.md).

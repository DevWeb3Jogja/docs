---
title: Instalasi
sidebar_label: Instalasi
---

# Instalasi Foundry & OpenZeppelin

## Instalasi Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Membuat Project Baru

```bash
mkdir my-first-contract
cd my-first-contract
forge init
```

## Instalasi OpenZeppelin

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

Setup remappings di `foundry.toml`:

```toml
[profile.default]
remappings = ["@openzeppelin/=lib/openzeppelin-contracts/"]
```

## Verifikasi

```bash
forge test
```

---

Selanjutnya: [Materi Pengantar - ERC20](/evm/materi-pengantar/erc20)

---
title: Kesalahan Umum
sidebar_label: Kesalahan Umum
---

# Kesalahan Umum

Berikut kesalahan umum yang sering terjadi saat development smart contract dan cara mengatasinya.

## 1. Contract Abstract Error

### Masalah
```
Error: Contract "MyToken" should be marked as abstract
```

### Penyebab
Tidak mengimplementasikan semua fungsi yang dibutuhkan dari parent contract.

### Solusi
```solidity
// ❌ Salah - tidak mengimplementasikan constructor ERC20
contract MyToken is ERC20 {
    // Missing constructor
}

// ✅ Benar
contract MyToken is ERC20 {
    constructor() ERC20("My Token", "MTK") {}
}
```

## 2. Kesalahan Perhitungan Shares

Handle first deposit atau pembagian dengan nol:

```solidity
function _calculateShares(uint256 amount) internal view returns (uint256) {
    uint256 totalShares = totalSupply();
    uint256 totalAssets = token.balanceOf(address(this));
    
    if (totalShares == 0 || totalAssets == 0) {
        return amount;
    }
    
    return (amount * totalShares) / totalAssets;
}
```

## 3. Tidak Approve Sebelum TransferFrom

User harus approve sebelum vault bisa menarik token:

```solidity
token.approve(address(vault), amount);
vault.deposit(amount);
```

## 4. Lupa ReentrancyGuard

Gunakan `nonReentrant` modifier:

```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is ReentrancyGuard {
    function withdraw(uint256 shares) public nonReentrant {
        // ...
    }
}
```

## 5. Salah Decimals

Selalu kalikan dengan `10**decimals()`:

```solidity
_mint(user, 1000 * 10**decimals());
```

---

Selanjutnya: [Kesimpulan](/evm/conclusion)

---
title: OnlyOwner
sidebar_label: OnlyOwner
---

# OnlyOwner Modifier

`onlyOwner` adalah modifier yang disediakan oleh kontrak `Ownable`. Modifier ini memastikan bahwa hanya owner kontrak yang bisa memanggil fungsi yang menggunakannya. Jika bukan owner yang memanggil, transaksi akan di-revert dengan pesan error `OwnableUnauthorizedAccount`.

```solidity
function mintTokens(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
}
```

Di balik layar, `onlyOwner` kira-kira setara dengan:

```solidity
modifier onlyOwner() {
    require(msg.sender == owner(), "Ownable: caller is not the owner");
    _;
}
```

Simbol `_;` menandakan tempat di mana kode fungsi yang menggunakan modifier ini akan disisipkan dan dieksekusi.

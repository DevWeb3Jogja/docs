---
title: Ownable
sidebar_label: Pengenalan
---

# Ownable

`Ownable` adalah kontrak dari OpenZeppelin yang menyediakan mekanisme access control dasar berupa kepemilikan kontrak. Konsepnya sederhana: ada satu alamat yang disebut "owner", dan hanya owner yang bisa menjalankan fungsi-fungsi tertentu.

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
}
```

Perlu diperhatikan: di OpenZeppelin versi 5.x, constructor `Ownable` mengharuskan kamu menyertakan `initialOwner` secara eksplisit. Di versi 4.x, `owner` diset otomatis ke `msg.sender`.

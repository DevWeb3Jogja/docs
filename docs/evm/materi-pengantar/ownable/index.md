---
title: Ownable
sidebar_label: Pengenalan
---

# Ownable Pattern

**Ownable** memberikan kontrol akses ke smart contract. Hanya owner yang bisa memanggil fungsi tertentu.

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    constructor() Ownable(msg.sender) {}
    
    function sensitiveFunction() public onlyOwner {}
}
```

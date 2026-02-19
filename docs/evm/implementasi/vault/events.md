---
title: Emit & Event
sidebar_label: Emit & Event
---

# Emit & Event

Event adalah cara kontrak berkomunikasi dengan dunia luar. Event tidak tersimpan di storage kontrak, melainkan di transaction log yang diindeks oleh node Ethereum. Frontend dan indexer seperti TheGraph dapat memantau event ini secara real-time.

```solidity
// Definisi event
event Deposited(address indexed user, uint256 amount, uint256 sharesMinted);
event Withdrawn(address indexed user, uint256 shares, uint256 amountReturned);
```

Keyword `indexed` pada parameter event berarti parameter tersebut bisa digunakan sebagai filter saat querying log. Maksimal 3 parameter bisa diindeks per event.

Cara memancarkan event menggunakan keyword `emit`:

```solidity
emit Deposited(msg.sender, amount, sharesToMint);
emit Withdrawn(msg.sender, sharesToBurn, amountToReturn);
```

Event yang baik mencatat:
- Siapa yang melakukan aksi (`msg.sender`, biasanya diindeks).
- Apa yang terjadi (jumlah yang terlibat).
- Hasil dari aksi (shares yang diterima atau amount yang dikembalikan).

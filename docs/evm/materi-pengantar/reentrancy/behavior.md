---
title: Behavior
sidebar_label: Behavior
---

# Reentrancy Behavior

Reentrancy terjadi saat kontrak:
- Mengirim ETH menggunakan `call`
- Memanggil kontrak eksternal
- Callback hooks seperti `onERC721Received`

## Best Practice

Selalu gunakan `ReentrancyGuard` dari OpenZeppelin untuk fungsi yang melibatkan transfer aset.

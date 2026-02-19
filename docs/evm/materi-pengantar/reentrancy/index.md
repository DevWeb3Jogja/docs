---
title: Reentrancy
sidebar_label: Pengenalan
---

# Reentrancy

Reentrancy adalah salah satu vulnerability paling terkenal di ekosistem smart contract. Serangan ini terjadi ketika kontrak eksternal dapat memanggil kembali fungsi kontrak yang belum selesai dieksekusi, memanfaatkan keadaan kontrak yang belum terupdate.

Serangan reentrancy paling terkenal adalah **The DAO Hack** pada tahun 2016, yang menguras dana senilai sekitar $60 juta USD dan akhirnya menyebabkan hard fork Ethereum menjadi ETH dan ETC.

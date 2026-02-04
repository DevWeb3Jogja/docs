---
title: Unit Test
sidebar_label: Pengenalan
---

# Unit Test

Contoh test dengan Foundry:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;
    
    function setUp() public {
        token = new MyToken("Test", "TST", 1_000_000);
    }
    
    function test_Name() public view {
        assertEq(token.name(), "Test");
    }
}
```

Jalankan: `forge test`

module.exports = {
  docs: [
    {
      type: "doc",
      id: "index",
      label: "Pengenalan",
    },
    {
      type: "category",
      label: "Blockchain untuk Programmer",
      collapsed: false,
      link: {
        type: "doc",
        id: "blockchain-untuk-programmer/index",
      },
      items: [
        "blockchain-untuk-programmer/apa-itu-blockchain",
        "blockchain-untuk-programmer/ethereum-ekosistem",
        "blockchain-untuk-programmer/wallet-account",
        "blockchain-untuk-programmer/transaksi-gas",
        "blockchain-untuk-programmer/smart-contract",
        "blockchain-untuk-programmer/testnet-tools",
      ],
    },
    {
      type: "category",
      label: "Persiapan Environment",
      collapsed: false,
      link: {
        type: "doc",
        id: "persiapan/index",
      },
      items: [
        "persiapan/tools-development",
        "persiapan/wallet-testnet",
      ],
    },
    {
      type: "category",
      label: "Writing First Contract",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "EVM",
          collapsed: false,
          link: {
            type: "doc",
            id: "evm/index",
          },
          items: [
            "evm/goals",
            {
              type: "category",
              label: "Foundry & OpenZeppelin",
              collapsed: true,
              items: [
                "evm/foundry-openzeppelin/index",
                "evm/foundry-openzeppelin/installation",
              ],
            },
            {
              type: "category",
              label: "Materi Pengantar",
              collapsed: true,
              items: [
                {
                  type: "category",
                  label: "ERC20",
                  collapsed: true,
                  items: [
                    "evm/materi-pengantar/erc20/index",
                    "evm/materi-pengantar/erc20/name-symbol",
                    "evm/materi-pengantar/erc20/decimal",
                    "evm/materi-pengantar/erc20/supply",
                  ],
                },
                {
                  type: "category",
                  label: "Ownable",
                  collapsed: true,
                  items: [
                    "evm/materi-pengantar/ownable/index",
                    "evm/materi-pengantar/ownable/only-owner",
                    "evm/materi-pengantar/ownable/ownership",
                  ],
                },
                {
                  type: "category",
                  label: "Reentrancy",
                  collapsed: true,
                  items: [
                    "evm/materi-pengantar/reentrancy/index",
                    "evm/materi-pengantar/reentrancy/attack-example",
                    "evm/materi-pengantar/reentrancy/behavior",
                  ],
                },
              ],
            },
            {
              type: "category",
              label: "Implementasi",
              collapsed: true,
              items: [
                {
                  type: "category",
                  label: "ERC20 Token",
                  collapsed: true,
                  items: [
                    "evm/implementasi/erc20-token/index",
                    "evm/implementasi/erc20-token/name",
                    "evm/implementasi/erc20-token/decimal",
                    "evm/implementasi/erc20-token/supply",
                  ],
                },
                {
                  type: "category",
                  label: "Vault Contract",
                  collapsed: true,
                  items: [
                    "evm/implementasi/vault/index",
                    "evm/implementasi/vault/receive-token",
                    "evm/implementasi/vault/shares",
                    "evm/implementasi/vault/custom-error",
                    "evm/implementasi/vault/events",
                  ],
                },
              ],
            },
            {
              type: "category",
              label: "Unit Test",
              collapsed: true,
              items: ["evm/unit-test/index", "evm/unit-test/verbosity"],
            },
            "evm/common-mistakes",
            "evm/conclusion",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Frontend",
      collapsed: true,
      items: [
        "frontend/pengenalan",
        "frontend/persiapan-stack",
        "frontend/connect-wallet",
        "frontend/read-contract",
        "frontend/write-contract",
        "frontend/best-practices",
      ],
    },
    {
      type: "category",
      label: "Developer Tools",
      collapsed: true,
      items: [
        "developer-tools/index",
        "developer-tools/ponder/index",
        "developer-tools/viem/index",
      ],
    },
    {
      type: "category",
      label: "Advanced Topics",
      collapsed: true,
      items: [
        "advanced-topics/index",
        "advanced-topics/uniswap-v4-hooks/index",
        "advanced-topics/uups-upgradeable/index",
        "advanced-topics/x402-protocol/index",
      ],
    },
  ],
};

const path = require('path');

const BASE_URL = '/docs-devweb3jogja/';

module.exports = {
  title: 'DevWeb3Jogja',
  tagline: 'Dokumentasi pembelajaran Web3 development untuk komunitas DevWeb3Jogja',
  url: 'https://DevWeb3Jogja.github.io', // Ganti dengan URL production kamu
  baseUrl: BASE_URL,
  i18n: {
    defaultLocale: 'id',
    locales: ['id'],
    localeConfigs: {
      id: { label: 'Bahasa Indonesia' },
    },
  },
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'image/devweb3jogja.jpg',
  organizationName: 'DevWeb3Jogja',
  projectName: 'docs-devweb3jogja',
  trailingSlash: true,
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/devweb3jogja/docs/edit/main/',
        },
        blog: false, // Disable blog
        theme: {
          customCss: [
            require.resolve('./node_modules/modern-normalize/modern-normalize.css'),
            require.resolve('./src/styles/custom.scss'),
          ],
        },
      },
    ],
  ],
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    metadata: [
      { name: 'og:image', content: 'https://devweb3jogja.id/img/og-image.png' },
      { name: 'twitter:image', content: 'https://devweb3jogja.id/img/og-image.png' },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:site_name',
        content: 'DevWeb3Jogja Docs',
      },
    ],
    colorMode: {
      defaultMode: 'dark', // Default dark mode sesuai preferensi hitam
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      hideOnScroll: true,
      title: 'DevWeb3Jogja',
      logo: {
        alt: 'DevWeb3Jogja Logo',
        src: 'image/devweb3jogja2.jpg',
        srcDark: 'image/devweb3jogja2.jpg',
        href: '/',
        target: '_self',
      },
      items: [
        {
          type: 'doc',
          docId: 'index',
          label: 'Docs',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'evm/index',
          label: 'EVM',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/devweb3jogja',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '📚 Learning Resources',
          items: [
            {
              label: 'Getting Started',
              to: '/',
            },
            {
              label: 'EVM Basics',
              to: '/evm',
            },
            {
              label: 'Smart Contracts',
              to: '/evm/smart-contract',
            },
            {
              label: 'Developer Tools',
              to: '/developer-tools',
            },
          ],
        },
        {
          title: '🛠️ Tools & Resources',
          items: [
            {
              label: 'Hardhat',
              to: '/developer-tools/hardhat',
            },
            {
              label: 'Foundry',
              to: '/developer-tools/foundry',
            },
            {
              label: 'Ethers.js',
              to: '/developer-tools/ethers',
            },
            {
              label: 'Viem',
              to: '/developer-tools/viem',
            },
          ],
        },
        {
          title: '🌐 Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/devweb3jogja',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/devweb3jogja',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/devweb3jogja',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/devweb3jogja',
            },
          ],
        },
        {
          title: '⚡ More',
          items: [
            {
              label: 'Blog',
              href: 'https://devweb3jogja.id/blog',
            },
            {
              label: 'Events',
              href: 'https://devweb3jogja.id/events',
            },
            {
              label: 'About Us',
              href: 'https://devweb3jogja.id/about',
            },
            {
              label: 'Contact',
              href: 'https://devweb3jogja.id/contact',
            },
          ],
        },
      ],
      logo: {
        alt: 'DevWeb3Jogja Logo',
        src: 'image/devweb3jogja2.jpg',
        href: 'https://devweb3jogja.id',
        width: 160,
        height: 51,
      },
      copyright: `
        <div style="margin-top: 20px;">
          <strong>DevWeb3Jogja</strong> - Komunitas Web3 Developer Yogyakarta
          <br/>
          Copyright © ${new Date().getFullYear()} DevWeb3Jogja. Built with ❤️ using Docusaurus.
          <br/>
          <em style="font-size: 0.85em; opacity: 0.8;">Belajar, Berbagi, Berkembang bersama Web3</em>
        </div>
      `,
    },
    prism: {
      theme: { plain: {}, styles: [] },
      darkTheme: { plain: {}, styles: [] },
      additionalLanguages: ['solidity', 'bash', 'json', 'diff'],
    },
    // Algolia DocSearch - perlu setup terpisah di https://docsearch.algolia.com/
    // Uncomment setelah mendapatkan credentials dari Algolia
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'devweb3jogja',
    //   contextualSearch: true,
    // },
  },
  plugins: [
    'docusaurus-plugin-sass',
  ],
  customFields: {},
  themes: [],
};

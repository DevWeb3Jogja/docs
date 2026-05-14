const path = require('path');

const BASE_URL = '/docs/';

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
  favicon: 'image/devweb3jogja.png',
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
      hideOnScroll: false,
      title: 'DevWeb3Jogja',
      logo: {
        alt: 'DevWeb3Jogja Logo',
        src: 'image/devweb3jogja2.png',
        srcDark: 'image/devweb3jogja2.png',
        href: '/',
        target: '_self',
      },
      items: [
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
          title: 'Docs',
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
              label: 'Developer Tools',
              to: '/developer-tools',
            },
          ],
        },
        {
          title: 'Community',
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
              label: 'Telegram',
              href: 'https://t.me/devweb3jogja',
            },
          ],
        },
      ],
      logo: {
        alt: 'DevWeb3Jogja Logo',
        src: 'image/devweb3jogja2.png',
        href: 'https://devweb3jogja.id',
        width: 120,
      },
      copyright: `Copyright © ${new Date().getFullYear()} DevWeb3Jogja`,
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

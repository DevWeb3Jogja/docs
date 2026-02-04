<p align="center">
  <img src="static/img/logo.svg" alt="DevWeb3Jogja Logo" width="120" height="120">
</p>

<h1 align="center">DevWeb3Jogja Docs</h1>

<p align="center">
  <strong>Dokumentasi pembelajaran Web3 development untuk komunitas DevWeb3Jogja</strong>
</p>

<p align="center">
  <a href="https://devweb3jogja.id">Website</a> •
  <a href="https://github.com/devweb3jogja">GitHub</a>
</p>

---

## 📖 Tentang

Repositori ini berisi dokumentasi pembelajaran Web3 development yang dibangun menggunakan [Docusaurus 3](https://docusaurus.io/). Dokumentasi ini ditujukan untuk komunitas DevWeb3Jogja yang ingin belajar pengembangan aplikasi berbasis blockchain.

### 🎯 Topik yang Dibahas

- **EVM (Ethereum Virtual Machine)** - Materi dasar hingga implementasi smart contract
- **Solidity** - Bahasa pemrograman untuk smart contract
- **DApp Development** - Pengembangan aplikasi terdesentralisasi

---

## 🚀 Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18.0.0 atau lebih baru
- npm atau yarn

### Instalasi

```bash
# Clone repositori
git clone https://github.com/devweb3jogja/docs.git

# Masuk ke direktori project
cd docs

# Install dependencies
npm install
```

### Menjalankan Development Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`. Perubahan pada file akan otomatis ter-refresh.

### Build untuk Production

```bash
npm run build
```

File hasil build akan tersimpan di direktori `build/`.

---

## 📁 Struktur Project

```
docs-devweb3jogja/
├── docs/                   # Konten dokumentasi (Markdown/MDX)
│   ├── index.md           # Halaman utama
│   └── evm/               # Materi EVM & Solidity
├── src/                   # Komponen React & styling kustom
├── static/                # Asset statis (gambar, favicon, dll)
├── docusaurus.config.js   # Konfigurasi Docusaurus
├── sidebars.js            # Konfigurasi navigasi sidebar
└── package.json           # Dependencies & scripts
```

---

## 📝 Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm start` | Menjalankan development server |
| `npm run build` | Build untuk production |
| `npm run serve` | Preview hasil build secara lokal |
| `npm run clear` | Menghapus cache Docusaurus |
| `npm run lint` | Memformat file dengan Prettier |

---

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Jika kamu ingin berkontribusi:

1. Fork repositori ini
2. Buat branch baru (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buat Pull Request

---

## 📄 Lisensi

Repositori ini dilisensikan di bawah [Apache License 2.0](./LICENSE).

---

<p align="center">
  Dibuat dengan ❤️ oleh <a href="https://github.com/devweb3jogja">DevWeb3Jogja</a>
</p>

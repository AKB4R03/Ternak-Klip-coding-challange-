# Inventory Management Dashboard MVP

Implementasi studi kasus dashboard inventory berbasis Supabase (PostgreSQL) + frontend HTML/CSS/JavaScript.

## Fitur Utama

- Menampilkan daftar produk: nama, jumlah stok, dan waktu pembaruan terakhir.
- Ringkasan metrik: total SKU, total unit stok, dan update terakhir.
- Tombol refresh untuk mengambil data terbaru dari backend.
- Highlight stok rendah (<= 15) agar tim operasional cepat melihat risiko stockout.

## Struktur Proyek

- `index.html`: Struktur utama UI dashboard.
- `styles.css`: Styling dashboard (responsive, modern, dan mudah dibaca).
- `app.js`: Logic fetch data dari Supabase REST API + render tabel.
- `config.example.js`: Contoh konfigurasi kredensial Supabase.
- `sql/schema.sql`: SQL schema + seed data + policy RLS untuk read anon.
- `.gitignore`: Mengabaikan `config.js` agar credential tidak ikut ter-commit.

## Cara Menjalankan Lokal

1. Buat project baru di Supabase.
2. Buka SQL Editor Supabase, jalankan isi file `sql/schema.sql`.
3. Salin `config.example.js` menjadi `config.js` lalu isi:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
};
```

4. Jalankan local static server dari folder proyek.

Contoh dengan Python:

```bash
python -m http.server 5500
```

5. Buka browser ke `http://localhost:5500`.

## Catatan Deployment

- Repository ini siap di-host ke GitHub Pages, Netlify, atau Vercel (static site).
- Pastikan file `config.js` sudah disediakan di environment hosting.

## Bantuan AI (Disclosure)

AI digunakan untuk:

- mempercepat penyusunan struktur awal dashboard,
- merapikan dokumentasi,
- validasi alur integrasi frontend ke Supabase.

Semua hasil tetap ditinjau dan disesuaikan manual agar sesuai kebutuhan studi kasus.

# Voyatrax ✈️

![Tickets](https://raw.githubusercontent.com/ferryops/VOYATRAX/refs/heads/main/public/assets/Screenshot%202025-07-13%20at%2007.58.59.png)

Voyatrax adalah aplikasi pemesanan tiket pesawat berbasis web yang dibangun dengan **Next.js**, **Tailwind CSS**, dan **Supabase**. Aplikasi ini menyediakan fitur pemesanan tiket bagi pengguna, serta dashboard khusus untuk admin.

## Fitur Utama

### Untuk Pengguna

- **Login Page**: Masuk ke akun pengguna yang sudah terdaftar.
- **Register**: Daftar akun baru untuk mulai menggunakan aplikasi.
- **Orders**: Melihat dan mengelola pesanan tiket yang telah dibuat.
- **Tickets**: Melihat detail tiket pesawat yang telah dibeli.

### Untuk Admin

- **Dashboard**: Melihat ringkasan statistik dan aktivitas aplikasi.
- **Orders**: Melihat dan mengelola seluruh pesanan pengguna.
- **Ticket**: Membuat, mengedit, dan menghapus tiket penerbangan.
- **Vouchers**: Mengelola voucher diskon untuk promosi.

## Tech Stack

- [Next.js](https://nextjs.org/) — Framework React untuk aplikasi web modern.
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework untuk styling.
- [Supabase](https://supabase.com/) — Backend sebagai layanan (auth, database, dan storage).

## Instalasi & Menjalankan Project

1. **Clone repositori ini**

   ```bash
   git clone https://github.com/username/voyatrax.git
   cd voyatrax
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Atur environment variables**

   - Buat file `.env.local` berdasarkan contoh `.env.example`
   - Isi konfigurasi Supabase (URL, Key, dsb)

4. **Jalankan aplikasi**

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Akses aplikasi**

   - Buka [http://localhost:3000](http://localhost:3000)

## Struktur Folder

```
.
├── components
├── pages
│   ├── admin
│   │   ├── dashboard.tsx
│   │   ├── orders.tsx
│   │   ├── tickets.tsx
│   │   └── vouchers.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── orders.tsx
│   └── tickets.tsx
├── styles
├── utils
└── ...
```

## Kontribusi

Kontribusi sangat terbuka! Silakan buat pull request atau buka issue jika menemukan bug atau ingin menambah fitur.

## Lisensi

MIT License © 2024 ferryops

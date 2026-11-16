# BookStore — Aplikasi Toko Buku Online

Aplikasi toko buku sederhana dengan **2 aktor (Admin & User)** yang dibangun menggunakan
**Laravel 12 (REST API) + MySQL** di sisi backend dan **React + Vite + Tailwind CSS** di sisi
frontend. Proyek ini dibuat untuk memenuhi skenario Junior Web Developer.

---

## 1. Fitur

### A. Admin

| Fitur | Status | Halaman |
| --- | --- | --- |
| Add / Update / Delete Kategori Buku | ✅ | `/admin/genres` |
| Add / Update / Delete Data Buku | ✅ | `/admin/books` |
| Add / Update / Delete Data Author (pendukung) | ✅ | `/admin/authors` |
| List User yang sudah terdaftar | ✅ | `/admin/users` |
| List pesanan buku dari user yang berbeda-beda | ✅ | `/admin/orders` |
| Melihat pesan dari halaman Contact | ✅ | `/admin/messages` |
| Dashboard ringkasan (buku, pesanan, user, pesan, pendapatan) | ✅ | `/admin` |

### B. User

| Fitur | Status | Halaman |
| --- | --- | --- |
| Registrasi User | ✅ | `/register` |
| Login User | ✅ | `/login` |
| Melihat detail halaman About Us | ✅ | `/about` |
| Contact to Admin (kirim pesan) | ✅ | `/contact` |
| Pencarian Buku (judul, penulis, ISBN) + filter kategori | ✅ | `/books` |
| Add to Cart Buku | ✅ | `/cart`, tombol di katalog/detail |
| Payment at Delivery (bayar sebelum buku dikirim) | ✅ | `/checkout` |
| Riwayat & status pesanan | ✅ | `/orders` |
| Integrasi Midtrans (opsional) | ✅ | `/checkout` |

---

## 2. Teknologi

| Bagian | Teknologi |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios |
| Backend | PHP 8.2, Laravel 12, Laravel Sanctum (token auth) |
| Database | MySQL / MariaDB (XAMPP) |
| Pembayaran | Payment at Delivery (default), Midtrans Snap (opsional) |

---

## 3. Struktur Proyek

```
C:\xampp\htdocs\
├── booksales-api\        # Backend Laravel (REST API)
│   ├── app\Http\Controllers\
│   ├── app\Models\
│   ├── database\migrations\
│   ├── database\seeders\
│   └── routes\api.php
└── booksales-fe\         # Frontend React (proyek ini)
    └── src\
        ├── _api\         # Instance Axios + interceptor token
        ├── _services\    # Pemanggilan endpoint API
        ├── components\   # Navbar, layout, kartu buku, dll.
        ├── context\      # AuthContext & CartContext
        ├── pages\        # Halaman user & admin
        └── utils\        # Format rupiah, tanggal, label status
```

---

## 4. Cara Menjalankan

### 4.1 Prasyarat

- XAMPP (Apache + MySQL) atau MySQL yang berjalan di port `3306`
- PHP 8.2+ (gunakan `C:\xampp\php\php.exe`)
- Composer
- Node.js 20+ dan npm

### 4.2 Backend Laravel

```bash
# 1. Jalankan MySQL dari XAMPP (atau lewat XAMPP Control Panel)

# 2. Masuk ke folder backend
cd C:\xampp\htdocs\booksales-api

# 3. Install dependency (jika belum)
composer install

# 4. Siapkan environment
copy .env.example .env     # jika .env belum ada
php artisan key:generate

# 5. Buat database `booksales_api` di phpMyAdmin (jika belum ada), sesuaikan .env:
#    DB_DATABASE=booksales_api
#    DB_USERNAME=root
#    DB_PASSWORD=

# 6. Migrasi + data demo
php artisan migrate:fresh --seed

# 7. Jalankan server API
php artisan serve
```

API berjalan di **http://127.0.0.1:8000/api**.

### 4.3 Frontend React

```bash
cd C:\xampp\htdocs\booksales-fe
npm install
npm run dev
```

Buka **http://localhost:5173**.

Jika URL API berbeda, buat file `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 5. Akun Demo

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@booksales.com` | `admin123` |
| Customer | `budi@example.com` | `customer123` |

Data awal berisi 8 kategori, 9 author, dan 10 buku.

---

## 6. Alur Pembelian (Payment at Delivery)

1. User registrasi / login.
2. User mencari buku dan menekan **+ Keranjang**.
3. Di halaman **Keranjang**, user mengatur jumlah lalu klik **Lanjut ke Checkout**.
4. User mengisi alamat, no. HP, dan memilih **Payment at Delivery (COD)**.
5. Sistem membuat invoice `INV-YYYYMMDD-XXXXX`, mengurangi stok, dan mengosongkan keranjang.
6. Admin melihat pesanan di `/admin/orders`, mengubah status
   (`Menunggu → Diproses → Dikirim → Selesai`) dan menandai pembayaran lunas.
7. User memantau status di **Pesanan Saya**.

Status pesanan: `pending`, `processing`, `shipped`, `completed`, `cancelled`.
Status pembayaran: `unpaid`, `paid`, `failed`.

---

## 7. Integrasi Midtrans (Opsional)

1. Daftar akun Midtrans Sandbox dan ambil **Server Key** + **Client Key**.
2. Isi file `booksales-api/.env`:

```env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

3. Jalankan `php artisan config:clear`.
4. Di halaman checkout, pilih **Midtrans (Online)**.
5. Atur **Payment Notification URL** di dashboard Midtrans ke
   `http://<domain-anda>/api/payments/notification`.

Jika kunci Midtrans kosong, metode Midtrans akan ditolak dengan pesan agar menggunakan
Payment at Delivery. Aplikasi tetap berjalan penuh tanpa akun Midtrans.

---

## 8. Ringkasan Database

| Tabel | Fungsi | Relasi utama |
| --- | --- | --- |
| `users` | Admin & customer (name, username, email, role, phone, address) | hasMany `transactions`, `cart_items`, `messages` |
| `genres` | Kategori buku | hasMany `books` |
| `authors` | Data penulis | hasMany `books` |
| `books` | Data buku (judul, ISBN, harga, stok, cover, tahun, deskripsi) | belongsTo `genres`, `authors` |
| `cart_items` | Keranjang per user | belongsTo `users`, `books` |
| `transactions` | Pesanan (invoice, total, metode & status bayar, alamat) | belongsTo `users`, hasMany `transaction_items` |
| `transaction_items` | Detail buku pada pesanan (snapshot judul & harga) | belongsTo `transactions`, `books` |
| `messages` | Pesan Contact to Admin | belongsTo `users` (opsional) |
| `personal_access_tokens` | Token login Sanctum | belongsTo `users` |

---

## 9. Endpoint API Utama

| Method | Endpoint | Akses | Fungsi |
| --- | --- | --- | --- |
| POST | `/api/register` | Publik | Registrasi user |
| POST | `/api/login` | Publik | Login (mengembalikan token) |
| GET | `/api/me` | Login | Profil user aktif |
| POST | `/api/logout` | Login | Logout & hapus token |
| GET | `/api/books?q=&genre_id=&sort=&page=` | Publik | Katalog + pencarian |
| GET | `/api/books/{id}` | Publik | Detail buku |
| POST/PUT/DELETE | `/api/books` | Admin | CRUD buku |
| GET | `/api/genres` | Publik | Daftar kategori |
| POST/PUT/DELETE | `/api/genres` | Admin | CRUD kategori |
| GET | `/api/authors` | Publik | Daftar author |
| POST/PUT/DELETE | `/api/authors` | Admin | CRUD author |
| GET/POST/PUT/DELETE | `/api/cart` | Login | Keranjang |
| GET | `/api/my-orders` | Login | Pesanan milik user |
| POST | `/api/transactions` | Login | Checkout / buat pesanan |
| GET | `/api/transactions` | Admin | Semua pesanan |
| PUT | `/api/transactions/{id}/status` | Admin | Ubah status pesanan |
| PUT | `/api/transactions/{id}/paid` | Admin | Tandai lunas |
| GET | `/api/users` | Admin | List user terdaftar |
| POST | `/api/messages` | Publik | Kirim pesan ke admin |
| GET | `/api/messages` | Admin | List pesan |
| GET | `/api/stats` | Admin | Statistik dashboard |

---

## 10. Build Produksi

```bash
# Frontend
npm run build

# Backend (opsional)
php artisan config:cache
php artisan route:cache
```

## 11. Troubleshooting

- **`SQLSTATE[HY000] [2002]`** → MySQL belum berjalan. Jalankan MySQL dari XAMPP.
- **`419` / `Unauthenticated`** → login ulang; token tersimpan di `localStorage`.
- **CORS error** → pastikan frontend berjalan di `localhost:5173` dan backend di
  `127.0.0.1:8000`, lalu `php artisan config:clear`.
- **Data tidak muncul setelah migrasi** → jalankan `php artisan migrate:fresh --seed`.
- **Gambar cover tidak muncul** → pastikan file ada di `public/covers/` dan bisa dibuka
  lewat `http://localhost:5173/covers/<nama-file>.svg`, lalu hard refresh dengan
  **Ctrl + F5**. Browser kadang menyimpan cache gambar yang gagal dimuat sebelumnya;
  komponen `BookCover` sekarang mencoba ulang otomatis, tetapi hard refresh tetap
  disarankan setelah mengganti file cover.

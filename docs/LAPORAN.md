# Laporan Proyek — Aplikasi BookStore

> Dokumen ini dapat langsung dipakai sebagai kerangka laporan atau dipindahkan ke slide
> presentasi. Ganti bagian bertanda `[...]` dengan data diri / tautan milik Anda.

## Identitas

- **Nama**: [Nama Lengkap]
- **Kelas / Batch**: [Kelas]
- **Skenario**: Junior Web Developer — Aplikasi BookStore
- **Link GitHub Frontend**: [URL repository frontend]
- **Link GitHub Backend**: [URL repository backend]
- **Link Demo / Drive**: [URL]

---

## BAB 1 — Pendahuluan

### 1.1 Latar Belakang

Minat baca masyarakat perlu didukung oleh kemudahan akses terhadap buku. Toko buku
konvensional memiliki keterbatasan jangkauan dan jam operasional. Oleh karena itu dibuat
aplikasi **BookStore** berbasis web yang memungkinkan pembeli melihat katalog, mencari buku,
memasukkan buku ke keranjang, dan melakukan pemesanan secara online, sementara admin dapat
mengelola seluruh data buku dan pesanan.

### 1.2 Tujuan

1. Membangun aplikasi toko buku dengan dua aktor: **Admin** dan **User**.
2. Mengimplementasikan CRUD kategori, data buku, dan author.
3. Menyediakan registrasi, login, pencarian buku, keranjang, dan pemesanan.
4. Menyediakan halaman About Us dan Contact to Admin.
5. Menerapkan pembayaran **Payment at Delivery** dan opsi **Midtrans**.
6. Merancang database relasional MySQL yang mendukung seluruh fitur.

### 1.3 Ruang Lingkup

- Aplikasi berbasis web (responsif untuk desktop dan mobile).
- Autentikasi menggunakan token (Laravel Sanctum).
- Pembayaran utama: bayar sebelum buku dikirim (COD / Payment at Delivery).
- Integrasi Midtrans bersifat opsional dan dapat diaktifkan lewat konfigurasi server.

---

## BAB 2 — Analisis Kebutuhan

### 2.1 Aktor

| Aktor | Deskripsi |
| --- | --- |
| Admin | Mengontrol dan memonitor seluruh data buku, kategori, author, user, pesanan, dan pesan. |
| User (Customer) | Mencari buku, memasukkan ke keranjang, checkout, dan memantau pesanan. |

### 2.2 Kebutuhan Fungsional

| Kode | Kebutuhan | Aktor |
| --- | --- | --- |
| F-01 | Registrasi user | User |
| F-02 | Login / logout user | User, Admin |
| F-03 | Melihat halaman About Us | User |
| F-04 | Mengirim pesan ke admin | User |
| F-05 | Pencarian buku (judul/penulis/ISBN) + filter kategori | User |
| F-06 | Add to cart dan ubah jumlah | User |
| F-07 | Checkout dengan Payment at Delivery | User |
| F-08 | Melihat riwayat & status pesanan | User |
| F-09 | CRUD kategori buku | Admin |
| F-10 | CRUD data buku | Admin |
| F-11 | CRUD author | Admin |
| F-12 | Melihat daftar user terdaftar | Admin |
| F-13 | Melihat & memproses seluruh pesanan | Admin |
| F-14 | Melihat & membalas pesan kontak | Admin |
| F-15 | Dashboard statistik toko | Admin |

### 2.3 Kebutuhan Non-Fungsional

- Antarmuka responsif dan mudah digunakan.
- Password disimpan dalam bentuk hash (bcrypt).
- Endpoint admin dilindungi middleware role.
- Validasi input di sisi server dan klien.
- Stok berkurang otomatis saat checkout dan kembali saat pesanan dibatalkan.
- API mengembalikan JSON dengan status HTTP yang sesuai.

---

## BAB 3 — Perancangan Sistem

### 3.1 Arsitektur

```
┌──────────────────────────┐        HTTP/JSON        ┌──────────────────────────┐
│  React + Vite + Tailwind │  ───────────────────▶   │   Laravel 12 REST API    │
│  (localhost:5173)        │  ◀───────────────────   │   (127.0.0.1:8000)       │
└──────────────────────────┘   Bearer Token (Sanctum)└────────────┬─────────────┘
                                                                  │ Eloquent
                                                         ┌────────▼────────┐
                                                         │  MySQL / MariaDB │
                                                         │  booksales_api   │
                                                         └─────────────────┘
```

### 3.2 Relasi Database (ERD Ringkas)

```
users (1) ──── (N) transactions (1) ──── (N) transaction_items (N) ──── (1) books
  │                                                                        │
  ├──── (N) cart_items (N) ──────────────── (1) books (N) ──── (1) genres   │
  │                                                 │                      │
  └──── (N) messages                                └──── (1) authors ──────┘
```

### 3.3 Struktur Tabel

| Tabel | Kolom penting |
| --- | --- |
| `users` | id, name, username, email, role (admin/customer), phone, address, password |
| `genres` | id, name, description |
| `authors` | id, name, email, bio |
| `books` | id, genre_id, author_id, title, isbn, description, price, stock, cover_url, publication_year |
| `cart_items` | id, user_id, book_id, qty (unik per user+book) |
| `transactions` | id, user_id, invoice_number, total_price, payment_method, payment_status, status, shipping_address, phone, notes, paid_at |
| `transaction_items` | id, transaction_id, book_id, title, price, qty, subtotal |
| `messages` | id, user_id, name, email, subject, message, is_read |

### 3.4 Alur Checkout

1. User menekan **Beli Sekarang** / **Lanjut ke Checkout**.
2. Sistem memvalidasi stok setiap item.
3. Sistem membuat `transactions` + `transaction_items` dalam satu transaksi database.
4. Stok buku dikurangi dan `cart_items` user dihapus.
5. Admin memproses status: `pending → processing → shipped → completed`.
6. Jika pesanan dibatalkan, stok dikembalikan otomatis.

---

## BAB 4 — Implementasi

### 4.1 Teknologi

- **Frontend**: React 19, Vite, React Router, Tailwind CSS, Axios.
- **Backend**: PHP 8.2, Laravel 12, Laravel Sanctum.
- **Database**: MySQL (XAMPP).
- **Pembayaran**: Payment at Delivery (COD) dan Midtrans Snap (opsional).

### 4.2 Halaman yang Dibuat

**Publik / User**

| Halaman | Deskripsi |
| --- | --- |
| Beranda | Hero, pencarian, kategori, buku terbaru |
| Koleksi Buku | Pencarian, filter kategori, sorting, pagination |
| Detail Buku | Cover, deskripsi, harga, stok, tambah keranjang |
| Tentang Kami | Profil, misi, visi, keunggulan toko |
| Kontak | Form pesan ke admin + informasi kontak |
| Login / Registrasi | Autentikasi dengan validasi |
| Keranjang | Ubah jumlah, hapus item, ringkasan |
| Checkout | Alamat, no. HP, metode pembayaran |
| Pesanan Saya | Riwayat, status, detail item |

**Admin**

| Halaman | Deskripsi |
| --- | --- |
| Dashboard | Statistik buku, pesanan, user, pesan, pendapatan |
| Data Buku | CRUD lengkap dengan cover, kategori, author, harga, stok |
| Kategori | CRUD kategori |
| Author | CRUD author |
| Pesanan | Filter status, detail pesanan, ubah status, tandai lunas |
| User Terdaftar | Daftar customer + jumlah pesanan |
| Pesan Masuk | Baca, tandai dibaca, balas email, hapus |

### 4.3 Screenshot (lampirkan saat membuat laporan)

1. Halaman Beranda
2. Halaman Koleksi Buku + hasil pencarian
3. Detail Buku
4. Keranjang & Checkout
5. Halaman Pesanan Saya
6. Dashboard Admin
7. CRUD Data Buku
8. Daftar Pesanan Admin
9. List User Terdaftar
10. Halaman Kontak & Pesan Masuk

---

## BAB 5 — Pengujian

Pengujian dilakukan secara manual dan melalui API. Hasil pengujian:

| No | Skenario | Hasil |
| --- | --- | --- |
| 1 | Registrasi user baru dengan data valid | Berhasil, user tersimpan dengan role customer |
| 2 | Registrasi dengan email/username duplikat | Ditolak dengan pesan validasi |
| 3 | Login admin | Berhasil, mendapatkan token dan role admin |
| 4 | Login dengan password salah | Ditolak (422) |
| 5 | Akses endpoint admin tanpa token | Ditolak (401) |
| 6 | Akses endpoint admin dengan token customer | Ditolak (403) |
| 7 | Pencarian buku "laskar" | Menampilkan Laskar Pelangi |
| 8 | Filter kategori & sorting harga | Sesuai parameter |
| 9 | Tambah buku ke keranjang | Item muncul, total sesuai |
| 10 | Tambah melebihi stok | Ditolak dengan pesan sisa stok |
| 11 | Checkout COD | Invoice dibuat, stok berkurang, keranjang kosong |
| 12 | Checkout dengan keranjang kosong | Ditolak (422) |
| 13 | Admin mengubah status pesanan | Status tersimpan |
| 14 | Admin menandai lunas | `payment_status` menjadi paid |
| 15 | Kirim pesan kontak | Muncul di halaman pesan admin |
| 16 | Hapus kategori yang dipakai buku | Kategori terhapus, buku tetap ada (genre null) |

---

## BAB 6 — Kesimpulan

### 6.1 Kesimpulan

Aplikasi BookStore berhasil dibangun dengan Laravel sebagai backend REST API, MySQL sebagai
basis data, dan React sebagai antarmuka. Seluruh fitur yang diminta untuk Admin dan User telah
diimplementasikan, termasuk CRUD kategori/buku, registrasi dan login, pencarian buku,
keranjang, checkout dengan Payment at Delivery, daftar user, daftar pesanan, About Us, dan
Contact to Admin. Integrasi Midtrans disediakan sebagai opsi pembayaran online.

### 6.2 Saran Pengembangan

- Menambahkan upload cover buku langsung dari admin (storage Laravel).
- Menambahkan notifikasi email/WhatsApp saat status pesanan berubah.
- Menambahkan laporan penjualan yang dapat diekspor ke PDF/Excel.
- Menambahkan fitur ulasan dan rating buku.
- Menambahkan halaman profil user untuk mengubah alamat.

---

## Lampiran

### Akun Demo

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@booksales.com | admin123 |
| Customer | budi@example.com | customer123 |

### Cara Menjalankan Singkat

```bash
# Backend
cd C:\xampp\htdocs\booksales-api
php artisan migrate:fresh --seed
php artisan serve

# Frontend
cd C:\xampp\htdocs\booksales-fe
npm install
npm run dev
```

### Kerangka Slide Presentasi (10–12 slide)

1. **Judul** — BookStore, nama, kelas.
2. **Latar Belakang & Tujuan**.
3. **Aktor & Fitur** — tabel Admin vs User.
4. **Teknologi** — Laravel, MySQL, React, Tailwind.
5. **Arsitektur Sistem** — diagram FE → API → DB.
6. **ERD & Struktur Database**.
7. **Demo Admin** — dashboard, CRUD buku, list user, pesanan.
8. **Demo User** — registrasi, login, pencarian, keranjang.
9. **Demo Checkout** — Payment at Delivery & status pesanan.
10. **Contact to Admin & About Us**.
11. **Pengujian** — ringkasan hasil.
12. **Kesimpulan, kendala, dan tautan repository**.

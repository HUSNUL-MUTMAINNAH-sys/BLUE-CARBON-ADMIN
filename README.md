# Web Admin - Kelurahan Karbon Biru

Web Admin untuk mengelola data lahan budidaya rumput laut dengan fitur CRUD lengkap.

## Fitur

### 📊 Dashboard
- Total lahan
- Total pembudidaya
- Total luas lahan
- Lahan aktif
- Total siklus

### 📋 Data Lahan (CRUD)
- **Create** - Tambah lahan baru
- **Read** - Lihat semua data lahan dalam tabel
- **Update** - Edit data lahan existing
- **Delete** - Hapus data lahan dengan konfirmasi

### Form Data Lahan
- Nama Pembudidaya
- Lokasi
- Deskripsi Lokasi
- Luas (hektar)
- Siklus
- Status (Aktif | Dalam Pendataan | Tidak Aktif)
- Harga (Rupiah)
- Latitude & Longitude (terpisah)
- URL Gambar

## Teknologi

- React 19 + Vite
- React Router (BrowserRouter)
- Framer Motion

## Instalasi

```bash
npm install
```

## Menjalankan Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5174`

**PENTING:** Pastikan Backend API sudah berjalan di `http://localhost:3001`

## Build Production

```bash
npm run build
```

## Navigasi

```
Dashboard | Data Lahan
```

## Alur Kerja

1. **Dashboard** - Lihat ringkasan data
2. **Data Lahan** - Lihat tabel semua lahan
3. **Tambah Lahan** - Form tambah data baru
4. **Edit Lahan** - Form edit data existing
5. **Hapus Lahan** - Modal konfirmasi hapus

## Koneksi API

Web Admin menggunakan semua endpoint CRUD:

- `GET /api/lahan` - Mengambil semua data
- `GET /api/lahan/:id` - Mengambil detail untuk edit
- `POST /api/lahan` - Menambahkan data baru
- `PUT /api/lahan/:id` - Mengupdate data
- `DELETE /api/lahan/:id` - Menghapus data

## Aksi Tabel

| Icon | Aksi | Fungsi |
|------|------|--------|
| 👁️ | Lihat | View detail (coming soon) |
| ✏️ | Edit | Edit data lahan |
| 🗑️ | Hapus | Hapus data (dengan konfirmasi) |

## Keamanan

⚠️ Web Admin ini tidak memiliki sistem autentikasi. Untuk production, tambahkan:
- Login / Authentication
- Authorization / Roles
- Session Management
- HTTPS only
# BLUE-CARBON-ADMIN

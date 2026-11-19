# 🏆 Lelang GP 5K — TikTok Live Platform (V4 Production)
> **Production React Single-File Architecture** • QRIS Integration • Verifikasi Mutasi DANA/Bank • Hardcoded Admin Security • Web Audio API Wheel Spin

---

## 🔐 Kredensial & Konfigurasi Hardcoded
- **Admin Verification:**
  - **Username:** `Jeyssen`
  - **Password:** `2772772`
- **WhatsApp Official Host:** `6287747091072`
- **Nominal Kupon:** `Rp5.000` / kupon
- **Default Hadiah:** `35.000 GP`
- **Default Slot:** `15 Kupon`

---

## 🌟 Fitur Baru V4 Production

### 1. Checkout Modal dengan QRIS & Input Nama Pengirim (Mutasi)
- **Tampilan QRIS Resmi:** Menampilkan barcode QRIS standar nasional atas nama merchant **LELANG GP 5K — BANG JEYSSEN** (NMID: ID1024887747091) dengan nominal Rp5.000.
- **Input Wajib Nama Pengirim:** Penonton wajib mengisi *"Nama Pengirim / Akun Transfer (Sesuai Mutasi DANA / Bank)"*.
- **Direct Deep-Link WhatsApp:** Tombol konfirmasi langsung mengarahkan ke chat WhatsApp Bang Jeyssen dengan format pesan lengkap:
  ```
  Halo Bang Jeyssen! Saya mau konfirmasi pembayaran Lelang GP 5K:
  • Username TikTok: @username
  • Nomor Kupon: #04
  • Nama Pengirim / Mutasi: Budi Santoso (DANA)
  • Total Transfer: Rp5.000
  Bukti transfer sudah saya kirim ya Bang! Mohon segera diverifikasi. Terima kasih.
  ```

### 2. Panel Admin: Antrean Verifikasi Mutasi Real-Time
- Saat penonton mengirimkan pesanan kupon, status kupon berubah menjadi **⏳ Menunggu Verifikasi** (warna amber).
- Di **Admin Mode** (setelah login `Jeyssen` / `2772772`), host melihat daftar antrean pembayaran lengkap dengan Nomor Kupon, Username TikTok, dan **Nama Pengirim Mutasi**.
- Host cukup memeriksa mutasi di HP, lalu mengklik **[✓ Approve (Kunci Slot)]** untuk mengunci kupon secara resmi dengan tanda centang hijau!

### 3. Roda Undian Presisi Fisika & Web Audio API
- Hanya peserta yang berstatus **Terverifikasi (Lunas)** yang masuk ke irisan roda undian.
- Efek suara putaran tick mekanis & lonceng kemenangan (*victory chime*) via Web Audio API murni.
- Semburan partikel confetti dan modal pengumuman pemenang dengan teks *pinned comment* siap salin 1-klik.

### 4. Background Interaktif `ShapeGrid` & Tipografi Bervariasi
- Background kanvas geometris interaktif bereaksi terhadap gerakan kursor dan sentuhan.
- Mengombinasikan **Plus Jakarta Sans** (headline), **Space Grotesk** (badge/aksen), **JetBrains Mono** (angka tabular), dan **Inter** (teks UI).

---

## 🚀 Cara Menjalankan & Deploy ke Vercel

### 1. Buka Langsung di Browser
Buka berkas [index.html](file:///C:/Users/Windows%2011/.gemini/antigravity/scratch/lelang-gp-5k/index.html) di browser Google Chrome atau Microsoft Edge.

### 2. Deploy ke Vercel (Aktif Selamanya)
1. Buka [vercel.com/new](https://vercel.com/new).
2. *Drag & drop* folder proyek:
   `C:\Users\Windows 11\.gemini\antigravity\scratch\lelang-gp-5k`
3. Berkas `vercel.json` sudah terkonfigurasi. Klik **Deploy** dan URL aktif selamanya langsung terbit dalam 15 detik!

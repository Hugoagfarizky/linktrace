# Panduan Kontribusi - LinkTrace

Terima kasih atas ketertarikan Anda untuk berkontribusi pada **LinkTrace**! Dokumen ini berisi panduan alur kerja untuk mengembangkan, menguji, dan mengirimkan kontribusi ke repositori ini.

---

## 🛠️ Persiapan Lingkungan Pengembangan

### 1. Prasyarat
- **Node.js**: Versi 18 atau lebih baru (disarankan Node.js 22+ atau 24)
- **npm**: Versi 10+
- **PostgreSQL**: Database lokal atau cloud (misal Neon, Supabase)
- **Git**

### 2. Langkah Instalasi
```bash
# Fork & clone repositori
git clone https://github.com/Hugoagfarizky/linktrace.git
cd linktrace

# Instal dependensi
npm install

# Buat berkas konfigurasi environment
cp .env.example .env
# Sesuaikan DATABASE_URL dan JWT_SECRET di berkas .env

# Generate Prisma Client
npx prisma generate
```

---

## 🚀 Alur Kerja Kontribusi

1. **Buat Branch Baru**
   Gunakan konvensi penamaan branch yang jelas:
   - `feat/nama-fitur` (untuk fitur baru)
   - `fix/nama-bug` (untuk perbaikan bug)
   - `docs/pembaruan-dokumentasi` (untuk dokumentasi)
   - `refactor/nama-modul` (untuk refaktorisasi kode)

2. **Kembangkan dan Pastikan Konsistensi Kode**
   - Gunakan TypeScript secara ketat (hindari tipe `any`).
   - Ikuti struktur arsitektur modular yang ada di `src/app/` dan `src/lib/`.
   - Gunakan Tailwind CSS dan semantic HTML (misal `<dialog>` untuk modal) sesuai standar UI LinkTrace.
   - Semua input API wajib divalidasi menggunakan skema Zod di `src/lib/validations/`.

3. **Jalankan Pengujian Otomatis**
   Pastikan seluruh rangkaian pengujian unit dan integrasi lolos tanpa error sebelum membuat commit:
   ```bash
   npm test
   ```
   Pastikan juga build produksi berhasil:
   ```bash
   npm run build
   ```

4. **Konvensi Pesan Commit**
   Gunakan format Conventional Commits:
   - `feat: tambah dukungan ekspor data analitik CSV`
   - `fix: perbaiki penguraian referrer t.co pada click tracker`
   - `docs: perbarui panduan setup database di README`
   - `test: tambah kasus uji untuk redirect expiration`

5. **Kirimkan Pull Request (PR)**
   - Buat PR ke branch `main`.
   - Berikan deskripsi yang jelas tentang perubahan yang dibuat, motivasi, dan tangkapan layar jika memodifikasi antarmuka pengguna.
   - Pastikan alur GitHub Actions CI berjalan dengan status hijau (lulus).

---

## 💡 Pelaporan Isu (Bug Report & Feature Request)

- Gunakan **GitHub Issues** untuk melaporkan bug atau mengajukan ide fitur baru.
- Sertakan langkah-langkah reproduksi yang jelas, ekspektasi perilaku, serta log atau cuplikan layar yang relevan.

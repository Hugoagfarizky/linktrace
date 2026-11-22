# Kebijakan Keamanan (Security Policy) - LinkTrace

Keamanan dan privasi data pengguna adalah prioritas utama dalam pengembangan **LinkTrace**. Kami menghargai upaya para peneliti keamanan dan komunitas open-source dalam membantu kami menjaga keamanan platform.

---

## 🛡️ Versi yang Didukung

Pembaruan keamanan aktif diberikan untuk versi stabil terbaru:

| Versi | Didukung |
| --- | --- |
| 1.0.x (main branch) | :white_check_mark: |
| < 1.0.0 | :x: |

---

## 🚨 Melaporkan Kerentanan Keamanan

Jika Anda menemukan potensi celah keamanan atau kerentanan pada LinkTrace, **mohon untuk tidak membuka issue publik di GitHub**.

Ikuti langkah-langkah pelaporan bertanggung jawab (*responsible disclosure*) berikut:

1. **Kirim Email Langsung:**
   Kirimkan detail temuan ke:
   📧 **nugrahaagfarizky@gmail.com**

2. **Informasi yang Diperlukan:**
   - Ringkasan kerentanan dan dampaknya.
   - Langkah-langkah detail untuk mereproduksi masalah (*proof of concept*).
   - Lingkungan pengujian (versi Node.js, OS, browser, konfigurasi terkait).
   - Saran perbaikan atau mitigasi (jika ada).

3. **Waktu Respons:**
   - **Konfirmasi Penerimaan:** Kami berusaha memberikan konfirmasi awal dalam waktu **48 jam** setelah laporan diterima.
   - **Analisis & Patch:** Kami akan memvalidasi masalah dan mengupayakan perbaikan dalam kurun waktu **7 hari kerja** tergantung tingkat keparahan (*severity*).
   - **Publikasi:** Kami akan mengumumkan perbaikan dan memberikan penghargaan (*credit*) kepada pelapor setelah patch berhasil dirilis.

---

## 🔒 Praktik Keamanan Terpasang di LinkTrace

- **HTTP Security Headers:** Dikonfigurasi di `next.config.ts` (termasuk HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, dan Referrer-Policy strict-origin-when-cross-origin).
- **Proteksi Akses & Workspace:** Autentikasi berbasis token JWT terverifikasi dan isolasi data per workspace.
- **Privasi Pengunjung:** Pelacakan klik tidak pernah menyimpan IP mentah pengunjung; IP di-hash dengan rotasi salt harian untuk menghitung metrik pengunjung unik tanpa melacak individu.

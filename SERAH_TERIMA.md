# Dokumen Serah Terima Sistem
## `bprperdana-eform` — Customer Frontend

**PT BPR Daya Perdana Nusantara**
**Divisi IT — Sistem eForm Onboarding Digital**

---

| | |
|---|---|
| **Tanggal Serah Terima** | 27 Agustus 2026 |
| **Diserahkan oleh** | Tim Pengembang |
| **Diterima oleh** | Abdi — IT Section Head |
| **Repository** | https://github.com/cappyHoding/bprperdana-eform |
| **Branch Utama** | `master` |

---

## 1. Ringkasan Sistem

`bprperdana-eform` adalah aplikasi web customer-facing untuk sistem eForm Onboarding Digital BPR Perdana. Nasabah menggunakan aplikasi ini untuk mengajukan produk perbankan (Tabungan, Deposito, Pinjaman, Pengkinian Data) secara digital — mulai dari pengisian formulir, verifikasi KTP, liveness check, hingga penandatanganan kontrak elektronik.

---

## 2. Stack Teknologi

| Komponen | Teknologi | Versi |
|---|---|---|
| Framework | React | 18.3.1 |
| Bahasa | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| UI Components | shadcn/ui (Radix UI) | - |
| Styling | Tailwind CSS | 3.4.x |
| State Server | TanStack Query | v5 |
| HTTP Client | Axios | 1.x |
| Routing | React Router DOM | v6 |
| Form Handling | React Hook Form + Zod | - |
| Internasionalisasi | i18next + react-i18next | - |
| Notifikasi | Sonner (toast) | - |
| eKYC SDK | vida-web-sdk | 1.0.6-sandbox |
| PWA | vite-plugin-pwa | - |
| Containerisasi | Docker | - |

---

## 3. Struktur Direktori

```
bprperdana-eform/
├── src/
│   ├── App.tsx               # Root app + routing
│   ├── main.tsx              # Entry point
│   ├── pages/                # Halaman utama
│   │   ├── Landing.tsx       # Halaman beranda / pilih produk
│   │   ├── StatusTrackingPage.tsx  # Cek status aplikasi
│   │   ├── ESignAgreementPage.tsx  # Halaman TOS e-Sign
│   │   ├── SignSuccessPage.tsx     # Konfirmasi setelah tanda tangan
│   │   ├── SignFailedPage.tsx      # Halaman gagal tanda tangan
│   │   └── NotFound.tsx
│   ├── features/             # Wizard per produk
│   │   ├── tabungan/         # Wizard pendaftaran Tabungan
│   │   ├── deposito/         # Wizard pendaftaran Deposito
│   │   ├── pinjaman/         # Wizard pengajuan Pinjaman
│   │   ├── pengkinian/       # Wizard Pengkinian Data
│   │   └── ekyc/             # Komponen eKYC (Liveness)
│   ├── components/           # Komponen reusable
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── OTPVerification.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api/              # Fungsi API call (applicationApi.ts, dll)
│   │   └── utils.ts
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── i18n/                 # File terjemahan (id, en)
│   └── assets/               # Gambar, ikon, dll
├── public/                   # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── Dockerfile
├── .env.example
└── package.json
```

---

## 4. Halaman & Fitur yang Telah Diimplementasikan

### 4.1 Halaman Utama (Landing)

- Tampilan beranda dengan pilihan produk
- Navigasi ke wizard sesuai produk yang dipilih
- Link "Cek Status Aplikasi"

### 4.2 Wizard Multi-Langkah (per Produk)

Semua wizard mengikuti alur yang sama:

| Step | Komponen | Keterangan |
|---|---|---|
| 1 | Persetujuan S&K | Nasabah setuju syarat & ketentuan |
| 2 | Formulir Awal | Nama, NIK, nomor HP, produk |
| 3 | OCR KTP | Upload foto KTP → proses via VIDA OCR |
| 4 | Konfirmasi Data | Edit/konfirmasi hasil OCR KTP |
| 5 | Verifikasi OTP | Input kode OTP yang dikirim via SMS |
| 6 | Liveness Check | Selfie via VIDA Web SDK |
| 7 | Data Tambahan | Info rekening / agunan sesuai produk |
| 8 | Review & Submit | Ringkasan + submit ke admin |

**Wizard yang tersedia:**
- `/tabungan` — Pembukaan Rekening Tabungan
- `/deposito` — Pembukaan Deposito
- `/pinjaman` — Pengajuan Pinjaman
- `/pengkinian-data` — Pembaruan Data Nasabah

### 4.3 Cek Status Aplikasi (`/cek-status`)

- Nasabah dapat memantau status pengajuan dengan memasukkan NIK + nomor HP
- Tampilkan status real-time: Draft, Dalam Review, Disetujui, Ditolak, Kontrak Dikirim, Selesai

### 4.4 eKYC — VIDA Web SDK

- Liveness detection menggunakan `vida-web-sdk` (versi sandbox: `1.0.6-sandbox`)
- Flow: `GET /applications/:id/liveness/token` → inisialisasi SDK → `POST /applications/:id/liveness`

### 4.5 e-Sign Agreement (`/esign-agreement`)

- Halaman TOS (Terms of Service) untuk penandatanganan elektronik
- Nasabah menyetujui sebelum proses e-Sign via VIDA Direct Sign
- Setelah tanda tangan: redirect ke `/sign-success` atau `/sign-failed`

### 4.6 Sign Success (`/sign-success`)

- Konfirmasi bahwa kontrak telah berhasil ditandatangani
- Upload bukti jika diperlukan

### 4.7 Internasionalisasi (i18n)

- Mendukung Bahasa Indonesia (`id`) dan English (`en`)
- Menggunakan `i18next` + `react-i18next`

### 4.8 PWA (Progressive Web App)

- Dapat di-install di mobile sebagai app
- Konfigurasi via `vite-plugin-pwa`

---

## 5. Konfigurasi Environment

Salin `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

| Variabel | Keterangan |
|---|---|
| `VITE_API_BASE_URL` | URL backend API (ptdpn-eform-service) |
| `VITE_VIDA_SDK_*` | Konfigurasi VIDA Web SDK |

---

## 6. Cara Menjalankan

### Development

```bash
npm install
npm run dev
# Berjalan di http://localhost:3000 (atau port yang dikonfigurasi)
```

### Production Build

```bash
npm run build
# Output di folder dist/
```

### Docker

```bash
docker build -t bprperdana-eform .
docker run -p 80:80 bprperdana-eform
```

---

## 7. Routing

| Path | Halaman | Keterangan |
|---|---|---|
| `/` | Landing | Beranda, pilih produk |
| `/tabungan` | TabunganWizard | Wizard pembukaan tabungan |
| `/deposito` | DepositoWizard | Wizard pembukaan deposito |
| `/pinjaman` | PinjamanWizard | Wizard pengajuan pinjaman |
| `/pengkinian-data` | PengkinianWizard | Wizard pengkinian data |
| `/cek-status` | StatusTrackingPage | Cek status aplikasi |
| `/esign-agreement` | ESignAgreementPage | TOS e-Sign |
| `/sign-success` | SignSuccessPage | Sukses tanda tangan |
| `/sign-failed` | SignFailedPage | Gagal tanda tangan |

---

## 8. Pola Kode yang Harus Diikuti

### API Call — JANGAN inline di component

```typescript
// BENAR: taruh di src/lib/api/applicationApi.ts
export async function submitOCR(appId: string, data: OCRInput): Promise<OCROutput> {
  const res = await client.post<ApiResponse<OCROutput>>(`/applications/${appId}/ocr`, data);
  return res.data.data;
}
```

### Error Handling di Wizard

```typescript
try {
  await submitOCR(appId, data);
  goNext();
} catch (err: any) {
  setStepError(err.message || 'Gagal memproses KTP.');
  toast.error('Gagal', { description: err.message });
} finally {
  setSubmitting(false);
}
```

### TypeScript — Tidak Boleh `any`

```typescript
// SALAH
const data: any = response.data;

// BENAR
const data: ApplicationDetail = response.data;
```

---

## 9. Keamanan

| Aspek | Implementasi |
|---|---|
| Session Token | Disimpan di memory/sessionStorage (bukan localStorage) |
| API Token | Dikirim via header `X-Session-Token` |
| Tidak ada secret di frontend | Semua credential ada di backend |
| Akses file KTP/Selfie | Via API backend authenticated, bukan URL publik |

---

## 10. Item Pending / Perlu Perhatian

| Item | Status | Keterangan |
|---|---|---|
| VIDA SDK versi production | BLOCKED | Saat ini masih pakai versi sandbox |
| Domain production | TODO | Perlu konfigurasi `VITE_API_BASE_URL` ke URL production |
| PWA icon & manifest | TODO | Perlu disesuaikan dengan branding BPR Perdana |
| SEO / meta tags | TODO | Halaman-halaman perlu meta description yang sesuai |

---

## 11. Referensi

| | |
|---|---|
| **Repository** | https://github.com/cappyHoding/bprperdana-eform |
| **Backend API** | https://github.com/cappyHoding/ptdpn-eform-service |
| **VIDA Web SDK** | https://docs.vida.id |

---

*Dokumen ini dibuat pada 27 Agustus 2026 sebagai bagian dari proses serah terima sistem eForm Onboarding Digital PT BPR Daya Perdana Nusantara.*

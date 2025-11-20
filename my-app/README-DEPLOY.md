# Instruksi Deploy ke Vercel

## ⚠️ PENTING: Masalah Database

Aplikasi ini menggunakan file-based database (`data/database.json`) yang **TIDAK AKAN BEKERJA** di Vercel karena filesystem di Vercel adalah read-only.

### Solusi yang Disarankan:

1. **Vercel Postgres** (Recommended)
   - Gratis untuk tier Hobby
   - Terintegrasi dengan Vercel
   - Setup: https://vercel.com/docs/storage/vercel-postgres

2. **Supabase**
   - Gratis tier tersedia
   - PostgreSQL database
   - Setup: https://supabase.com

3. **PlanetScale**
   - MySQL compatible
   - Gratis tier tersedia
   - Setup: https://planetscale.com

## Langkah Deploy

### Opsi 1: Deploy via Vercel Dashboard (Recommended)

1. Push code ke GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Buka https://vercel.com
3. Login dengan GitHub
4. Klik "Add New Project"
5. Import repository Anda
6. Vercel akan otomatis detect Next.js
7. Klik "Deploy"

### Opsi 2: Deploy via CLI

```bash
# Login ke Vercel
npx vercel login

# Deploy
npx vercel

# Untuk production
npx vercel --prod
```

## Environment Variables (jika menggunakan database eksternal)

Setelah setup database, tambahkan environment variables di Vercel Dashboard:
- `DATABASE_URL` - Connection string untuk database
- Atau variables sesuai dengan database yang digunakan

## Catatan

- Pastikan `.env` dan `data/database.json` ada di `.gitignore` (sudah ada)
- Build sudah berhasil dan siap untuk deploy
- Setelah deploy, pastikan untuk setup database eksternal


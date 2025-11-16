# Web Temen - Bimbingan Konseling SMK Taruna Bhakti

Platform bimbingan konseling untuk SMK Taruna Bhakti yang memungkinkan siswa untuk memilih guru BK dan membuat jadwal konseling.

## Fitur

- ✅ Login untuk Siswa, Guru BK, Admin, dan Super Admin
- ✅ Dashboard untuk setiap role
- ✅ Pilih guru BK dan buat jadwal konseling
- ✅ Kelola jadwal konseling
- ✅ History konseling
- ✅ Notifikasi
- ✅ Dark theme UI

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- JSON Database (File-based)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone https://github.com/KADEZ-406/web-temen.git
cd web-temen
```

2. Install dependencies
```bash
npm install
```

3. Initialize database
```bash
node scripts/init-database.js
```

4. Run development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

### Super Admin
- Email: `superadmin@smktarunabhakti.sch.id`
- Username: `superadmin`
- Password: `password123`

### Admin
- Email: `admin@smktarunabhakti.sch.id`
- Username: `admin01`
- Password: `password123`

### Guru BK
- Email: `siti.aminah@smktarunabhakti.sch.id` (atau email guru lainnya)
- Password: `password123`

### Siswa
- NISN: `1234567890`
- Password: `password123`

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── guru/              # Guru BK pages
│   ├── home/              # Home & dashboard pages
│   ├── login/             # Login pages
│   └── profile/           # Profile pages
├── lib/                    # Utility libraries
│   ├── db-json.ts         # JSON database implementation
│   └── types/             # TypeScript types
├── data/                   # Database files (gitignored)
└── scripts/                # Utility scripts
```

## Deployment

This project is configured for deployment on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KADEZ-406/web-temen)

## License

MIT

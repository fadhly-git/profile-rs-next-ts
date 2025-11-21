# 📚 Dokumentasi Lengkap Project RS PKU Muhammadiyah Boja

## 📋 Daftar Isi

1. Gambaran Umum Project
2. Arsitektur & Teknologi
3. Struktur Direktori
4. Konfigurasi Environment
5. Database & Prisma ORM
6. Fitur-Fitur Lengkap
7. API Endpoints
8. Styling & UI Components
9. Development Guide
10. Deployment & Production
11. Troubleshooting
12. Best Practices
13. Maintenance & Monitoring

---

## 1. Gambaran Umum Project

### 1.1 Deskripsi
Website profil RS PKU Muhammadiyah Boja adalah aplikasi web modern yang dibangun dengan **Next.js 15** dan **TypeScript**. Project ini menggunakan **App Router** untuk routing yang lebih efisien dan **Prisma ORM** untuk manajemen database MySQL.

### 1.2 Tujuan Project
- ✅ Menyediakan informasi lengkap tentang rumah sakit
- ✅ Menampilkan profil dokter dan jadwal praktek
- ✅ Publikasi berita dan artikel kesehatan
- ✅ Menampilkan indikator mutu layanan
- ✅ Manajemen konten dinamis melalui CMS
- ✅ Responsive design untuk semua device

### 1.3 Target Pengguna
- **Pengunjung/Pasien**: Mencari informasi RS, dokter, dan jadwal
- **Admin**: Mengelola konten website
- **Staff RS**: Melihat dan update informasi

---

## 2. Arsitektur & Teknologi

### 2.1 Tech Stack

#### Frontend
- **Next.js 15**: React framework dengan App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS v4**: Utility-first CSS framework
- **React 19**: UI library

#### Backend
- **Next.js API Routes**: Serverless API
- **Prisma ORM**: Database toolkit
- **MySQL**: Relational database
- **NextAuth.js**: Authentication (configured)

#### DevOps & Tools
- **PM2**: Process manager untuk production
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control

### 2.2 Arsitektur Aplikasi

```
┌─────────────────────────────────────────┐
│         Client (Browser)                │
│  - React Components                     │
│  - Client-side Navigation               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Next.js App Router                 │
│  - Server Components                    │
│  - Client Components                    │
│  - API Routes                           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Prisma ORM                      │
│  - Database Queries                     │
│  - Type-safe Models                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         MySQL Database                  │
│  - Data Storage                         │
│  - Relational Data                      │
└─────────────────────────────────────────┘
```

### 2.3 Design Patterns

- **Server-First Rendering**: Menggunakan Server Components untuk performa optimal
- **API Route Handlers**: RESTful API menggunakan Next.js Route Handlers
- **Component-Based Architecture**: Reusable React components
- **Type Safety**: Full TypeScript coverage
- **Prisma Schema First**: Database schema sebagai single source of truth

---

## 3. Struktur Direktori

### 3.1 Root Directory

```
profile-rs-next-ts/
├── .next/                      # Build output Next.js (auto-generated)
├── node_modules/               # NPM dependencies (auto-generated)
├── prisma/                     # Prisma schema & seeds
├── public/                     # Static assets
├── src/                        # Source code
├── .env                        # Environment variables (DO NOT COMMIT)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── components.json            # shadcn/ui configuration
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # NPM dependencies & scripts
├── postcss.config.mjs         # PostCSS configuration
├── README.md                  # Project readme
├── server.mjs                 # Custom server (optional)
└── tsconfig.json              # TypeScript configuration
```

### 3.2 Prisma Directory

```
prisma/
├── schema.prisma              # Database schema definition
├── seed.ts                    # Main seeding file
└── seed/                      # Individual seed files
    ├── user.ts               # Seed users
    ├── kategori.ts           # Seed categories
    ├── websiteSettings.ts    # Seed website settings
    ├── heroSection.ts        # Seed hero sections
    ├── aboutUsSection.ts     # Seed about us
    ├── featureBlocks.ts      # Seed feature blocks
    ├── promotions.ts         # Seed promotions
    ├── kategoriSpesialis.ts  # Seed specialist categories
    ├── dokters.ts            # Seed doctors
    ├── dokterSpesialis.ts    # Seed doctor specializations
    ├── jadwalDokters.ts      # Seed doctor schedules
    ├── beritas.ts            # Seed news/articles
    ├── halaman.ts            # Seed pages
    └── indikatorMutu.ts      # Seed quality indicators
```

### 3.3 Source Directory

```
src/
├── app/                       # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── clear-cache/     # Cache management
│   │   │   └── route.ts
│   │   └── uploads/         # File upload handler
│   │       └── [...path]/
│   │           └── route.ts
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
├── lib/                    # Utility functions
│   ├── prisma.ts          # Prisma client instance
│   └── utils.ts           # Helper functions
└── types/                  # TypeScript type definitions
```

### 3.4 Public Directory

```
public/
├── uploads/                  # User uploaded files
│   ├── images/              # Uploaded images
│   ├── documents/           # Uploaded documents
│   └── ...
├── favicon.ico              # Site favicon
└── ...                      # Other static assets
```

---

## 4. Konfigurasi Environment

### 4.1 Environment Variables

File: `.env`

```env
# Database Connection
DATABASE_URL="mysql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# File Upload Directory
UPLOAD_DIR="./public/uploads"
```

### 4.2 Penjelasan Environment Variables

#### `DATABASE_URL`
**Format**: `mysql://[username]:[password]@[host]:[port]/[database]`

**Breakdown**:
- **username**: Database username Anda
- **password**: Database password (URL-encode jika ada karakter khusus seperti `@` → `%40`)
- **host**: Database host (localhost untuk development, IP server untuk production)
- **port**: `3306` (MySQL default)
- **database**: Nama database Anda

**⚠️ PENTING - SECURITY**: 
- Password dengan karakter `@` harus di-encode jadi `%40`
- Ganti dengan `localhost` untuk development
- Gunakan strong password di production
- **JANGAN PERNAH commit credentials ke Git**
- **JANGAN share .env file ke publik**

#### `NEXTAUTH_URL`
Base URL aplikasi untuk NextAuth.js authentication.

**Development**: `http://localhost:3000`
**Production**: `https://yourdomain.com`

#### `NEXTAUTH_SECRET`
Secret key untuk enkripsi session NextAuth.js.

**Generate new secret**:
```bash
openssl rand -base64 32
```

**⚠️ SECURITY**: Ganti dengan secret Anda sendiri, jangan gunakan contoh dari dokumentasi!

#### `UPLOAD_DIR`
Direktori untuk menyimpan file upload.

**Default**: `./public/uploads`
**Production**: Bisa menggunakan cloud storage (S3, Cloudinary, etc.)

### 4.3 Setup Environment

1. **Copy example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** dengan credentials yang sesuai

3. **Verify connection**:
   ```bash
   npx prisma db pull
   ```

---

## 5. Database & Prisma ORM

### 5.1 Database Schema

Database menggunakan Prisma ORM dengan schema-first approach. Lihat file `prisma/schema.prisma` untuk schema lengkap.

### 5.2 Database Tables

#### Core Tables:
- **user**: User accounts untuk admin/staff (lowercase di database)
- **website_settings**: Konfigurasi website global
- **kategori**: Categories untuk konten

#### Content Tables:
- **hero_section**: Banner/hero sections di homepage
- **about_us_section**: Konten about us section
- **feature_blocks**: Feature blocks/cards
- **promotions**: Promotional content
- **beritas**: News/articles
- **halaman**: Custom pages

#### Medical Tables:
- **kategori_spesialis**: Specialist categories
- **dokters**: Doctor profiles
- **dokter_spesialis**: Doctor specializations (many-to-many)
- **jadwal_dokters**: Doctor schedules
- **indikatormutu**: Quality indicators

#### Other Tables:
- **kritik_saran**: Kritik & saran from users
- **visitors**: Visitor tracking

### 5.3 Important Schema Notes

**⚠️ Case-Sensitive Table Names**:
- MySQL di Linux **case-sensitive** untuk nama tabel
- Di `schema.prisma`, gunakan `@@map("user")` bukan `@@map("User")`
- Prisma model: `User` → Database table: `user`

**Binary Targets untuk Deployment**:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

Ini penting agar Prisma bisa jalan di server Linux.

### 5.4 Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database & seed
npx prisma migrate reset

# Run seeding only
npm run seed

# Open Prisma Studio (database GUI)
npx prisma studio

# Pull schema from existing database
npx prisma db pull

# Validate schema
npx prisma validate

# Format schema file
npx prisma format
```

### 5.5 Prisma Client Usage

```typescript
// Import Prisma Client
import { prisma } from '@/lib/prisma';

// Query examples
const users = await prisma.user.findMany();
const doctor = await prisma.dokters.findUnique({
  where: { id_dokter: 1 },
  include: { 
    dokter_spesialis: true,
    JadwalDokters: true 
  }
});

// Create
await prisma.beritas.create({
  data: {
    judul_berita: "Artikel Baru",
    isi: "...",
    id_kategori: 1,
    id_user: 1,
    slug_berita: "artikel-baru",
    updater: "Admin"
  }
});

// Update
await prisma.halaman.update({
  where: { id_halaman: 1 },
  data: { konten: "Updated content" }
});

// Delete
await prisma.promotions.delete({
  where: { id: 1 }
});
```

---

## 6. Fitur-Fitur Lengkap

### 6.1 Content Management Features

#### 6.1.1 Website Settings
- ✅ Konfigurasi global website
- ✅ Logo, nama, tagline
- ✅ Contact information
- ✅ Social media links
- ✅ SEO meta tags

#### 6.1.2 Hero Sections
- ✅ Multiple hero banners
- ✅ Image/video backgrounds
- ✅ Call-to-action buttons
- ✅ Responsive design
- ✅ Order/priority management

#### 6.1.3 About Us Section
- ✅ Rich text content
- ✅ Images & media
- ✅ Vision & mission
- ✅ History timeline
- ✅ Values & culture

#### 6.1.4 Feature Blocks
- ✅ Service highlights
- ✅ Icon support
- ✅ Grid/card layout
- ✅ Link to detail pages
- ✅ Customizable colors

### 6.2 Medical Features

#### 6.2.1 Doctor Management
- ✅ Doctor profiles
- ✅ Multiple specializations per doctor
- ✅ Photos & biographies
- ✅ Education background
- ✅ Experience & certifications
- ✅ Active/inactive status

#### 6.2.2 Doctor Schedule
- ✅ Multi-day scheduling
- ✅ Multiple time slots per day
- ✅ Different locations/rooms
- ✅ Status management

#### 6.2.3 Specialist Categories
- ✅ Specialist groups
- ✅ Descriptions
- ✅ Associated doctors
- ✅ Service details

### 6.3 Content Features

#### 6.3.1 News/Articles (Beritas)
- ✅ Article management
- ✅ Categories
- ✅ Featured images
- ✅ Rich text editor
- ✅ Publish/draft status
- ✅ SEO friendly URLs
- ✅ Tags/keywords
- ✅ Hit counter

#### 6.3.2 Custom Pages (Halaman)
- ✅ Dynamic page creation
- ✅ Custom URLs
- ✅ Rich content
- ✅ SEO optimization
- ✅ Published/draft status

#### 6.3.3 Promotions
- ✅ Promotional banners
- ✅ Limited time offers
- ✅ Call-to-action links
- ✅ Start/end dates
- ✅ Active/inactive status

### 6.4 Quality Management

#### 6.4.1 Quality Indicators (Indikator Mutu)
- ✅ Monthly quality metrics
- ✅ Multiple indicators
- ✅ Target vs actual (capaian)
- ✅ Period tracking
- ✅ Reports

### 6.5 File Management

#### 6.5.1 File Upload System
- ✅ Multiple file types support
- ✅ Image optimization
- ✅ File validation
- ✅ Secure storage

**Supported Types**:
- Images: JPG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX

### 6.6 Caching System

#### 6.6.1 Cache Management API

**Cache Types**:

1. **All Cache**: Clear semua cache Next.js
2. **Path Cache**: Revalidate specific path
3. **Tag Cache**: Revalidate by cache tag
4. **Image Cache**: Clear image optimization cache

**Usage Example**:
```typescript
// Clear all cache
fetch('/api/clear-cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'all' })
});

// Clear specific path
fetch('/api/clear-cache', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    type: 'path',
    path: '/doctors/dr-john'
  })
});
```

---

## 7. API Endpoints

### 7.1 Clear Cache API

**Endpoint**: `POST /api/clear-cache`

**Request Body**:
```json
{
  "type": "all" | "path" | "tag" | "images",
  "path": "/optional/path",
  "tag": "optional-tag"
}
```

**Response Success**:
```json
{
  "success": true,
  "message": "all cache cleared successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response Error**:
```json
{
  "success": false,
  "message": "Invalid cache type"
}
```

### 7.2 File Upload API

**Endpoint**: `/uploads/:path*`

Rewrite ke `/api/uploads/:path*` untuk serving uploaded files.

---

## 8. Styling & UI Components

### 8.1 Tailwind CSS Configuration

File: `src/app/globals.css`

#### Theme System (OKLCH Color Space)

```css
:root {
  --background: oklch(1 0 0);          /* White */
  --foreground: oklch(0.145 0 0);      /* Dark Gray */
  --primary: oklch(0.205 0 0);         /* Primary color */
  --border: oklch(0.922 0 0);          /* Border color */
  --radius: 0.625rem;                  /* 10px */
}

.dark {
  --background: oklch(0.145 0 0);      /* Dark background */
  --foreground: oklch(0.985 0 0);      /* Light text */
}
```

#### Custom Utilities

**Line Clamp**:
```css
.line-clamp-2 { -webkit-line-clamp: 2; }
.line-clamp-3 { -webkit-line-clamp: 3; }
```

**Scrollbar Hide**:
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

#### Prose Styling untuk Rich Text

```css
.prose {
  @apply text-gray-700 leading-relaxed;
}

.prose h1, h2, h3 {
  @apply font-semibold text-gray-900 mt-8 mb-4;
}

.prose ul {
  list-style-type: disc;
}

.prose ol {
  list-style-type: decimal;
}
```

---

## 9. Development Guide

### 9.1 Setup Development Environment

#### Prerequisites:
- Node.js 18+
- npm atau yarn
- MySQL 8+
- Git

#### Installation Steps:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/fadhly-git/profile-rs-next-ts.git
   cd profile-rs-next-ts
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Edit .env dengan credentials Anda
   ```

4. **Setup Database**:
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed database
   npm run seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

6. **Open Browser**:
   ```
   http://localhost:3000
   ```

### 9.2 Development Workflow

#### Git Workflow

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Make changes
git add .
git commit -m "feat: deskripsi perubahan"

# Push to remote
git push origin feature/nama-fitur
```

#### Commit Convention

Format: `<type>: <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

### 9.3 Code Standards

#### TypeScript Best Practices

```typescript
// Use interfaces for objects
interface Doctor {
  id: number;
  nama: string;
  spesialis: string[];
}

// Type function parameters & return
async function getDoctors(): Promise<Doctor[]> {
  return await prisma.dokters.findMany();
}
```

#### React Components

```tsx
// Server Component (default)
export default async function DoctorsPage() {
  const doctors = await prisma.dokters.findMany();
  return <DoctorList doctors={doctors} />;
}

// Client Component
'use client';
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [expanded, setExpanded] = useState(false);
  return <div>...</div>;
}
```

### 9.4 Testing & Debugging

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Prisma Studio
npx prisma studio
```

---

## 10. Deployment & Production

### 10.1 Manual Build & Deploy (Tanpa RAM Cukup di Server)

Karena server production tidak punya RAM cukup untuk build, build dilakukan di local lalu transfer ke server.

#### Step 1: Build di Local (Windows)

```powershell
# 1. Generate Prisma Client untuk target Linux
npx prisma generate

# 2. Build Next.js
npm run build
```

#### Step 2: Fix Private Key Permissions

```powershell
# Remove inherited permissions
icacls .\your-key.pem /inheritance:r

# Grant read permission to current user only
icacls .\your-key.pem /grant:r "$($env:USERNAME):R"
```

#### Step 3: Copy Files ke Server

```powershell
# Copy standalone build
scp -i .\your-key.pem -r .\.next\standalone\* user@your-server:/var/www/your-app/

# Copy Prisma Client (PENTING!)
scp -i .\your-key.pem -r .\node_modules\.prisma user@your-server:/var/www/your-app/node_modules/
scp -i .\your-key.pem -r .\node_modules\@prisma\client user@your-server:/var/www/your-app/node_modules/@prisma/

# Copy environment file
scp -i .\your-key.pem .env user@your-server:/var/www/your-app/

# Copy public files (uploads, etc)
scp -i .\your-key.pem -r .\public user@your-server:/var/www/your-app/

# Copy static files
scp -i .\your-key.pem -r .\.next\static user@your-server:/var/www/your-app/.next/
```

#### Step 4: Setup di Server

```bash
# SSH ke server
ssh -i your-key.pem user@your-server

# Masuk ke directory
cd /var/www/your-app

# Pastikan file .env sudah benar
cat .env
# DATABASE_URL harus pakai localhost dan password URL-encoded

# Start dengan PM2
pm2 start npm --name "your-app-name" -- run start

# Save PM2 process list
pm2 save

# Setup auto-start on boot
pm2 startup

# Check status
pm2 status
pm2 logs your-app-name
```

### 10.2 PM2 Commands

```bash
# Management
pm2 status                    # Check status
pm2 logs your-app-name      # View logs
pm2 restart your-app-name   # Restart app
pm2 stop your-app-name      # Stop app
pm2 delete your-app-name    # Delete process

# Monitoring
pm2 monit                    # Real-time monitoring
pm2 show your-app-name      # Process details

# Logs
pm2 logs your-app-name --lines 100  # View last 100 lines
pm2 flush                    # Clear logs
```

### 10.3 Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /_next/static {
        alias /var/www/your-app/.next/static;
        expires 365d;
        access_log off;
    }

    # Uploads
    location /uploads {
        alias /var/www/your-app/public/uploads;
        expires 30d;
    }
}
```

---

## 11. Troubleshooting

### 11.1 Common Issues

#### ❌ Issue: Table `User` does not exist (P2021)

**Penyebab**: Prisma mencari tabel `User` (kapital), tapi di MySQL Linux tabel bernama `user` (lowercase).

**Solusi**: Ubah `@@map("User")` jadi `@@map("user")` di `schema.prisma`, lalu:
```bash
npx prisma generate
npm run build
# Deploy ulang
```

#### ❌ Issue: Prisma Client missing for runtime "debian-openssl-3.0.x"

**Penyebab**: Prisma Client di-generate di Windows, server butuh Linux binary.

**Solusi**: Tambah `binaryTargets` di `schema.prisma`:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

Lalu generate dan deploy ulang.

#### ❌ Issue: Bad permissions untuk private key (.pem file)

**Solusi**:
```powershell
icacls .\your-key.pem /inheritance:r
icacls .\your-key.pem /grant:r "$($env:USERNAME):R"
```

#### ❌ Issue: Database connection failed

**Solusi**:
```bash
# 1. Check MySQL running
sudo systemctl status mysql

# 2. Verify DATABASE_URL
# Password dengan @ harus di-encode jadi %40
# Contoh: Pkub0j4@dm1n → Pkub0j4%40dm1n

# 3. Test connection
mysql -u budizul -p -h localhost
```

#### ❌ Issue: PM2 process crashing

**Solusi**:
```bash
# Check error logs
pm2 logs your-app-name --err --lines 50

# Delete and restart
pm2 delete your-app-name
pm2 start npm --name "your-app-name" -- run start

# Check port
netstat -tulpn | grep 3000
```

#### ❌ Issue: Cache not clearing

**Solusi**:
```bash
# Via API
curl -X POST http://localhost:3000/api/clear-cache \
  -H "Content-Type: application/json" \
  -d '{"type":"all"}'

# Manual
rm -rf .next/cache
pm2 restart compro-rs
```

### 11.2 Debug Commands

```bash
# Check application status
pm2 status
pm2 logs compro-rs

# Check database
mysql -u root -p -e "SHOW TABLES" your_database

# Check disk space
df -h

# Check memory
free -h

# Check Node version
node -v

# Check running processes
ps aux | grep node
```

---

## 12. Best Practices

### 12.1 Security

- ✅ Never commit `.env` to Git
- ✅ Use strong passwords
- ✅ URL-encode special characters in DATABASE_URL
- ✅ Validate file uploads
- ✅ Sanitize user input
- ✅ Use HTTPS in production

### 12.2 Performance

```typescript
// ✅ Use Server Components by default
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Add revalidation for cached pages
export const revalidate = 3600; // 1 hour

// ✅ Optimize images
import Image from 'next/image';
<Image src="/image.jpg" width={800} height={600} alt="..." />

// ✅ Use Prisma include for relations (avoid N+1)
const doctors = await prisma.dokters.findMany({
  include: { 
    dokter_spesialis: true,
    JadwalDokters: true 
  }
});
```

### 12.3 Code Quality

```typescript
// ✅ Type everything
interface Doctor {
  id: number;
  nama: string;
}

// ✅ Handle errors
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Error:', error);
  return [];
}

// ✅ Use meaningful names
const activeDoctors = doctors.filter(d => d.status === 'active');
```

---

## 13. Maintenance & Monitoring

### 13.1 Regular Tasks

#### Daily
```bash
# Check status
pm2 status

# Check logs for errors
pm2 logs your-app-name --err --lines 50

# Backup database
mysqldump -u root -p your_database > backup-$(date +%Y%m%d).sql
```

#### Weekly
```bash
# Update dependencies (minor)
npm update

# Clear old logs
pm2 flush

# Check disk space
df -h
```

#### Monthly
```bash
# Full audit
npm audit
npm audit fix

# Database optimization
mysqlcheck -u root -p --optimize your_database

# Review backups
ls -lh /backups/
```

### 13.2 Backup Strategy

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p$DB_PASSWORD your_database | gzip > /backups/backup_$DATE.sql.gz

# Keep only 30 days
find /backups -mtime +30 -delete
```

**Setup cron**:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run start                 # Start production server

# Database
npx prisma generate          # Generate Prisma Client
npx prisma db push           # Push schema to DB
npx prisma studio            # Open Prisma Studio
npm run seed                 # Seed database

# PM2 (Production)
pm2 start npm --name "your-app-name" -- run start
pm2 restart your-app-name   # Restart
pm2 logs your-app-name      # View logs
pm2 monit                    # Monitor

# Cache
curl -X POST localhost:3000/api/clear-cache \
  -H "Content-Type: application/json" \
  -d '{"type":"all"}'
```

### Important File Locations

- **Config**: `next.config.ts`, `tsconfig.json`
- **Environment**: `.env`
- **Styles**: `src/app/globals.css`
- **Database**: `prisma/schema.prisma`
- **API**: `src/app/api/`
- **Seed**: `prisma/seed.ts`

### Server Info Template

- **Host**: `your-server-ip`
- **User**: `your-username`
- **Path**: `/var/www/your-app`
- **Port**: `3000` (atau sesuai konfigurasi)
- **PM2 Process**: `your-app-name`

---

## 📞 Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
- PM2: https://pm2.keymetrics.io/docs

### Repository
- GitHub: https://github.com/fadhly-git/profile-rs-next-ts

---

**Last Updated**: November 21, 2025  
**Version**: 1.0.0  
**Maintained by**: Tim Development RS PKU Muhammadiyah Boja

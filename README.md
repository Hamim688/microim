# MikroIm - Digital Technology & IoT Engineering Platform

> "Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global."

MikroIm adalah platform digital rekayasa teknologi dan Internet of Things (IoT) yang menghubungkan pelanggan dengan produk komponen, layanan rekayasa, portofolio proyek kustom, dan konsultasi teknis.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: Custom engineering design system with Deep Navy (`#071426`) & Golden Yellow (`#FFC928`) accents
- **ORM & Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Schema Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```text
microim/
├── app/
│   ├── page.tsx          # Landing page (Hero, About, Values, Services, Products, Projects, CTA)
│   ├── about/            # Company overview & global vision
│   ├── services/         # Engineering services (Hardware, Embedded, Mobile)
│   ├── products/         # IoT components catalog & marketplace
│   ├── projects/         # Engineering portfolio & technical case studies
│   ├── contact/          # Custom project inquiry & consultation form
│   └── admin/            # Command center & project management preview
│
├── components/
│   ├── ui/               # Reusable primitives (Button, Badge, Card)
│   ├── layout/           # Global Navbar & Footer
│   ├── landing/          # Modular landing sections
│   ├── services/         # Service components
│   ├── products/         # Product catalog components
│   ├── projects/         # Project showcase components
│   └── contact/          # Inquiry form components
│
├── lib/
│   ├── db.ts             # Prisma client singleton
│   ├── utils.ts          # Classnames & styling utilities (cn)
│   └── validations/      # Zod validation schemas (Inquiry, etc.)
│
├── prisma/
│   └── schema.prisma     # Relational schema (PostgreSQL)
│
├── public/
│   ├── images/           # Circuit patterns & graphic assets
│   ├── logo/             # MikroIm mirrored M/I circuit logo
│   └── products/         # Hardware & component imagery
│
├── docs/
│   ├── IMPLEMENT.md      # Full architecture & implementation specifications
│   └── DESIGN.md         # Design system tokens & visual rules
│
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Setup Environment Variables
Salin atau sesuaikan konfigurasi di `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/microim?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-auth-secret-here"
```

### 4. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📖 Documentation
- [Implementation Guide](file:///home/rajaba/Documents/Kuliah/technopreneurship/microim/docs/IMPLEMENT.md)
- [Design System & Guidelines](file:///home/rajaba/Documents/Kuliah/technopreneurship/microim/docs/DESIGN.md)

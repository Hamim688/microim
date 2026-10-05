# MikroIm - Design System & Visual Guidelines

## 1. Visual Identity & Brand Philosophy

MikroIm represents the intersection between hardware engineering, software intelligence, and connectivity.
The design language is engineered to be **futuristic, premium, minimalist, and deeply engineering-focused**, avoiding generic ecommerce tropes.

- **Brand Name**: MikroIm
- **Tagline**: *"Connecting Ideas Through Intelligent Technology"*
- **Vision**: *"Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global."*

---

## 2. Color Palette & Tokens

### Primary Brand Colors
- **Deep Navy (Background & Foundation)**: `#071426`
  - Hex: `#071426`
  - HSL: `hsl(215, 69%, 9%)`
  - Use: Main page backgrounds, root surfaces, primary contrast base.
- **Deep Navy Elevated (Cards & Panels)**: `#0c213d`
  - Hex: `#0c213d`
  - HSL: `hsl(215, 67%, 15%)`
  - Use: Card surfaces, navigation header, dropdowns, modal layers.
- **Deep Navy Border / Circuit Line**: `#173359`
  - Hex: `#173359`
  - Use: Subtle divider borders, card strokes, circuit grid lines.

### Accent Colors
- **Golden Yellow (Primary Accent)**: `#FFC928`
  - Hex: `#FFC928`
  - HSL: `hsl(45, 100%, 58%)`
  - Use: Call to actions (CTAs), glowing badges, active states, circuit nodes, key highlights.
  - *Rule*: Never use as dominant solid background for large sections; use intentionally as an accent.
- **Golden Yellow Glow / Hover**: `#FFE066` / `rgba(255, 201, 40, 0.15)`
  - Use: Hover states, radial glow backgrounds behind hardware prototypes, badge tint.

### Supporting & Neutral Colors
- **Pure White**: `#FFFFFF`
  - Use: Hero titles, high-contrast text, primary button foregrounds.
- **Text Muted / Light Slate**: `#94A3B8`
  - Use: Body copy, secondary descriptions, metadata, timestamps.
- **Dark Surface / Inset**: `#040d1a`
  - Use: Code blocks, terminal previews, circuit canvas backgrounds.

---

## 3. Typography

- **Font Family**: Modern Geometric Sans-serif (Geist Sans / Inter / Plus Jakarta Sans)
- **Code / Specs Font**: Modern Monospace (Geist Mono / JetBrains Mono)

### Type Hierarchy
| Level | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|
| Display / Hero | 48px - 64px | Bold (700) | 1.1 | -0.02em |
| Section Heading (H2) | 32px - 40px | SemiBold (600) | 1.2 | -0.015em |
| Subsection (H3) | 22px - 26px | SemiBold (600) | 1.3 | -0.01em |
| Card Title (H4) | 18px - 20px | SemiBold (600) | 1.4 | normal |
| Body Regular | 15px - 16px | Regular (400) | 1.6 | normal |
| Body Small / Meta | 13px - 14px | Medium (500) | 1.5 | +0.01em |
| Monospace Spec / Tag | 11px - 12px | Medium (500) | 1.4 | +0.05em (Uppercase) |

---

## 4. Visual Elements & Motifs

1. **Subtle Glassmorphism**:
   - Background: `rgba(12, 33, 61, 0.75)` with `backdrop-filter: blur(12px)`
   - Border: `1px solid rgba(255, 201, 40, 0.12)` or `1px solid rgba(255, 255, 255, 0.08)`
2. **Circuit Accents**:
   - Subtle dot matrices or PCB track lines at 5-10% opacity in dark sections.
   - Glowing golden node dots on card corners or badge borders.
3. **Card Shapes & Elevation**:
   - Border radius: `rounded-2xl` (16px) or `rounded-xl` (12px)
   - Shadows: Soft directional glow `0 10px 30px -10px rgba(0, 0, 0, 0.5)` with subtle golden rim highlight on hover.
4. **Button Styles**:
   - **Primary Action**: Solid Golden Yellow (`#FFC928`) background, Deep Navy (`#071426`) bold text, subtle hover lift and glow (`shadow-[0_0_20px_rgba(255,201,40,0.35)]`).
   - **Secondary Action**: Deep Navy glass surface, subtle border `border-[#173359]`, white text, hover `border-[#FFC928]/40`.
   - **Ghost / Nav Link**: Text `#94A3B8`, hover text `#FFC928` with smooth 200ms transition.

---

## 5. Layout & Navigation Hierarchy

- **Global Header**: Sticky top navigation with MikroIm mirrored M/I emblem, navigation links (`Home`, `About`, `Services`, `Products`, `Projects`, `Contact`), and prominent primary CTA `Start Your Project`.
- **Global Footer**: Company vision, quick links, contact info (WhatsApp, Email, Lab location), copyright, and engineering badge.
- **Container Max-Width**: `max-w-7xl` (1280px) with fluid padding `px-4 sm:px-6 lg:px-8`.

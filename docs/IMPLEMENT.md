# MikroIm Web Application - Implementation Guide

## 1. Project Context

MikroIm is a technology engineering and IoT company.

The company focuses on:

- IoT hardware components
- Hardware prototyping
- Embedded system development
- Microcontroller programming
- Mobile application development
- Custom technology projects

The website is not only a company profile.

It is intended to become a digital platform connecting:

Customer
→ Products
→ Services
→ Custom Projects
→ Project Inquiry
→ MikroIm Team

The website must communicate that MikroIm is a technology engineering partner, not simply an electronics store.

---

# 2. Company Vision

"Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global."

---

# 3. Brand Identity

Brand name:

MikroIm

Brand concept:

MikroIm represents the connection between hardware, software, ideas, and intelligent technology.

The visual identity is inspired by:

- Microcontrollers
- Electronic circuits
- Digital systems
- Engineering
- Innovation
- Connectivity

The logo uses a mirrored M/I concept combined with electronic circuit elements.

The logo must NOT be modified, distorted, recolored, or redesigned during implementation.

---

# 4. Website Goals

The website has several primary goals:

1. Introduce MikroIm as a technology company.
2. Present MikroIm services.
3. Sell IoT and electronics components.
4. Showcase completed technology projects.
5. Receive custom project inquiries.
6. Provide a professional digital presence.
7. Connect customers with MikroIm through WhatsApp and other contact channels.

---

# 5. Target Users

Primary users:

- Students
- Developers
- Makers
- IoT enthusiasts
- Small businesses
- Engineering teams
- Technology companies
- Customers looking for custom hardware/software solutions

---

# 6. Core Pages

The initial website consists of:

/                 → Landing Page

/services         → Services

/products         → IoT Product Catalog

/projects         → Project Portfolio

/contact          → Project Inquiry / Contact

/about            → Company information

/admin            → Admin dashboard

---

# 7. Technology Stack

## Frontend

Next.js

TypeScript

React

Tailwind CSS

shadcn/ui

## Backend

Next.js Server Actions

Next.js Route Handlers where API endpoints are required.

Do NOT create a separate backend service unless there is a strong technical reason.

## Database

PostgreSQL

## ORM

Prisma

## Validation

Zod

## Authentication

Auth.js

## Storage

Use a suitable object storage solution for project images and uploaded project files.

Possible option:

Supabase Storage

## Deployment

Frontend / application:

Vercel

Database:

PostgreSQL-compatible managed database.

---

# 8. Architecture Principles

Follow these principles:

1. Keep the architecture simple.
2. Prefer server-side rendering when appropriate.
3. Use Server Components by default.
4. Use Client Components only when interactivity requires them.
5. Keep reusable UI components separate from business logic.
6. Avoid unnecessary abstractions.
7. Avoid overengineering.
8. Keep database access inside server-side code.
9. Validate user input with Zod.
10. Never expose secrets to the client.

---

# 9. UI / UX Direction

The website must follow the MikroIm visual identity.

Primary color:

Deep Navy
#071426

Accent:

Golden Yellow
#FFC928

Supporting colors:

White
#FFFFFF

Soft Gray

The design should feel:

- Futuristic
- Premium
- Minimalist
- Professional
- Engineering-focused
- Innovative
- Clean

Avoid:

- Generic ecommerce appearance
- Excessive gradients
- Excessive animations
- Cheap-looking neon effects
- Overly colorful interfaces
- Template-like layouts

---

# 10. Design Language

The website uses:

- Deep navy backgrounds
- Golden circuit accents
- Clean white surfaces
- Rounded cards
- Subtle shadows
- Subtle glassmorphism
- Electronic circuit patterns
- Technical visual elements
- Modern geometric typography

Golden yellow should be used as an accent, not as the dominant page color.

---

# 11. Typography

Use a modern geometric sans-serif font.

Typography hierarchy:

Hero Heading:
Large / Bold

Section Heading:
Large / Semibold

Card Heading:
Medium / Semibold

Body:
Regular

Metadata:
Small / Medium

Maintain consistent typography across all pages.

---

# 12. Navigation

Main navigation:

Home
About
Services
Products
Projects
Contact

Primary CTA:

Start Your Project

The navigation must remain visually consistent across all pages.

---

# 13. Landing Page

The landing page should communicate:

"Connecting Ideas Through Intelligent Technology"

Main sections:

1. Hero
2. About MikroIm
3. Company Values
4. Services Preview
5. Featured Products
6. Project Showcase
7. CTA
8. Footer

---

# 14. Services Page

Route:

/services

Main services:

1. Hardware Prototyping & IoT Development
2. Embedded System Programming
3. Mobile Application Development

Additional sections:

- Development Process
- Technology Stack
- Custom Project
- Service Benefits
- CTA

---

# 15. Products Page

Route:

/products

The products page is an IoT component marketplace.

Main functionality:

- Product search
- Category filtering
- Product listing
- Product detail
- Product quantity
- Shopping cart
- Checkout flow

Initial categories:

- Microcontrollers
- Sensors
- Actuators
- Motors
- Connectivity
- Accessories
- Kits

Example products:

ESP32 Development Board
SG90 Servo Motor
HC-SR04 Ultrasonic Sensor
Jumper Wire 20cm
ESP8266 NodeMCU
HC-SR501 PIR Sensor
DC Gear Motor
1 Channel Relay Module

---

# 16. Projects Page

Route:

/projects

The projects page is a technology portfolio.

Project categories:

- IoT
- Embedded System
- Robotics
- Automation
- Mobile Application
- Hardware Prototype

Each project should support:

- Title
- Description
- Category
- Images
- Technologies
- Problem
- Solution
- Result

The project presentation should emphasize:

Problem
→
Engineering
→
Prototype
→
Implementation
→
Result

---

# 17. Contact Page

Route:

/contact

The main purpose is project inquiry.

The form should support:

- Name
- Email
- WhatsApp
- Project Type
- Budget
- Description
- Timeline
- File Upload

Project types:

- IoT Development
- Hardware Prototyping
- Embedded Programming
- Mobile Application
- Automation System
- Custom Project
- Component Request
- Other

After submission:

Customer
→
Database
→
Admin Dashboard

---

# 18. Admin Dashboard

Route:

/admin

The dashboard will manage:

Products
Categories
Orders
Projects
Project inquiries
Customers

Project inquiry statuses:

NEW
REVIEWING
QUOTATION
IN_PROGRESS
COMPLETED
CANCELLED

---

# 19. Database

Use PostgreSQL with Prisma.

Initial entities:

User
Product
Category
Order
OrderItem
Project
ProjectImage
ProjectInquiry
Service

Relationships must be designed properly before implementation.

Do not duplicate data unnecessarily.

---

# 20. Responsive Design

The website must support:

Desktop
Tablet
Mobile

Breakpoints should follow Tailwind conventions.

Important:

Mobile UI is not simply a scaled-down desktop UI.

Navigation, cards, forms, product grids, and CTA elements must be intentionally designed for mobile.

---

# 21. Accessibility

Use semantic HTML.

All interactive elements must be keyboard accessible.

Images must have meaningful alt text.

Forms must have labels.

Color contrast must remain readable.

Do not rely only on color to communicate state.

---

# 22. Performance

Optimize for:

- Fast initial page load
- Optimized images
- Minimal client-side JavaScript
- Server Components where appropriate
- Lazy loading for non-critical content
- Efficient database queries

Do not add libraries without a clear reason.

---

# 23. Security

Never expose:

- Database credentials
- API secrets
- Authentication secrets

Validate all user input.

Validate uploaded files.

Restrict upload size and file types.

Admin routes must require authentication and authorization.

---

# 24. Development Strategy

Implementation must be incremental.

Do NOT implement the entire application in one step.

Recommended order:

Phase 1:
Project setup

Phase 2:
Global layout and design system

Phase 3:
Landing page

Phase 4:
Services page

Phase 5:
Products catalog

Phase 6:
Projects portfolio

Phase 7:
Contact / Project Inquiry

Phase 8:
Database integration

Phase 9:
Authentication

Phase 10:
Admin dashboard

Phase 11:
Testing

Phase 12:
Optimization

---

# 25. Coding Rules

Use TypeScript strictly.

Avoid `any` unless absolutely necessary.

Create reusable components.

Avoid duplicated UI code.

Keep components small and focused.

Use meaningful variable and function names.

Use consistent naming conventions.

Do not introduce unnecessary dependencies.

Before creating a new component, check whether an existing component can be reused.

---

# 26. Design Reference

The Stitch AI generated UI screenshots are the primary visual reference.

The implementation must reproduce:

- Layout hierarchy
- Spacing
- Typography hierarchy
- Color palette
- Component shapes
- Border radius
- Shadows
- Visual hierarchy
- Responsive behavior

Do not blindly copy pixel values if they conflict with responsive design.

The goal is visual consistency, not pixel-perfect imitation.

---

# 27. UI Implementation Rule

When implementing a page:

1. Read this IMPLEMENT.md.
2. Inspect the provided Stitch reference.
3. Identify the page layout.
4. Identify reusable components.
5. Implement the structure.
6. Implement the visual styling.
7. Implement responsive behavior.
8. Compare the result against the reference.
9. Fix visual inconsistencies.
10. Only then move to the next page.

---

# 28. Current Implementation Priority

Start with:

/

Landing Page

Do not implement Products, Projects, Contact, or Admin yet.

First establish the global design system and landing page.

Once the landing page visually matches the Stitch reference, reuse the same design system for the remaining pages.

---

# 29. Important Instruction For Coding Agent

Do not redesign the product.

Do not change the MikroIm branding.

Do not introduce a different color palette.

Do not replace the existing logo.

Do not add unnecessary features.

When something is ambiguous, prefer the simplest implementation that is consistent with the existing architecture and design system.

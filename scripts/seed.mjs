// Isi database dari lib/products.ts. Aman dijalankan berulang: produk yang sudah ada tidak diubah.
// Pakai: npm run db:seed
import "./env.mjs"
import { readFile } from "node:fs/promises"
import pkg from "@prisma/client"

const { PrismaClient } = pkg
const db = new PrismaClient()

const slugify = (text) =>
  text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "produk"

const source = await readFile(new URL("../lib/products.ts", import.meta.url), "utf8")
const pattern = /\{\s*name:\s*"([^"]+)",\s*cat:\s*"([^"]+)",\s*price:\s*"([^"]+)",\s*stock:\s*(\d+),\s*image:\s*"([^"]+)"\s*\}/g
const rows = [...source.matchAll(pattern)].map(([, name, cat, price, stock, image]) => ({
  name,
  cat,
  price: Number(price.replace(/[^\d]/g, "")),
  stock: Number(stock),
  image,
}))
if (!rows.length) throw new Error("Tidak ada produk yang terbaca dari lib/products.ts")

let created = 0
for (const row of rows) {
  const catSlug = slugify(row.cat)
  const category = await db.category.upsert({ where: { slug: catSlug }, update: {}, create: { name: row.cat, slug: catSlug } })
  const slug = slugify(row.name)
  const existing = await db.product.findUnique({ where: { slug } })
  if (existing) continue
  await db.product.create({
    data: {
      name: row.name,
      slug,
      description: "",
      price: row.price,
      stock: row.stock,
      imageUrl: row.image,
      categoryId: category.id,
      stockMovements: { create: { type: "INITIAL", change: row.stock, stockAfter: row.stock, note: "Data awal dari situs" } },
    },
  })
  created++
}
console.log(`Seed selesai: ${created} produk baru, ${rows.length - created} sudah ada.`)
await db.$disconnect()

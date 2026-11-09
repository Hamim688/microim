// Data katalog untuk situs publik. Sumber utamanya database (yang dikelola dari panel admin),
// jadi harga & stok di situs selalu sama dengan admin. Bila database tidak bisa diakses
// (mis. build lokal tanpa DATABASE_URL), situs tetap tampil memakai daftar cadangan di lib/products.ts.
import { cache } from "react"
import { db } from "@/lib/db"
import { rupiah } from "@/lib/admin/format"
import { SERVICE_CATEGORY_SLUG } from "@/lib/admin/settings"
import { products as fallbackProducts } from "@/lib/products"

export type CatalogProduct = {
  slug: string
  name: string
  category: string
  /** Harga dalam format rupiah, mis. "Rp 25.000". */
  price: string
  /** null untuk jasa (tidak punya stok). */
  stock: number | null
  image: string | null
  description: string
}

/** Produk yang ditonjolkan di Beranda (urut sesuai daftar ini, lalu diisi produk lain bila kurang). */
const FEATURED_SLUGS = ["esp32-dev-module", "mobil-kit", "driver-motor", "servo-sg90"]
const FEATURED_COUNT = 4

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

function fromFallback(): CatalogProduct[] {
  return fallbackProducts.map((p) => ({
    slug: slugify(p.name),
    name: p.name,
    category: p.cat,
    price: rupiah(Number(p.price.replace(/[^\d]/g, ""))),
    stock: p.cat === "Jasa" ? null : p.stock,
    image: p.image,
    description: "",
  }))
}

/** Barang tersedia dulu, lalu yang habis, lalu jasa; masing-masing urut nama. */
function sortForDisplay(list: CatalogProduct[]) {
  const rank = (p: CatalogProduct) => (p.stock === null ? 2 : p.stock > 0 ? 0 : 1)
  return [...list].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, "id"))
}

export const getCatalog = cache(async (): Promise<CatalogProduct[]> => {
  try {
    const rows = await db.product.findMany({
      select: { slug: true, name: true, price: true, stock: true, imageUrl: true, description: true, category: { select: { name: true, slug: true } } },
    })
    if (rows.length === 0) return sortForDisplay(fromFallback())
    return sortForDisplay(
      rows.map((p) => {
        const service = p.category.slug === SERVICE_CATEGORY_SLUG
        return {
          slug: p.slug,
          name: p.name,
          category: p.category.name,
          price: rupiah(p.price),
          stock: service ? null : p.stock,
          image: p.imageUrl || null,
          description: p.description,
        }
      }),
    )
  } catch (error) {
    console.error("getCatalog: memakai daftar cadangan", error)
    return sortForDisplay(fromFallback())
  }
})

/** Produk unggulan Beranda: hanya barang (bukan jasa). */
export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  const goods = (await getCatalog()).filter((p) => p.stock !== null)
  // Cocok persis atau varian bernama lebih panjang (mis. "driver-motor-l298n"), ambil satu per slug.
  const picked = FEATURED_SLUGS.flatMap((slug) => goods.find((p) => p.slug === slug) ?? goods.find((p) => p.slug.startsWith(`${slug}-`)) ?? [])
  const rest = goods.filter((p) => !picked.includes(p))
  return [...picked, ...rest].slice(0, FEATURED_COUNT)
}

/** Nama produk untuk pita berjalan: tanpa jasa, dan varian dengan foto sama cukup sekali. */
export async function getMarqueeNames(): Promise<string[]> {
  const seen = new Set<string>()
  return (await getCatalog())
    .filter((p) => p.stock !== null)
    .filter((p) => {
      const key = p.image ?? p.slug
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((p) => p.name)
}

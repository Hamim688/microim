import { cache } from "react"
import { db } from "@/lib/db"

export const DEFAULT_LOW_STOCK = 2
const LOW_STOCK_KEY = "lowStockThreshold"

/** Batas stok "menipis": stok 1..batas = Menipis, 0 = Habis. Bisa diubah dari halaman Produk & Stok. */
export const getLowStockThreshold = cache(async () => {
  try {
    const row = await db.appSetting.findUnique({ where: { key: LOW_STOCK_KEY } })
    const value = Number(row?.value)
    return Number.isInteger(value) && value >= 0 ? value : DEFAULT_LOW_STOCK
  } catch {
    return DEFAULT_LOW_STOCK
  }
})

export async function saveLowStockThreshold(value: number) {
  await db.appSetting.upsert({
    where: { key: LOW_STOCK_KEY },
    update: { value: String(value) },
    create: { key: LOW_STOCK_KEY, value: String(value) },
  })
}

/** Kategori jasa tidak punya stok, jadi tidak tampil di Produk & Stok (nanti dipakai di transaksi jasa). */
export const SERVICE_CATEGORY_SLUG = "jasa"
export const goodsOnly = { category: { slug: { not: SERVICE_CATEGORY_SLUG } } } as const

export type StockStatus = "aman" | "menipis" | "habis"
export function stockStatus(stock: number, threshold: number): StockStatus {
  if (stock <= 0) return "habis"
  if (stock <= threshold) return "menipis"
  return "aman"
}
export const stockStatusLabel: Record<StockStatus, string> = { aman: "Aman", menipis: "Menipis", habis: "Habis" }

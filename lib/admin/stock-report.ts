import { db } from "@/lib/db"
import { getLowStockThreshold, goodsOnly, stockStatus, type StockStatus } from "@/lib/admin/settings"

export type StockRow = {
  id: string
  name: string
  imageUrl: string | null
  description: string
  kategori: string
  kategoriSlug: string
  modal: number
  jual: number
  margin: number
  marginPct: number
  masuk: number
  terjual: number
  koreksi: number
  sisa: number
  status: StockStatus
  updatedAt: Date
  /** Jumlah baris transaksi yang memakai produk ini (produk seperti ini tidak boleh dihapus). */
  soldCount: number
}

/** Semua produk + angka stok masuk/terjual yang dihitung dari riwayat stok. Dipakai halaman Produk & Stok dan ekspor CSV. */
export async function stockReport() {
  const [products, movements, threshold] = await Promise.all([
    db.product.findMany({ where: goodsOnly, include: { category: { select: { name: true, slug: true } }, _count: { select: { orderItems: true } } } }),
    db.stockMovement.groupBy({ by: ["productId", "type"], _sum: { change: true }, _max: { createdAt: true } }),
    getLowStockThreshold(),
  ])

  const totals = new Map<string, { masuk: number; terjual: number; koreksi: number; last?: Date }>()
  for (const m of movements) {
    const t = totals.get(m.productId) ?? { masuk: 0, terjual: 0, koreksi: 0 }
    const sum = m._sum.change ?? 0
    // Masuk = stok awal + restock. Terjual = penjualan dikurangi yang dikembalikan (transaksi batal/dihapus).
    if (m.type === "INITIAL" || m.type === "RESTOCK") t.masuk += sum
    else if (m.type === "SALE" || m.type === "RETURN") t.terjual -= sum
    else if (m.type === "ADJUSTMENT") t.koreksi += sum
    const last = m._max.createdAt
    if (last && (!t.last || last > t.last)) t.last = last
    totals.set(m.productId, t)
  }

  const rows: StockRow[] = products.map((p) => {
    const t = totals.get(p.id) ?? { masuk: 0, terjual: 0, koreksi: 0 }
    // `?? 0` menjaga tampilan tetap aman bila kolom modal belum ada di database.
    const modal = Number((p as { costPrice?: unknown }).costPrice ?? 0) || 0
    const jual = Number(p.price) || 0
    return {
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      description: p.description,
      kategori: p.category.name,
      kategoriSlug: p.category.slug,
      modal,
      jual,
      margin: jual - modal,
      marginPct: jual > 0 ? Math.round(((jual - modal) / jual) * 100) : 0,
      masuk: t.masuk,
      terjual: t.terjual,
      koreksi: t.koreksi,
      sisa: p.stock,
      status: stockStatus(p.stock, threshold),
      updatedAt: t.last && t.last > p.updatedAt ? t.last : p.updatedAt,
      soldCount: p._count.orderItems,
    }
  })
  return { rows, threshold }
}

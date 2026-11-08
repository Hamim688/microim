import { db } from "@/lib/db"
import { SERVICE_CATEGORY_SLUG, goodsOnly } from "@/lib/admin/settings"

export type OrderProductOption = { id: string; name: string; category: string; price: number; cost: number; stock: number; imageUrl: string | null }
export type ServiceSuggestion = { name: string; price: number }

/** Pilihan komponen (barang berstok) + saran nama jasa untuk form transaksi. */
export async function orderFormOptions() {
  const [products, services, pastServices] = await Promise.all([
    db.product.findMany({ where: goodsOnly, include: { category: { select: { name: true } } }, orderBy: [{ category: { name: "asc" } }, { name: "asc" }] }),
    db.product.findMany({ where: { category: { slug: SERVICE_CATEGORY_SLUG } }, select: { name: true, price: true }, orderBy: { name: "asc" } }),
    db.orderItem.findMany({
      where: { itemType: "SERVICE", name: { not: null } },
      select: { name: true, price: true },
      orderBy: { order: { createdAt: "desc" } },
      take: 200,
    }),
  ])
  const suggestions = new Map<string, ServiceSuggestion>()
  for (const s of [...pastServices.map((s) => ({ name: s.name ?? "", price: Number(s.price) })), ...services.map((s) => ({ name: s.name, price: Number(s.price) }))]) {
    const key = s.name.trim().toLowerCase()
    if (key && !suggestions.has(key)) suggestions.set(key, { name: s.name.trim(), price: s.price })
  }
  return {
    products: products.map<OrderProductOption>((p) => ({
      id: p.id,
      name: p.name,
      category: p.category.name,
      price: Number(p.price),
      cost: Number(p.costPrice),
      stock: p.stock,
      imageUrl: p.imageUrl,
    })),
    services: [...suggestions.values()].slice(0, 30),
  }
}

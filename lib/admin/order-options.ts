import { db } from "@/lib/db"
import type { OrderProductOption } from "@/components/admin/order-form"

export async function orderProductOptions(): Promise<OrderProductOption[]> {
  const products = await db.product.findMany({ include: { category: { select: { name: true } } }, orderBy: [{ category: { name: "asc" } }, { name: "asc" }] })
  return products.map((p) => ({ id: p.id, name: p.name, category: p.category.name, price: Number(p.price), stock: p.stock }))
}

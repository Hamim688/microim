import type { Prisma } from "@prisma/client"

export class StockError extends Error {}

/**
 * Terapkan perubahan stok per produk dalam satu transaksi database.
 * `deduct` > 0 berarti stok berkurang (terjual), < 0 berarti stok kembali.
 */
export async function applyStockChanges(
  tx: Prisma.TransactionClient,
  changes: Map<string, number>,
  ctx: { orderId: string | null; note: string },
) {
  for (const [productId, deduct] of changes) {
    if (deduct === 0) continue
    let product
    if (deduct > 0) {
      const res = await tx.product.updateMany({ where: { id: productId, stock: { gte: deduct } }, data: { stock: { decrement: deduct } } })
      if (res.count === 0) {
        const p = await tx.product.findUnique({ where: { id: productId }, select: { name: true, stock: true } })
        throw new StockError(p ? `Stok ${p.name} tidak cukup (tersisa ${p.stock}, dibutuhkan ${deduct}).` : "Produk tidak ditemukan.")
      }
      product = await tx.product.findUniqueOrThrow({ where: { id: productId }, select: { stock: true } })
    } else {
      product = await tx.product.update({ where: { id: productId }, data: { stock: { increment: -deduct } }, select: { stock: true } })
    }
    await tx.stockMovement.create({
      data: {
        productId,
        type: deduct > 0 ? "SALE" : "RETURN",
        change: -deduct,
        stockAfter: product.stock,
        orderId: ctx.orderId,
        note: ctx.note,
      },
    })
  }
}

type StockItem = { productId: string | null; quantity: number; itemType?: "COMPONENT" | "SERVICE" }

/** Jumlah per produk yang "memakai" stok. Jasa dan transaksi batal tidak memakai stok. */
export function usage(items: StockItem[], active: boolean) {
  const map = new Map<string, number>()
  if (!active) return map
  for (const item of items) {
    if (item.itemType === "SERVICE" || !item.productId) continue
    map.set(item.productId, (map.get(item.productId) ?? 0) + item.quantity)
  }
  return map
}

/** Selisih pemakaian stok: baru − lama. */
export function diffUsage(before: Map<string, number>, after: Map<string, number>) {
  const diff = new Map<string, number>()
  for (const id of new Set([...before.keys(), ...after.keys()])) {
    const d = (after.get(id) ?? 0) - (before.get(id) ?? 0)
    if (d !== 0) diff.set(id, d)
  }
  return diff
}

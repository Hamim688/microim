/** Nama yang ditampilkan untuk satu item transaksi (komponen → nama produk, jasa → nama jasa). */
export function itemName(item: { itemType?: string | null; name?: string | null; product?: { name: string } | null }) {
  if (item.itemType === "SERVICE") return item.name || "Jasa"
  return item.product?.name ?? item.name ?? "Produk terhapus"
}

export const itemTypeLabel = { COMPONENT: "Komponen", SERVICE: "Jasa" } as const

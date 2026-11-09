/** Label stok untuk pembeli. Angka pasti hanya ditampilkan saat stok tinggal sedikit. */
const LOW_STOCK = 5

export type StockTone = "ok" | "low" | "out" | "service"

export function stockInfo(stock: number | null): { label: string; tone: StockTone; available: boolean } {
  if (stock === null) return { label: "JASA", tone: "service", available: true }
  if (stock <= 0) return { label: "STOK HABIS", tone: "out", available: false }
  if (stock <= LOW_STOCK) return { label: `SISA ${stock}`, tone: "low", available: true }
  return { label: "STOK TERSEDIA", tone: "ok", available: true }
}

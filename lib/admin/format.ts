// Format angka, tanggal (WIB) dan label yang dipakai di area admin.
import type { OrderStatus, PaymentMethod, StockMovementType } from "@prisma/client"

const rupiahFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
export function rupiah(value: number | string | { toString(): string }) {
  return rupiahFormatter.format(Number(value.toString()))
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit", month: "short", year: "numeric" })
const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
})
export const formatDate = (date: Date) => dateFormatter.format(date)
export const formatDateTime = (date: Date) => dateTimeFormatter.format(date)

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
/** Awal hari (00:00 WIB) dari tanggal tertentu, dalam bentuk Date UTC. */
export function startOfDayWIB(date = new Date()) {
  const shifted = new Date(date.getTime() + WIB_OFFSET_MS)
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - WIB_OFFSET_MS)
}
/** Awal bulan (tanggal 1, 00:00 WIB). */
export function startOfMonthWIB(date = new Date()) {
  const shifted = new Date(date.getTime() + WIB_OFFSET_MS)
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), 1) - WIB_OFFSET_MS)
}
/** "YYYY-MM-DD" menurut WIB, untuk nilai awal <input type="date">. */
export function toDateInputWIB(date = new Date()) {
  return new Date(date.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10)
}
/** Ubah "YYYY-MM-DD" (WIB) jadi Date; jamnya memakai jam sekarang agar urutan transaksi di hari yang sama tetap wajar. */
export function fromDateInputWIB(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return new Date()
  const now = new Date(Date.now() + WIB_OFFSET_MS)
  return new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) - WIB_OFFSET_MS,
  )
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING: "Belum Bayar",
  PAID: "Lunas",
  SHIPPED: "Dikirim",
  DELIVERED: "Selesai",
  CANCELLED: "Batal",
}
export const orderStatusTone: Record<OrderStatus, "amber" | "green" | "blue" | "slate" | "red"> = {
  PENDING: "amber",
  PAID: "green",
  SHIPPED: "blue",
  DELIVERED: "slate",
  CANCELLED: "red",
}
export const paymentLabel: Record<PaymentMethod, string> = {
  CASH: "Tunai",
  TRANSFER: "Transfer",
  QRIS: "QRIS",
  OTHER: "Lainnya",
}
export const movementLabel: Record<StockMovementType, string> = {
  INITIAL: "Stok awal",
  RESTOCK: "Restock",
  SALE: "Terjual",
  RETURN: "Dikembalikan",
  ADJUSTMENT: "Koreksi",
}


export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "produk"
}

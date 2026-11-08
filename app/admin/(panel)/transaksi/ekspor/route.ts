import { getAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { formatDateTime, orderStatusLabel, paymentLabel, startOfDayWIB, startOfMonthWIB, toDateInputWIB } from "@/lib/admin/format"
import { itemName, itemTypeLabel } from "@/lib/admin/order-items"

/** Unduh transaksi sebagai CSV: satu baris per item (seperti spreadsheet lama), pemisah titik koma. */
export async function GET(request: Request) {
  if (!(await getAdmin())) return new Response("Tidak diizinkan", { status: 401 })
  const period = new URL(request.url).searchParams.get("periode") ?? "semua"
  const from =
    period === "hari" ? startOfDayWIB()
    : period === "7hari" ? new Date(startOfDayWIB().getTime() - 6 * 86_400_000)
    : period === "30hari" ? new Date(startOfDayWIB().getTime() - 29 * 86_400_000)
    : period === "bulan" ? startOfMonthWIB()
    : undefined

  const orders = await db.order.findMany({
    where: from ? { createdAt: { gte: from } } : {},
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "asc" },
  })
  const cell = (v: string | number) => {
    const s = String(v)
    return /[";\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
  }
  const header = ["Tanggal", "No Transaksi", "Pembeli", "Kontak", "Status", "Pembayaran", "Jenis", "Item", "Jumlah", "Harga", "Subtotal", "Modal/pcs", "Laba"]
  const lines: string[] = []
  for (const o of orders) {
    for (const i of o.items) {
      const price = Number(i.price)
      const cost = Number(i.costPrice)
      lines.push(
        [
          formatDateTime(o.createdAt),
          o.orderNumber,
          o.customerName,
          o.customerContact ?? "",
          orderStatusLabel[o.status],
          paymentLabel[o.paymentMethod],
          itemTypeLabel[i.itemType],
          itemName(i),
          i.quantity,
          price,
          price * i.quantity,
          cost,
          o.status === "CANCELLED" ? 0 : (price - cost) * i.quantity,
        ]
          .map(cell)
          .join(";"),
      )
    }
  }
  const csv = "﻿" + [header.join(";"), ...lines].join("\r\n")
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="microim-transaksi-${period}-${toDateInputWIB()}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}

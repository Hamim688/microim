import { getAdmin } from "@/lib/auth/session"
import { stockReport } from "@/lib/admin/stock-report"
import { stockStatusLabel } from "@/lib/admin/settings"
import { toDateInputWIB } from "@/lib/admin/format"

/** Unduh data Produk & Stok sebagai CSV (pemisah titik koma, cocok untuk Excel Indonesia & Google Sheets). */
export async function GET() {
  if (!(await getAdmin())) return new Response("Tidak diizinkan", { status: 401 })
  const { rows } = await stockReport()
  rows.sort((a, b) => a.name.localeCompare(b.name, "id"))

  const cell = (v: string | number) => {
    const s = String(v)
    return /[";\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
  }
  const header = ["No", "Nama Komponen", "Kategori", "Modal/pcs", "Harga Jual/pcs", "Margin/pcs", "Stok Masuk", "Stok Terjual", "Stok Sisa", "Status", "Nilai Modal Stok"]
  const lines = rows.map((r, i) =>
    [i + 1, r.name, r.kategori, r.modal, r.jual, r.margin, r.masuk, r.terjual, r.sisa, stockStatusLabel[r.status], r.modal * r.sisa].map(cell).join(";"),
  )
  const csv = "﻿" + [header.join(";"), ...lines].join("\r\n")
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="microim-stok-${toDateInputWIB()}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}

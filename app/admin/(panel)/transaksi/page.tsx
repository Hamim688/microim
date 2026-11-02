import type { Metadata } from "next"
import Link from "next/link"
import { ChevronDown, Plus, Search } from "lucide-react"
import type { OrderStatus, Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { formatDate, orderStatusLabel, paymentLabel, rupiah, startOfDayWIB, startOfMonthWIB } from "@/lib/admin/format"
import { StatusBadge } from "@/components/admin/status-badge"

export const metadata: Metadata = { title: "Transaksi" }

const PAGE_SIZE = 30
const PERIODS = { semua: "Semua waktu", hari: "Hari ini", "7hari": "7 hari terakhir", bulan: "Bulan ini" } as const
type Period = keyof typeof PERIODS

function periodStart(period: Period) {
  if (period === "hari") return startOfDayWIB()
  if (period === "7hari") return new Date(startOfDayWIB().getTime() - 6 * 86_400_000)
  if (period === "bulan") return startOfMonthWIB()
  return undefined
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; periode?: string; hal?: string; deleted?: string }>
}) {
  await requireAdmin()
  const sp = await searchParams
  const q = sp.q?.trim() ?? ""
  const status = (Object.keys(orderStatusLabel) as OrderStatus[]).includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined
  const period: Period = sp.periode && sp.periode in PERIODS ? (sp.periode as Period) : "semua"
  const page = Math.max(1, Number(sp.hal) || 1)
  const from = periodStart(period)

  const where: Prisma.OrderWhereInput = {
    ...(q ? { OR: [{ customerName: { contains: q, mode: "insensitive" as const } }, { orderNumber: { contains: q, mode: "insensitive" as const } }] } : {}),
    ...(status ? { status } : {}),
    ...(from ? { createdAt: { gte: from } } : {}),
  }
  const [orders, count, sum] = await Promise.all([
    db.order.findMany({
      where,
      include: { items: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.order.count({ where }),
    db.order.aggregate({ where: { ...where, status: status ?? { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
  ])
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const link = (p: number) => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (status) params.set("status", status)
    if (period !== "semua") params.set("periode", period)
    if (p > 1) params.set("hal", String(p))
    const s = params.toString()
    return `/admin/transaksi${s ? `?${s}` : ""}`
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Transaksi</h1>
          <p>{count} transaksi · {status === "CANCELLED" ? "nilai batal" : "omzet"} {rupiah(sum._sum.totalAmount ?? 0)}</p>
        </div>
        <Link href="/admin/transaksi/baru" className="admin-btn is-primary"><Plus aria-hidden="true" /> Catat transaksi</Link>
      </header>
      {sp.deleted ? <p className="admin-alert is-success" role="status">Transaksi dihapus dan stoknya dikembalikan.</p> : null}

      <form className="admin-toolbar" role="search">
        <label className="admin-search">
          <Search aria-hidden="true" />
          <input name="q" defaultValue={q} placeholder="Cari nama pembeli atau nomor…" aria-label="Cari transaksi" />
        </label>
        <select name="status" defaultValue={status ?? ""} aria-label="Filter status">
          <option value="">Semua status</option>
          {(Object.keys(orderStatusLabel) as OrderStatus[]).map((s) => <option key={s} value={s}>{orderStatusLabel[s]}</option>)}
        </select>
        <select name="periode" defaultValue={period} aria-label="Filter periode">
          {(Object.keys(PERIODS) as Period[]).map((p) => <option key={p} value={p}>{PERIODS[p]}</option>)}
        </select>
        <button type="submit" className="admin-btn">Terapkan</button>
      </form>

      <div className="admin-orders admin-stagger">
        {orders.map((order) => {
          const qty = order.items.reduce((s, i) => s + i.quantity, 0)
          const preview = order.items.map((i) => i.product.name).slice(0, 3).join(", ") + (order.items.length > 3 ? ` +${order.items.length - 3}` : "")
          return (
            <details key={order.id} className="admin-order">
              <summary>
                <span className="admin-order-main">
                  <strong>{order.customerName}</strong>
                  <small>{order.orderNumber} · {formatDate(order.createdAt)} · {paymentLabel[order.paymentMethod]}</small>
                </span>
                <span className="admin-order-items">{preview}<small>{order.items.length} jenis · {qty} barang</small></span>
                <StatusBadge status={order.status} />
                <span className="admin-order-total">{rupiah(order.totalAmount)}</span>
                <ChevronDown aria-hidden="true" className="admin-order-chevron" />
              </summary>
              <div className="admin-order-body">
                <table className="admin-table is-compact">
                  <thead><tr><th>Komponen</th><th className="is-num">Jumlah</th><th className="is-num">Harga</th><th className="is-num">Subtotal</th></tr></thead>
                  <tbody>
                    {order.items.map((i) => (
                      <tr key={i.id}>
                        <td>{i.product.name}</td>
                        <td className="is-num">{i.quantity}</td>
                        <td className="is-num">{rupiah(i.price)}</td>
                        <td className="is-num">{rupiah(Number(i.price) * i.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr><td colSpan={3}>Total</td><td className="is-num">{rupiah(order.totalAmount)}</td></tr></tfoot>
                </table>
                {order.note ? <p className="admin-muted">Catatan: {order.note}</p> : null}
                <div className="admin-order-actions">
                  <Link href={`/admin/transaksi/${order.id}`} className="admin-btn">Detail & status</Link>
                  <Link href={`/admin/transaksi/${order.id}/edit`} className="admin-btn is-ghost">Edit</Link>
                </div>
              </div>
            </details>
          )
        })}
        {orders.length === 0 ? (
          <div className="admin-card admin-empty">{q || status || period !== "semua" ? "Tidak ada transaksi yang cocok." : "Belum ada transaksi. Catat transaksi pertama."}</div>
        ) : null}
      </div>

      {pages > 1 ? (
        <nav className="admin-pager" aria-label="Halaman">
          {page > 1 ? <Link href={link(page - 1)} className="admin-btn is-ghost">Sebelumnya</Link> : <span />}
          <span>Halaman {page} dari {pages}</span>
          {page < pages ? <Link href={link(page + 1)} className="admin-btn is-ghost">Berikutnya</Link> : <span />}
        </nav>
      ) : null}
    </div>
  )
}

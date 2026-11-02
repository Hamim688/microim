import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowRight, CalendarRange, Clock3, Package, Plus, Wallet } from "lucide-react"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { LOW_STOCK, formatDate, rupiah, startOfDayWIB, startOfMonthWIB, toDateInputWIB } from "@/lib/admin/format"
import { StatusBadge } from "@/components/admin/status-badge"
import { CountUp } from "@/components/admin/count-up"

export const metadata: Metadata = { title: "Ringkasan" }

const DAYS = 14

export default async function AdminDashboard() {
  await requireAdmin()
  const today = startOfDayWIB()
  const month = startOfMonthWIB()
  const chartFrom = new Date(today.getTime() - (DAYS - 1) * 86_400_000)
  const active = { status: { not: "CANCELLED" as const } }

  const [todaySum, monthSum, unpaid, lowStock, monthItems, chartOrders, recent, stockAgg] = await Promise.all([
    db.order.aggregate({ where: { ...active, createdAt: { gte: today } }, _sum: { totalAmount: true }, _count: true }),
    db.order.aggregate({ where: { ...active, createdAt: { gte: month } }, _sum: { totalAmount: true }, _count: true }),
    db.order.aggregate({ where: { status: "PENDING" }, _sum: { totalAmount: true }, _count: true }),
    db.product.findMany({ where: { stock: { lte: LOW_STOCK } }, orderBy: [{ stock: "asc" }, { name: "asc" }], take: 8, select: { id: true, name: true, stock: true } }),
    db.orderItem.findMany({
      where: { order: { ...active, createdAt: { gte: month } } },
      select: { productId: true, quantity: true, price: true, product: { select: { name: true } } },
    }),
    db.order.findMany({ where: { ...active, createdAt: { gte: chartFrom } }, select: { createdAt: true, totalAmount: true } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { _count: { select: { items: true } } } }),
    db.product.findMany({ select: { stock: true, price: true } }),
  ])

  const top = [...monthItems.reduce((map, i) => {
    const row = map.get(i.productId) ?? { name: i.product.name, qty: 0, revenue: 0 }
    row.qty += i.quantity
    row.revenue += i.quantity * Number(i.price)
    return map.set(i.productId, row)
  }, new Map<string, { name: string; qty: number; revenue: number }>()).values()].sort((a, b) => b.qty - a.qty).slice(0, 5)

  const days = Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(chartFrom.getTime() + i * 86_400_000)
    return { key: toDateInputWIB(date), date, total: 0 }
  })
  const dayIndex = new Map(days.map((d, i) => [d.key, i]))
  for (const o of chartOrders) {
    const i = dayIndex.get(toDateInputWIB(o.createdAt))
    if (i !== undefined) days[i].total += Number(o.totalAmount)
  }
  const maxDay = Math.max(1, ...days.map((d) => d.total))
  const chartTotal = days.reduce((s, d) => s + d.total, 0)
  const stockValue = stockAgg.reduce((s, p) => s + p.stock * Number(p.price), 0)
  const monthName = new Intl.DateTimeFormat("id-ID", { month: "long", timeZone: "Asia/Jakarta" }).format(today)

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Ringkasan</h1>
          <p>{new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeZone: "Asia/Jakarta" }).format(new Date())}</p>
        </div>
        <Link href="/admin/transaksi/baru" className="admin-btn is-primary"><Plus aria-hidden="true" /> Catat transaksi</Link>
      </header>

      <div className="admin-stats admin-stagger">
        <div className="admin-stat is-gold">
          <i className="admin-stat-icon"><Wallet aria-hidden="true" /></i>
          <span>Omzet hari ini</span>
          <strong><CountUp value={Number(todaySum._sum.totalAmount ?? 0)} format="rupiah" /></strong>
          <small>{todaySum._count} transaksi</small>
        </div>
        <div className="admin-stat is-green">
          <i className="admin-stat-icon"><CalendarRange aria-hidden="true" /></i>
          <span>Omzet {monthName}</span>
          <strong><CountUp value={Number(monthSum._sum.totalAmount ?? 0)} format="rupiah" /></strong>
          <small>{monthSum._count} transaksi</small>
        </div>
        <Link href="/admin/transaksi?status=PENDING" className="admin-stat is-link is-amber">
          <i className="admin-stat-icon"><Clock3 aria-hidden="true" /></i>
          <span>Belum dibayar</span>
          <strong><CountUp value={Number(unpaid._sum.totalAmount ?? 0)} format="rupiah" /></strong>
          <small>{unpaid._count} transaksi</small>
        </Link>
        <Link href="/admin/produk" className="admin-stat is-link is-blue">
          <i className="admin-stat-icon"><Package aria-hidden="true" /></i>
          <span>Nilai stok</span>
          <strong><CountUp value={stockValue} format="rupiah" /></strong>
          <small>{stockAgg.reduce((s, p) => s + p.stock, 0)} barang di gudang</small>
        </Link>
      </div>

      <div className="admin-columns is-wide-left admin-stagger">
        <section className="admin-card">
          <h2>Penjualan {DAYS} hari terakhir <small>{rupiah(chartTotal)}</small></h2>
          <div className="admin-chart" role="img" aria-label={`Grafik omzet harian ${DAYS} hari terakhir, total ${rupiah(chartTotal)}`}>
            {days.map((d, i) => (
              <div key={d.key} className="admin-chart-col" style={{ "--i": i } as React.CSSProperties}>
                <span className="admin-chart-tip">{formatDate(d.date)}<b>{rupiah(d.total)}</b></span>
                <div className="admin-chart-bar" style={{ height: `${(d.total / maxDay) * 100}%` }} data-empty={d.total === 0 || undefined} />
                <span>{Number(d.key.slice(8))}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h2>Stok menipis <small>≤ {LOW_STOCK}</small></h2>
          {lowStock.length ? (
            <ul className="admin-list admin-stagger">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/produk/${p.id}`}>{p.name}</Link>
                  <span className="admin-stock is-low">{p.stock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-muted">Semua stok aman.</p>
          )}
          {lowStock.some((p) => p.stock === 0) ? (
            <p className="admin-hint is-error"><AlertTriangle aria-hidden="true" /> Ada produk yang habis.</p>
          ) : null}
        </section>
      </div>

      <div className="admin-columns admin-stagger">
        <section className="admin-card">
          <h2>Terlaris bulan ini</h2>
          {top.length ? (
            <ol className="admin-list is-ranked admin-stagger">
              {top.map((p) => (
                <li key={p.name}>
                  <span>{p.name}</span>
                  <span className="admin-muted">{p.qty} terjual · {rupiah(p.revenue)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="admin-muted">Belum ada penjualan bulan ini.</p>
          )}
        </section>
        <section className="admin-card">
          <h2>Transaksi terbaru <Link href="/admin/transaksi" className="admin-link">Semua <ArrowRight aria-hidden="true" /></Link></h2>
          {recent.length ? (
            <ul className="admin-list admin-stagger">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/transaksi/${o.id}`}>
                    {o.customerName}
                    <small className="admin-muted"> · {formatDate(o.createdAt)} · {o._count.items} jenis</small>
                  </Link>
                  <span className="admin-list-end"><StatusBadge status={o.status} /> {rupiah(o.totalAmount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-muted">Belum ada transaksi.</p>
          )}
        </section>
      </div>
    </div>
  )
}

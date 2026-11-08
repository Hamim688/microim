import { db } from "@/lib/db"
import { paymentLabel, toDateInputWIB } from "@/lib/admin/format"
import { itemName } from "@/lib/admin/order-items"
import { bucketKeys, bucketOf, change, resolvePeriod, type Period } from "@/lib/admin/period"
import { getLowStockThreshold, goodsOnly } from "@/lib/admin/settings"

export type SeriesPoint = { key: string; revenue: number; profit: number; orders: number; visitors: number }
export type RankRow = { name: string; value: number; share: number; sub: string }

/** Data kunjungan; tetap aman (kosong) bila tabel PageView belum dibuat lewat `prisma db push`. */
async function safeViews(createdAt: { gte?: Date; lt?: Date }) {
  try {
    return await db.pageView.findMany({ where: { createdAt }, select: { visitorId: true, path: true, createdAt: true, referrer: true, device: true } })
  } catch {
    return []
  }
}

const sumOrders = (orders: { totalAmount: unknown }[]) => orders.reduce((s, o) => s + Number(o.totalAmount), 0)

export async function dashboardData(periodKey?: string, month?: string) {
  const first = await db.order.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } })
  const earliest = first?.createdAt ?? null
  const period = resolvePeriod(periodKey, month, earliest)
  const range = (from: Date | null, to: Date | null) => ({ ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) })
  const inRange = { createdAt: range(period.from, period.to) }
  const active = { status: { not: "CANCELLED" as const } }

  const [orders, prevOrders, views, prevViews, threshold, months, lowStock, recent, pending] = await Promise.all([
    db.order.findMany({
      where: { ...inRange, ...active },
      include: { items: { include: { product: { select: { name: true, category: { select: { name: true } } } } } } },
    }),
    period.prevFrom
      ? db.order.findMany({ where: { createdAt: range(period.prevFrom, period.prevTo), ...active }, include: { items: { select: { quantity: true, price: true, costPrice: true } } } })
      : Promise.resolve(null),
    safeViews(inRange.createdAt),
    period.prevFrom ? safeViews(range(period.prevFrom, period.prevTo)) : Promise.resolve(null),
    getLowStockThreshold(),
    db.$queryRaw<{ ym: string }[]>`SELECT DISTINCT to_char("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM') AS ym FROM "Order" ORDER BY ym DESC`,
    db.product.findMany({ where: goodsOnly, select: { id: true, name: true, stock: true }, orderBy: [{ stock: "asc" }, { name: "asc" }] }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { _count: { select: { items: true } } } }),
    db.order.aggregate({ where: { status: "PENDING" }, _sum: { totalAmount: true }, _count: true }),
  ])

  // --- angka utama ---
  const items = orders.flatMap((o) => o.items)
  const revenue = sumOrders(orders)
  const profit = items.reduce((s, i) => s + i.quantity * (Number(i.price) - Number(i.costPrice)), 0)
  const pcs = items.filter((i) => i.itemType === "COMPONENT").reduce((s, i) => s + i.quantity, 0)
  const visitors = new Set(views.map((v) => v.visitorId)).size

  const prevItems = prevOrders?.flatMap((o) => o.items) ?? null
  const prev = prevOrders
    ? {
        revenue: sumOrders(prevOrders),
        profit: prevItems!.reduce((s, i) => s + i.quantity * (Number(i.price) - Number(i.costPrice)), 0),
        orders: prevOrders.length,
        visitors: prevViews ? new Set(prevViews.map((v) => v.visitorId)).size : 0,
      }
    : null

  const kpi = {
    revenue: { value: revenue, change: change(revenue, prev?.revenue ?? null) },
    profit: { value: profit, change: change(profit, prev?.profit ?? null), margin: revenue ? Math.round((profit / revenue) * 100) : 0 },
    orders: { value: orders.length, change: change(orders.length, prev?.orders ?? null) },
    average: {
      value: orders.length ? revenue / orders.length : 0,
      change: change(orders.length ? revenue / orders.length : 0, prev && prev.orders ? prev.revenue / prev.orders : prev ? 0 : null),
    },
    pcs: { value: pcs },
    visitors: { value: visitors, views: views.length, change: change(visitors, prev?.visitors ?? null) },
    conversion: visitors ? Math.round((orders.length / visitors) * 1000) / 10 : null,
    pending: { value: Number(pending._sum.totalAmount ?? 0), count: pending._count },
  }

  // --- grafik per tanggal/bulan ---
  const keys = bucketKeys(period, earliest)
  const series = new Map<string, SeriesPoint & { ids: Set<string> }>(keys.map((k) => [k, { key: k, revenue: 0, profit: 0, orders: 0, visitors: 0, ids: new Set() }]))
  for (const o of orders) {
    const p = series.get(bucketOf(o.createdAt, period.bucket))
    if (!p) continue
    p.revenue += Number(o.totalAmount)
    p.orders += 1
    p.profit += o.items.reduce((s, i) => s + i.quantity * (Number(i.price) - Number(i.costPrice)), 0)
  }
  for (const v of views) series.get(bucketOf(v.createdAt, period.bucket))?.ids.add(v.visitorId)
  const points: SeriesPoint[] = [...series.values()].map(({ ids, ...p }) => ({ ...p, visitors: ids.size }))

  // --- peringkat komponen ---
  const byItem = new Map<string, { name: string; qty: number; revenue: number; profit: number; service: boolean }>()
  for (const i of items) {
    const key = i.productId ?? `jasa:${(i.name ?? "").toLowerCase()}`
    const row = byItem.get(key) ?? { name: itemName(i), qty: 0, revenue: 0, profit: 0, service: i.itemType === "SERVICE" }
    row.qty += i.quantity
    row.revenue += i.quantity * Number(i.price)
    row.profit += i.quantity * (Number(i.price) - Number(i.costPrice))
    byItem.set(key, row)
  }
  const components = [...byItem.values()].filter((r) => !r.service)
  const totalQty = components.reduce((s, r) => s + r.qty, 0)
  const topQty: RankRow[] = [...components].sort((a, b) => b.qty - a.qty).slice(0, 8)
    .map((r) => ({ name: r.name, value: r.qty, share: totalQty ? (r.qty / totalQty) * 100 : 0, sub: `${r.qty} pcs` }))
  const allRevenue = [...byItem.values()]
  const topRevenue: RankRow[] = [...allRevenue].sort((a, b) => b.revenue - a.revenue).slice(0, 8)
    .map((r) => ({ name: r.service ? `${r.name} (jasa)` : r.name, value: r.revenue, share: revenue ? (r.revenue / revenue) * 100 : 0, sub: "" }))

  // --- komposisi ---
  const byCategory = new Map<string, number>()
  for (const i of items) {
    const cat = i.itemType === "SERVICE" ? "Jasa" : (i.product?.category.name ?? "Lainnya")
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + i.quantity * Number(i.price))
  }
  const cats = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
  const categories = (cats.length > 6 ? [...cats.slice(0, 5), ["Lainnya", cats.slice(5).reduce((s, [, v]) => s + v, 0)] as [string, number]] : cats)
    .map(([name, value]) => ({ name, value, share: revenue ? (value / revenue) * 100 : 0 }))

  const serviceRevenue = items.filter((i) => i.itemType === "SERVICE").reduce((s, i) => s + i.quantity * Number(i.price), 0)
  const mix = [
    { name: "Komponen", value: revenue - serviceRevenue },
    { name: "Jasa", value: serviceRevenue },
  ].map((m) => ({ ...m, share: revenue ? (m.value / revenue) * 100 : 0 }))

  const byPayment = new Map<string, number>()
  for (const o of orders) byPayment.set(paymentLabel[o.paymentMethod], (byPayment.get(paymentLabel[o.paymentMethod]) ?? 0) + Number(o.totalAmount))
  const payments = [...byPayment.entries()].sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value, share: revenue ? (value / revenue) * 100 : 0 }))

  // --- pembeli teratas ---
  const byBuyer = new Map<string, { name: string; value: number; orders: number }>()
  for (const o of orders) {
    const key = o.customerName.trim().toLowerCase()
    const b = byBuyer.get(key) ?? { name: o.customerName.trim(), value: 0, orders: 0 }
    b.value += Number(o.totalAmount)
    b.orders += 1
    byBuyer.set(key, b)
  }
  const buyers: RankRow[] = [...byBuyer.values()].sort((a, b) => b.value - a.value).slice(0, 6)
    .map((b) => ({ name: b.name, value: b.value, share: revenue ? (b.value / revenue) * 100 : 0, sub: `${b.orders} transaksi` }))

  // --- pengunjung ---
  const byPath = new Map<string, Set<string>>()
  for (const v of views) {
    if (!byPath.has(v.path)) byPath.set(v.path, new Set())
    byPath.get(v.path)!.add(v.visitorId)
  }
  const pageNames: Record<string, string> = { "/": "Beranda", "/about": "Tentang", "/services": "Layanan", "/products": "Produk", "/projects": "Proyek", "/contact": "Kontak" }
  const topPages: RankRow[] = [...byPath.entries()].map(([path, ids]) => ({ path, n: ids.size })).sort((a, b) => b.n - a.n).slice(0, 6)
    .map((p) => ({ name: pageNames[p.path] ?? p.path, value: p.n, share: visitors ? (p.n / visitors) * 100 : 0, sub: p.path }))
  const byRef = new Map<string, number>()
  for (const v of views) byRef.set(v.referrer ?? "Langsung / lainnya", (byRef.get(v.referrer ?? "Langsung / lainnya") ?? 0) + 1)
  const referrers = [...byRef.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value, share: views.length ? (value / views.length) * 100 : 0 }))
  const mobile = views.filter((v) => v.device === "mobile").length

  return {
    period,
    months: months.map((m) => m.ym).filter(Boolean),
    kpi,
    points,
    topQty,
    topRevenue,
    categories,
    mix,
    payments,
    buyers,
    visitors: { topPages, referrers, mobileShare: views.length ? (mobile / views.length) * 100 : 0, views: views.length },
    lowStock: lowStock.filter((p) => p.stock <= threshold).slice(0, 6),
    threshold,
    recent,
    today: toDateInputWIB(),
  }
}

export type DashboardData = Awaited<ReturnType<typeof dashboardData>>
export type { Period }

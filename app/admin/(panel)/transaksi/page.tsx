import type { Metadata } from "next"
import Link from "next/link"
import { CalendarRange, Clock3, Download, Package, Plus, ReceiptText, TrendingUp, Wallet, Wrench } from "lucide-react"
import type { OrderStatus, Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { formatDate, orderStatusLabel, orderStatusTone, paymentLabel, rupiah, startOfDayWIB, startOfMonthWIB } from "@/lib/admin/format"
import { itemName } from "@/lib/admin/order-items"
import { ListFilters } from "@/components/admin/list-filters"
import { OrderRow, type OrderRowData } from "@/components/admin/order-row"
import { Pagination } from "@/components/admin/pagination"
import { ViewSlide, ViewSwitch } from "@/components/admin/view-switch"
import { deleteOrder, setOrderStatus } from "./actions"

export const metadata: Metadata = { title: "Transaksi" }

const PER_PAGE = [10, 25, 50]
const PERIODS = { semua: "Semua waktu", hari: "Hari ini", "7hari": "7 hari terakhir", "30hari": "30 hari terakhir", bulan: "Bulan ini" } as const
type Period = keyof typeof PERIODS
const STATUS_ORDER: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]

function periodStart(period: Period) {
  if (period === "hari") return startOfDayWIB()
  if (period === "7hari") return new Date(startOfDayWIB().getTime() - 6 * 86_400_000)
  if (period === "30hari") return new Date(startOfDayWIB().getTime() - 29 * 86_400_000)
  if (period === "bulan") return startOfMonthWIB()
  return undefined
}

type SP = { q?: string; status?: string; periode?: string; hal?: string; per?: string; tampilan?: string; deleted?: string }

export default async function OrdersPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdmin()
  const sp = await searchParams
  const q = sp.q?.trim() ?? ""
  const status = STATUS_ORDER.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined
  const period: Period = sp.periode && sp.periode in PERIODS ? (sp.periode as Period) : "semua"
  const perPage = PER_PAGE.includes(Number(sp.per)) ? Number(sp.per) : PER_PAGE[0]
  const from = periodStart(period)
  const view: "pembeli" | "item" = sp.tampilan === "item" ? "item" : "pembeli"

  const inPeriod: Prisma.OrderWhereInput = from ? { createdAt: { gte: from } } : {}
  const contains = (v: string) => ({ contains: v, mode: "insensitive" as const })
  const matchQ: Prisma.OrderWhereInput = q
    ? {
        OR: [
          { customerName: contains(q) },
          { orderNumber: contains(q) },
          { customerContact: contains(q) },
          { items: { some: { OR: [{ name: contains(q) }, { product: { name: contains(q) } }] } } },
        ],
      }
    : {}
  const base: Prisma.OrderWhereInput = { ...inPeriod, ...matchQ }
  const where: Prisma.OrderWhereInput = { ...base, ...(status ? { status } : {}) }
  const active: Prisma.OrderWhereInput = { ...inPeriod, status: { not: "CANCELLED" } }

  // Tampilan "per item": satu baris = satu item, kalau dicari nama komponen hanya item itu yang muncul.
  const itemWhere: Prisma.OrderItemWhereInput = {
    order: { ...inPeriod, ...(status ? { status } : {}) },
    ...(q
      ? {
          OR: [
            { name: contains(q) },
            { product: { name: contains(q) } },
            { order: { customerName: contains(q) } },
            { order: { orderNumber: contains(q) } },
          ],
        }
      : {}),
  }
  const requested = Math.max(1, Number(sp.hal) || 1)
  const skip = (requested - 1) * perPage

  // Semua query dijalankan sekaligus (bukan berurutan) supaya halaman lebih cepat.
  const [statusGroups, omzet, unpaid, profitItems, count, itemCount, itemSum, itemAll, orders, items] = await Promise.all([
    db.order.groupBy({ by: ["status"], where: base, _count: true }),
    db.order.aggregate({ where: active, _sum: { totalAmount: true }, _count: true }),
    db.order.aggregate({ where: { ...inPeriod, status: "PENDING" }, _sum: { totalAmount: true }, _count: true }),
    db.orderItem.findMany({ where: { order: active }, select: { quantity: true, price: true, costPrice: true } }),
    view === "pembeli" ? db.order.count({ where }) : Promise.resolve(0),
    view === "item" ? db.orderItem.count({ where: itemWhere }) : Promise.resolve(0),
    view === "item" ? db.orderItem.aggregate({ where: itemWhere, _sum: { quantity: true } }) : Promise.resolve(null),
    view === "item" ? db.orderItem.findMany({ where: itemWhere, select: { quantity: true, price: true } }) : Promise.resolve([]),
    view === "pembeli"
      ? db.order.findMany({
          where,
          include: { items: { include: { product: { select: { name: true } } } } },
          orderBy: { createdAt: "desc" },
          skip,
          take: perPage,
        })
      : Promise.resolve([]),
    view === "item"
      ? db.orderItem.findMany({
          where: itemWhere,
          include: { product: { select: { name: true } }, order: { select: { id: true, orderNumber: true, customerName: true, createdAt: true, status: true } } },
          orderBy: [{ order: { createdAt: "desc" } }, { id: "asc" }],
          skip,
          take: perPage,
        })
      : Promise.resolve([]),
  ])
  const listCount = view === "item" ? itemCount : count
  const pages = Math.max(1, Math.ceil(listCount / perPage))
  const page = Math.min(pages, requested)
  const itemRevenue = itemAll.reduce((s, i) => s + i.quantity * Number(i.price), 0)

  const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as Record<OrderStatus, number>
  for (const g of statusGroups) counts[g.status] = g._count
  const totalInBase = Object.values(counts).reduce((a, b) => a + b, 0)
  const profit = profitItems.reduce((s, i) => s + i.quantity * (Number(i.price) - Number(i.costPrice)), 0)
  const omzetValue = Number(omzet._sum.totalAmount ?? 0)
  const margin = omzetValue > 0 ? Math.round((profit / omzetValue) * 100) : 0

  const rows: OrderRowData[] = orders.map((o) => {
    const orderProfit = o.status === "CANCELLED" ? null : o.items.reduce((s, i) => s + i.quantity * (Number(i.price) - Number(i.costPrice)), 0)
    return {
      id: o.id,
      number: o.orderNumber,
      customer: o.customerName,
      contact: o.customerContact,
      date: formatDate(o.createdAt),
      payment: paymentLabel[o.paymentMethod],
      status: o.status,
      statusLabel: orderStatusLabel[o.status],
      statusTone: orderStatusTone[o.status],
      total: rupiah(o.totalAmount),
      profit: orderProfit === null ? null : rupiah(orderProfit),
      note: o.note,
      items: o.items.map((i) => ({
        key: i.id,
        type: i.itemType,
        name: itemName(i),
        qty: i.quantity,
        price: rupiah(i.price),
        sub: rupiah(Number(i.price) * i.quantity),
      })),
    }
  })

  const href = (patch: Partial<Record<"status" | "hal" | "tampilan", string | undefined>>) => {
    const params = new URLSearchParams()
    const next = {
      q,
      periode: period === "semua" ? undefined : period,
      per: perPage === PER_PAGE[0] ? undefined : String(perPage),
      tampilan: view === "item" ? "item" : undefined,
      status,
      hal: undefined,
      ...patch,
    }
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v)
    const s = params.toString()
    return `/admin/transaksi${s ? `?${s}` : ""}`
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Transaksi</h1>
          <div className="admin-head-meta">
            <span>{PERIODS[period]}</span>
            <span className="admin-dot-sep" aria-hidden="true" />
            <span>{omzet._count} transaksi</span>
            {unpaid._count ? (
              <Link href={href({ status: "PENDING" })} className="admin-head-alert" scroll={false}>
                {unpaid._count} belum dibayar · {rupiah(unpaid._sum.totalAmount ?? 0)}
              </Link>
            ) : (
              <span className="admin-head-ok">Semua sudah dibayar</span>
            )}
          </div>
        </div>
        <div className="admin-head-actions">
          <a href={`/admin/transaksi/ekspor?periode=${period}`} className="admin-btn is-ghost" download>
            <Download aria-hidden="true" /> Ekspor CSV
          </a>
          <Link href="/admin/transaksi/baru" className="admin-btn is-primary"><Plus aria-hidden="true" /> Catat transaksi</Link>
        </div>
      </header>
      {sp.deleted ? <p className="admin-alert is-success" role="status">Transaksi dihapus dan stok komponennya dikembalikan.</p> : null}

      <div className="admin-inv-stats admin-stagger">
        <div className="admin-inv-stat">
          <i className="is-gold"><Wallet aria-hidden="true" /></i>
          <span>Omzet</span>
          <strong>{rupiah(omzetValue)}</strong>
          <small>{PERIODS[period].toLowerCase()}</small>
        </div>
        <div className="admin-inv-stat">
          <i className={profit < 0 ? "is-red" : "is-green"}><TrendingUp aria-hidden="true" /></i>
          <span>Laba kotor</span>
          <strong className={profit < 0 ? "is-loss" : "is-gain"}>{rupiah(profit)}</strong>
          <small>margin {margin}% dari omzet</small>
        </div>
        <div className="admin-inv-stat">
          <i className="is-blue"><ReceiptText aria-hidden="true" /></i>
          <span>Transaksi</span>
          <strong>{omzet._count.toLocaleString("id-ID")}</strong>
          <small>rata-rata {rupiah(omzet._count ? omzetValue / omzet._count : 0)}</small>
        </div>
        <div className="admin-inv-stat">
          <i className="is-violet"><Clock3 aria-hidden="true" /></i>
          <span>Belum dibayar</span>
          <strong>{rupiah(unpaid._sum.totalAmount ?? 0)}</strong>
          <small>{unpaid._count} transaksi menunggu</small>
        </div>
      </div>

      <div className="admin-card is-table">
        <div className="admin-table-toolbar">
          <ViewSwitch view={view} hrefs={{ pembeli: href({ tampilan: undefined }), item: href({ tampilan: "item" }) }} />
          <div className="admin-status-tabs" role="tablist" aria-label="Filter status transaksi">
            <Link href={href({ status: undefined })} className={!status ? "is-active" : undefined} role="tab" aria-selected={!status} scroll={false}>
              Semua <b>{totalInBase}</b>
            </Link>
            {STATUS_ORDER.map((s) => (
              <Link key={s} href={href({ status: s })} className={status === s ? "is-active" : undefined} role="tab" aria-selected={status === s} scroll={false}>
                {orderStatusLabel[s]} <b>{counts[s]}</b>
              </Link>
            ))}
          </div>
        </div>
        <div className="admin-table-toolbar is-second">
          <ListFilters
            placeholder={view === "item" ? "Cari komponen/jasa atau pembeli…" : "Cari pembeli, nomor, atau nama item…"}
            selects={[
              {
                param: "periode",
                label: "Periode",
                className: "is-period",
                defaultValue: "semua",
                options: (Object.keys(PERIODS) as Period[]).map((p) => ({ value: p, label: PERIODS[p] })),
              },
              { param: "per", label: "Baris per halaman", className: "is-per", defaultValue: String(PER_PAGE[0]), options: PER_PAGE.map((n) => ({ value: String(n), label: `${n} / halaman` })) },
            ]}
          />
        </div>

        <ViewSlide view={view}>
        {view === "item" ? (
          <>
            <div className="admin-table-scroll">
              <table className="admin-table admin-items-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Pembeli</th>
                    <th>Item</th>
                    <th className="is-num">Jumlah</th>
                    <th className="is-num">Harga</th>
                    <th className="is-num">Subtotal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="admin-stagger">
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td className="admin-muted">{formatDate(i.order.createdAt)}</td>
                      <td>
                        <Link href={`/admin/transaksi/${i.order.id}`} className="admin-product-name">{i.order.customerName}</Link>
                        <small className="admin-cell-sub">{i.order.orderNumber}</small>
                      </td>
                      <td>
                        <div className="admin-item-name">
                          <span className={`admin-type-icon is-${i.itemType === "COMPONENT" ? "component" : "service"}`} aria-hidden="true">
                            {i.itemType === "COMPONENT" ? <Package /> : <Wrench />}
                          </span>
                          <span>{itemName(i)}</span>
                        </div>
                      </td>
                      <td className="is-num">{i.quantity}</td>
                      <td className="is-num">{rupiah(i.price)}</td>
                      <td className="is-num"><strong>{rupiah(Number(i.price) * i.quantity)}</strong></td>
                      <td><span className={`admin-badge is-${orderStatusTone[i.order.status]}`}>{orderStatusLabel[i.order.status]}</span></td>
                    </tr>
                  ))}
                  {items.length === 0 ? (
                    <tr><td colSpan={7} className="admin-empty">Tidak ada item yang cocok.</td></tr>
                  ) : null}
                </tbody>
                {itemCount ? (
                  <tfoot>
                    <tr>
                      <td colSpan={3}>{q ? `Total “${q}”` : "Total"} · {itemCount} baris</td>
                      <td className="is-num">{itemSum?._sum.quantity ?? 0}</td>
                      <td />
                      <td className="is-num">{rupiah(itemRevenue)}</td>
                      <td />
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>
          </>
        ) : (
        <div className="admin-orows-wrap">
        <div className="admin-orow-head" aria-hidden="true">
          <span>Pembeli</span>
          <span>Tanggal</span>
          <span>Item</span>
          <span>Status</span>
          <span className="is-num">Total</span>
          <span className="is-center">Aksi</span>
        </div>
        <div className="admin-orows admin-stagger">
          {rows.map((o) => (
            <OrderRow key={o.id} order={o} markPaid={setOrderStatus.bind(null, o.id)} remove={deleteOrder.bind(null, o.id)} />
          ))}
          {rows.length === 0 ? (
            <div className="admin-empty">
              <CalendarRange aria-hidden="true" className="admin-empty-icon" />
              {q || status ? "Tidak ada transaksi yang cocok dengan filter ini." : `Belum ada transaksi ${PERIODS[period].toLowerCase()}.`}
              {q || status ? <Link href="/admin/transaksi" className="admin-link">Reset filter</Link> : <Link href="/admin/transaksi/baru" className="admin-link">Catat transaksi</Link>}
            </div>
          ) : null}
        </div>
        </div>
        )}
        </ViewSlide>

        <Pagination
          page={page}
          pages={pages}
          total={listCount}
          from={listCount ? (page - 1) * perPage + 1 : 0}
          to={(page - 1) * perPage + (view === "item" ? items.length : rows.length)}
          unit={view === "item" ? "item" : "transaksi"}
          href={(p) => href({ hal: p > 1 ? String(p) : undefined })}
        />
      </div>
    </div>
  )
}

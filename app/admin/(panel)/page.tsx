import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowRight, Clock3, Eye, Package, Plus, ReceiptText, ShoppingBag, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { requireAdmin } from "@/lib/auth/session"
import { formatDate, rupiah } from "@/lib/admin/format"
import { dashboardData } from "@/lib/admin/dashboard"
import { monthLabel } from "@/lib/admin/period"
import { StatusBadge } from "@/components/admin/status-badge"
import { CountUp } from "@/components/admin/count-up"
import { PeriodPicker } from "@/components/admin/period-picker"
import { SalesChart } from "@/components/admin/charts/sales-chart"
import { Donut } from "@/components/admin/charts/donut"
import { BarList, ShareBar } from "@/components/admin/charts/bar-list"

export const metadata: Metadata = { title: "Dashboard" }

const num = (n: number) => n.toLocaleString("id-ID")
const pcs = (n: number) => `${num(n)} pcs`
const visits = (n: number) => `${num(n)} orang`

function Delta({ value, label }: { value: number | null | undefined; label: string | null }) {
  if (value === null || value === undefined) return null
  const up = value >= 0
  return (
    <span className={`admin-delta ${up ? "is-up" : "is-down"}`} title={label ?? undefined}>
      {up ? <TrendingUp aria-hidden="true" /> : <TrendingDown aria-hidden="true" />}
      {value > 0 ? "+" : ""}{value.toLocaleString("id-ID")}%
    </span>
  )
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ periode?: string; bulan?: string }> }) {
  await requireAdmin()
  const sp = await searchParams
  const d = await dashboardData(sp.periode, sp.bulan)
  const { kpi, period } = d
  const cmp = period.compareLabel

  const kpis = [
    { icon: Wallet, tone: "gold", label: "Pendapatan", value: <CountUp value={kpi.revenue.value} format="rupiah" />, delta: kpi.revenue.change, sub: cmp ?? "total periode ini" },
    { icon: TrendingUp, tone: "green", label: "Laba kotor", value: <CountUp value={kpi.profit.value} format="rupiah" />, delta: kpi.profit.change, sub: `margin ${kpi.profit.margin}%` },
    { icon: ReceiptText, tone: "blue", label: "Transaksi", value: <CountUp value={kpi.orders.value} />, delta: kpi.orders.change, sub: `${pcs(kpi.pcs.value)} komponen terjual` },
    { icon: ShoppingBag, tone: "violet", label: "Rata-rata / transaksi", value: <CountUp value={kpi.average.value} format="rupiah" />, delta: kpi.average.change, sub: "nilai belanja per pembeli" },
    {
      icon: Eye,
      tone: "cyan",
      label: "Pengunjung web",
      value: <CountUp value={kpi.visitors.value} />,
      delta: kpi.visitors.change,
      sub: `${num(kpi.visitors.views)} kunjungan halaman${kpi.conversion !== null ? ` · konversi ${kpi.conversion}%` : ""}`,
    },
  ]

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="admin-head-meta">
            <span>{period.label}</span>
            {cmp ? (
              <>
                <span className="admin-dot-sep" aria-hidden="true" />
                <span>persentase {cmp}</span>
              </>
            ) : null}
            {kpi.pending.count ? (
              <Link href="/admin/transaksi?status=PENDING" className="admin-head-alert">
                <Clock3 aria-hidden="true" /> {kpi.pending.count} belum dibayar · {rupiah(kpi.pending.value)}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="admin-head-actions">
          <PeriodPicker current={period.key === "custom" ? "" : period.key} month={period.month} months={d.months.map((m) => ({ value: m, label: monthLabel(m) }))} />
          <Link href="/admin/transaksi/baru" className="admin-btn is-primary"><Plus aria-hidden="true" /> Catat transaksi</Link>
        </div>
      </header>

      <div className="admin-kpis admin-stagger">
        {kpis.map(({ icon: Icon, tone, label, value, delta, sub }) => (
          <div key={label} className={`admin-kpi is-${tone}`}>
            <div className="admin-kpi-top">
              <i><Icon aria-hidden="true" /></i>
              <Delta value={delta} label={cmp} />
            </div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{sub}</small>
          </div>
        ))}
      </div>

      <section className="admin-card">
        <h2>Penjualan per {period.bucket === "day" ? "tanggal" : "bulan"} <small>{period.label}</small></h2>
        <SalesChart
          points={d.points}
          totals={{ revenue: kpi.revenue.value, profit: kpi.profit.value, orders: kpi.orders.value, visitors: kpi.visitors.value }}
          changes={{ revenue: kpi.revenue.change, profit: kpi.profit.change, orders: kpi.orders.change, visitors: kpi.visitors.change }}
          compareLabel={cmp}
        />
      </section>

      <div className="admin-columns admin-stagger">
        <section className="admin-card">
          <h2>Komponen terlaris <small>berdasarkan jumlah terjual</small></h2>
          <BarList rows={d.topQty} format={pcs} tone="gold" empty="Belum ada komponen terjual di periode ini." />
        </section>
        <section className="admin-card">
          <h2>Pendapatan per item <small>porsi dari total pendapatan</small></h2>
          <BarList rows={d.topRevenue} format={rupiah} tone="green" empty="Belum ada pendapatan di periode ini." />
        </section>
      </div>

      <div className="admin-columns is-three admin-stagger">
        <section className="admin-card">
          <h2>Pendapatan per kategori</h2>
          <Donut data={d.categories} centerLabel="Total" />
        </section>
        <section className="admin-card admin-mix-card">
          <h2>Komponen vs jasa</h2>
          <ShareBar parts={d.mix} format={rupiah} colors={["#3987e5", "#9085e9"]} />
          <h2 className="admin-mix-sub">Metode pembayaran</h2>
          <ShareBar parts={d.payments} format={rupiah} colors={["#199e70", "#3987e5", "#c98500", "#d55181"]} />
        </section>
        <section className="admin-card">
          <h2>Pembeli teratas</h2>
          <BarList rows={d.buyers} format={rupiah} tone="blue" empty="Belum ada pembeli di periode ini." />
        </section>
      </div>

      <section className="admin-card admin-visitors">
        <h2>
          Pengunjung web <small>{period.label}</small>
        </h2>
        {d.visitors.views ? (
          <div className="admin-visitors-grid">
            <div className="admin-visitors-stats">
              <div><span>Pengunjung unik</span><strong>{num(kpi.visitors.value)}</strong></div>
              <div><span>Kunjungan halaman</span><strong>{num(d.visitors.views)}</strong></div>
              <div><span>Halaman / pengunjung</span><strong>{kpi.visitors.value ? (d.visitors.views / kpi.visitors.value).toLocaleString("id-ID", { maximumFractionDigits: 1 }) : 0}</strong></div>
              <div><span>Dari HP</span><strong>{Math.round(d.visitors.mobileShare)}%</strong></div>
            </div>
            <div>
              <h3>Halaman terpopuler</h3>
              <BarList rows={d.visitors.topPages} format={visits} tone="violet" empty="—" />
            </div>
            <div>
              <h3>Sumber kunjungan</h3>
              <ShareBar parts={d.visitors.referrers} format={(n) => `${num(n)} kunjungan`} colors={["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"]} />
            </div>
          </div>
        ) : (
          <p className="admin-muted">
            Belum ada kunjungan tercatat di periode ini. Pencatatan aktif di situs live (microim.vercel.app) setelah versi terbaru di-deploy.
            Halaman admin dan bot tidak ikut dihitung.
          </p>
        )}
      </section>

      <div className="admin-columns admin-stagger">
        <section className="admin-card">
          <h2>Stok menipis <small>≤ {d.threshold} · <Link href="/admin/produk?status=menipis" className="admin-link">Kelola <ArrowRight aria-hidden="true" /></Link></small></h2>
          {d.lowStock.length ? (
            <ul className="admin-list">
              {d.lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/produk/${p.id}`}><Package aria-hidden="true" className="admin-list-icon" /> {p.name}</Link>
                  <span className={`admin-status is-${p.stock <= 0 ? "habis" : "menipis"}`}>{p.stock <= 0 ? "Habis" : `Sisa ${p.stock}`}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-muted">Semua stok aman.</p>
          )}
          {d.lowStock.some((p) => p.stock <= 0) ? <p className="admin-hint is-error"><AlertTriangle aria-hidden="true" /> Ada produk yang habis, segera restock.</p> : null}
        </section>
        <section className="admin-card">
          <h2>Transaksi terbaru <Link href="/admin/transaksi" className="admin-link">Semua <ArrowRight aria-hidden="true" /></Link></h2>
          {d.recent.length ? (
            <ul className="admin-list">
              {d.recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/transaksi/${o.id}`}>
                    {o.customerName}
                    <small className="admin-muted"> · {formatDate(o.createdAt)} · {o._count.items} item</small>
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

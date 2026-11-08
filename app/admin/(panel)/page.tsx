import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, ChevronRight, Clock3, Eye, FileText, FolderKanban, Home, Info, Layers, Link2, Mail, MousePointerClick, Package, Plus, ReceiptText, ShoppingBag, Smartphone, TrendingDown, TrendingUp, Users, Wallet, Wrench } from "lucide-react"
import { requireAdmin } from "@/lib/auth/session"
import { formatDate, rupiah } from "@/lib/admin/format"
import { dashboardData } from "@/lib/admin/dashboard"
import { monthLabel } from "@/lib/admin/period"
import { StatusBadge } from "@/components/admin/status-badge"
import { CountUp } from "@/components/admin/count-up"
import { PeriodPicker } from "@/components/admin/period-picker"
import { SalesChart } from "@/components/admin/charts/sales-chart"
import { Donut } from "@/components/admin/charts/donut"
import { ShareBar } from "@/components/admin/charts/share-bar"
import { RankList } from "@/components/admin/charts/rank-list"
import { Sparkline } from "@/components/admin/charts/sparkline"
import { RestockButton } from "@/components/admin/restock-button"
import { adjustStock } from "./produk/actions"

export const metadata: Metadata = { title: "Dashboard" }

const num = (n: number) => n.toLocaleString("id-ID")
const pcs = (n: number) => `${num(n)} pcs`
const PAGE_ICON: Record<string, typeof Home> = { "/": Home, "/about": Info, "/services": Wrench, "/products": Package, "/projects": FolderKanban, "/contact": Mail }
const SOURCE_COLORS = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"]

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
      sub: `${num(kpi.visitors.views)} halaman dibuka`,
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

      <div className="admin-columns is-even admin-stagger">
        <section className="admin-card is-fill">
          <h2>Komponen terlaris <small>10 besar · {period.label}</small></h2>
          <RankList
            rows={d.topQty}
            mode="qty"
            tone="gold"
            summary={`Total ${num(d.rankTotals.qty)} pcs dari ${d.rankTotals.components} komponen. Arahkan kursor ke baris untuk melihat rincian.`}
            empty="Belum ada komponen terjual di periode ini."
          />
        </section>
        <section className="admin-card is-fill">
          <h2>Pendapatan per item <small>10 besar · {period.label}</small></h2>
          <RankList
            rows={d.topRevenue}
            mode="revenue"
            tone="green"
            summary={`Total ${rupiah(d.rankTotals.revenue)} dari ${d.rankTotals.items} item (komponen & jasa). Arahkan kursor ke baris untuk melihat rincian.`}
            empty="Belum ada pendapatan di periode ini."
          />
        </section>
      </div>

      <div className="admin-columns is-three is-even admin-stagger">
        <section className="admin-card is-fill is-center">
          <h2>Pendapatan per kategori</h2>
          <Donut data={d.categories} centerLabel="Total" />
        </section>
        <section className="admin-card is-fill admin-mix-card">
          <div>
            <h2>Komponen vs jasa</h2>
            <ShareBar parts={d.mix} colors={["#3987e5", "#9085e9"]} />
          </div>
          <div>
            <h2>Metode pembayaran</h2>
            <ShareBar parts={d.payments} colors={["#199e70", "#3987e5", "#c98500", "#d55181"]} />
          </div>
        </section>
        <section className="admin-card is-fill">
          <h2>Pembeli teratas <small>5 besar · {period.label}</small></h2>
          <RankList
            rows={d.buyers}
            mode="buyer"
            tone="blue"
            slots={5}
            summary={`${d.buyerCount} pembeli di periode ini. Arahkan kursor untuk melihat rincian.`}
            empty="Belum ada pembeli di periode ini."
          />
        </section>
      </div>

      <section className="admin-card admin-visitors">
        <div className="admin-section-head">
          <div>
            <h2>Pengunjung web</h2>
            <p>Kunjungan ke situs publik microim.vercel.app · {period.label}</p>
          </div>
          <Delta value={kpi.visitors.change} label={cmp} />
        </div>
        {d.visitors.views ? (
          <div className="admin-visitors-grid">
            <div className="admin-visitors-main">
              <div className="admin-visitors-hero">
                <span><Users aria-hidden="true" /> Pengunjung unik</span>
                <strong><CountUp value={kpi.visitors.value} /></strong>
                <small>orang berbeda yang membuka situs</small>
              </div>
              <Sparkline points={d.points.map((p) => ({ key: p.key, value: p.visitors }))} />
              <div className="admin-visitors-mini">
                <div><MousePointerClick aria-hidden="true" /><b>{num(d.visitors.views)}</b><span>halaman dibuka</span></div>
                <div><Layers aria-hidden="true" /><b>{kpi.visitors.value ? (d.visitors.views / kpi.visitors.value).toLocaleString("id-ID", { maximumFractionDigits: 1 }) : 0}</b><span>halaman / orang</span></div>
                <div><Smartphone aria-hidden="true" /><b>{Math.round(d.visitors.mobileShare)}%</b><span>dari HP</span></div>
              </div>
            </div>

            <div className="admin-visitors-col">
              <h3>Halaman terpopuler</h3>
              <ol className="admin-pages">
                {d.visitors.topPages.map((p, i) => {
                  const Icon = PAGE_ICON[p.sub] ?? FileText
                  return (
                    <li key={p.sub} style={{ "--w": `${Math.max(4, p.share)}%`, "--d": `${i * 70}ms` } as React.CSSProperties}>
                      <span className="admin-pages-icon"><Icon aria-hidden="true" /></span>
                      <span className="admin-pages-name">{p.name}<code>{p.sub}</code></span>
                      <span className="admin-pages-val"><b>{num(p.value)}</b> orang</span>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="admin-visitors-col">
              <h3>Sumber kunjungan</h3>
              <ul className="admin-sources">
                {d.visitors.referrers.map((r, i) => (
                  <li key={r.name}>
                    <span className="admin-sources-badge" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}>
                      {r.name.startsWith("Langsung") ? <Link2 aria-hidden="true" /> : r.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="admin-sources-name">{r.name.startsWith("Langsung") ? "Langsung / tautan" : r.name}</span>
                    <span className="admin-sources-val">{Math.round(r.share)}%</span>
                    <span className="admin-sources-bar"><span style={{ width: `${r.share}%`, background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} /></span>
                  </li>
                ))}
              </ul>
              <h3 className="admin-devices-title">Perangkat</h3>
              <ShareBar parts={d.visitors.devices} unit="kunjungan" colors={["#3987e5", "#22d3ee"]} />
            </div>
          </div>
        ) : (
          <div className="admin-visitors-empty">
            <Eye aria-hidden="true" />
            <strong>Belum ada kunjungan di periode ini</strong>
            <p>Pencatatan aktif di situs live. Halaman admin dan bot tidak ikut dihitung.</p>
          </div>
        )}
      </section>

      <div className="admin-columns is-even admin-stagger">
        <section className="admin-card is-fill">
          <div className="admin-section-head">
            <div>
              <h2>Stok menipis</h2>
              <p>Batas menipis ≤ {d.threshold}</p>
            </div>
            <div className="admin-stock-pills">
              {d.lowCounts.habis ? <span className="is-habis">{d.lowCounts.habis} habis</span> : null}
              {d.lowCounts.menipis ? <span className="is-menipis">{d.lowCounts.menipis} menipis</span> : null}
            </div>
          </div>
          {d.lowStock.length ? (
            <ul className="admin-lowstock">
              {d.lowStock.map((p) => (
                <li key={p.id} className={p.stock <= 0 ? "is-habis" : "is-menipis"}>
                  <span className="admin-lowstock-thumb">
                    {p.imageUrl ? <Image src={p.imageUrl} alt="" width={36} height={36} /> : <Package aria-hidden="true" />}
                  </span>
                  <Link href={`/admin/produk/${p.id}`} className="admin-lowstock-name">
                    {p.name}
                    <small>{p.stock <= 0 ? "Stok habis" : `Sisa ${p.stock} pcs`}</small>
                  </Link>
                  <span className={`admin-status is-${p.stock <= 0 ? "habis" : "menipis"}`}>{p.stock <= 0 ? "Habis" : "Menipis"}</span>
                  <div className="admin-row-actions">
                    <RestockButton action={adjustStock.bind(null, p.id)} name={p.name} stock={p.stock} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="admin-allgood"><CheckCircle2 aria-hidden="true" /> Semua stok aman.</div>
          )}
          <Link href="/admin/produk?status=habis" className="admin-card-foot">
            Kelola semua stok <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section className="admin-card is-fill">
          <div className="admin-section-head">
            <div>
              <h2>Transaksi terbaru</h2>
              <p>6 transaksi terakhir</p>
            </div>
          </div>
          {d.recent.length ? (
            <ul className="admin-recent">
              {d.recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/transaksi/${o.id}`}>
                    <span className="admin-recent-avatar" aria-hidden="true">{o.customerName.charAt(0).toUpperCase()}</span>
                    <span className="admin-recent-who">
                      <strong>{o.customerName}</strong>
                      <small>{formatDate(o.createdAt)} · {o._count.items} item · {o.orderNumber}</small>
                    </span>
                    <StatusBadge status={o.status} />
                    <span className="admin-recent-total">{rupiah(o.totalAmount)}</span>
                    <ChevronRight aria-hidden="true" className="admin-recent-go" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-muted">Belum ada transaksi.</p>
          )}
          <Link href="/admin/transaksi" className="admin-card-foot">
            Lihat semua transaksi <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { CalendarDays, Crown, Sigma, TrendingDown, TrendingUp } from "lucide-react"
import { count, niceTicks, rp, rpShort } from "./format"

type Point = { key: string; revenue: number; profit: number; orders: number; visitors: number }
type Metric = "revenue" | "profit" | "orders" | "visitors"
type Gran = "day" | "week" | "month"
type Bucket = Point & { label: string; long: string }

const METRICS: { key: Metric; label: string; money: boolean; color: string; dark: string }[] = [
  { key: "revenue", label: "Pendapatan", money: true, color: "#ffc928", dark: "#b7860a" },
  { key: "profit", label: "Laba", money: true, color: "#34d399", dark: "#0f8a62" },
  { key: "orders", label: "Transaksi", money: false, color: "#60a5fa", dark: "#2563eb" },
  { key: "visitors", label: "Pengunjung", money: false, color: "#a78bfa", dark: "#6d4fd8" },
]
const GRANS: { key: Gran; label: string }[] = [
  { key: "day", label: "Harian" },
  { key: "week", label: "Mingguan" },
  { key: "month", label: "Bulanan" },
]

const H = 280
const PAD = { top: 34, right: 16, bottom: 34, left: 66 }
const DAY = 86_400_000

const fmtDay = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" })
const fmtDayLong = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
const fmtMon = new Intl.DateTimeFormat("id-ID", { month: "short", year: "2-digit", timeZone: "UTC" })
const fmtMonLong = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" })
const utc = (key: string) => new Date(`${key.length === 7 ? `${key}-01` : key}T00:00:00Z`)

/** Kelompokkan data harian menjadi mingguan (Senin–Minggu) atau bulanan. */
function aggregate(points: Point[], gran: Gran): Bucket[] {
  const monthly = points[0]?.key.length === 7
  if (gran === "day" || monthly) {
    return points.map((p) => {
      const d = utc(p.key)
      return monthly ? { ...p, label: fmtMon.format(d), long: fmtMonLong.format(d) } : { ...p, label: fmtDay.format(d), long: fmtDayLong.format(d) }
    })
  }
  const map = new Map<string, Bucket>()
  for (const p of points) {
    const d = utc(p.key)
    let key: string
    let label: string
    let long: string
    if (gran === "week") {
      const start = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY)
      const end = new Date(start.getTime() + 6 * DAY)
      key = start.toISOString().slice(0, 10)
      label = fmtDay.format(start)
      long = `${fmtDay.format(start)} – ${fmtDay.format(end)} ${end.getUTCFullYear()}`
    } else {
      key = p.key.slice(0, 7)
      label = fmtMon.format(d)
      long = fmtMonLong.format(d)
    }
    const b = map.get(key) ?? { key, label, long, revenue: 0, profit: 0, orders: 0, visitors: 0 }
    b.revenue += p.revenue
    b.profit += p.profit
    b.orders += p.orders
    b.visitors += p.visitors
    map.set(key, b)
  }
  return [...map.values()]
}

/** Grafik penjualan: satu ukuran per tampilan (tanpa dua sumbu), bisa harian/mingguan/bulanan. */
export function SalesChart({
  points,
  totals,
  changes,
  compareLabel,
}: {
  points: Point[]
  totals: Record<Metric, number>
  changes: Record<Metric, number | null>
  compareLabel: string | null
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(720)
  const [metric, setMetric] = useState<Metric>("revenue")
  const monthly = points[0]?.key.length === 7
  // Data jarang (banyak hari kosong) lebih enak dibaca per minggu.
  const [gran, setGran] = useState<Gran>(() => {
    if (monthly) return "month"
    const active = points.filter((p) => p.revenue > 0).length
    return points.length > 21 && active / Math.max(points.length, 1) < 0.4 ? "week" : "day"
  })
  const [hover, setHover] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const m = METRICS.find((x) => x.key === metric)!

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(300, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const buckets = useMemo(() => aggregate(points, gran), [points, gran])
  const values = buckets.map((b) => b[metric])
  const n = Math.max(buckets.length, 1)
  const { top, ticks } = niceTicks(Math.max(...values, 0) * 1.08)
  const innerW = width - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const slot = innerW / n
  const barW = Math.max(4, Math.min(gran === "day" ? 28 : 110, slot * (gran === "day" ? 0.62 : 0.56)))
  const xAt = (i: number) => PAD.left + slot * i + slot / 2
  const yAt = (v: number) => PAD.top + innerH - (v / (top || 1)) * innerH
  const base = yAt(0)
  const fmtAxis = (v: number) => (m.money ? rpShort(v) : count(v))
  const fmtVal = (v: number) => (m.money ? rp(v) : count(v))

  const total = values.reduce((s, v) => s + v, 0)
  const avg = total / n
  const peakIdx = values.reduce((best, v, i) => (v > values[best] ? i : best), 0)
  const activeCount = values.filter((v) => v > 0).length
  const unit = gran === "day" ? "hari" : gran === "week" ? "minggu" : "bulan"
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 70))))
  const ch = changes[metric]
  const hb = hover !== null ? buckets[hover] : null

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setHover(Math.max(0, Math.min(n - 1, Math.floor((e.clientX - rect.left) / (rect.width / n)))))
  }

  return (
    <div className="admin-chart-card">
      <div className="admin-chart-head">
        <div className="admin-chart-controls">
          <div className="admin-chart-tabs" role="tablist" aria-label="Ukuran grafik">
            {METRICS.map((x) => (
              <button key={x.key} type="button" role="tab" aria-selected={metric === x.key} className={metric === x.key ? "is-active" : undefined} onClick={() => setMetric(x.key)}>
                {metric === x.key ? <motion.span layoutId="chart-tab" className="admin-chart-tab-pill" style={{ background: `${x.color}22`, boxShadow: `inset 0 0 0 1px ${x.color}55` }} transition={{ type: "spring", stiffness: 500, damping: 38 }} /> : null}
                <i style={{ background: x.color }} aria-hidden="true" />
                <span>{x.label}</span>
              </button>
            ))}
          </div>
          {!monthly ? (
            <div className="admin-chart-gran" role="tablist" aria-label="Pengelompokan waktu">
              {GRANS.map((g) => (
                <button key={g.key} type="button" role="tab" aria-selected={gran === g.key} className={gran === g.key ? "is-active" : undefined} onClick={() => { setGran(g.key); setHover(null) }}>
                  {g.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="admin-chart-total">
          <strong style={{ color: m.color }}>{fmtVal(totals[metric])}</strong>
          {ch !== null ? (
            <span className={`admin-delta ${ch >= 0 ? "is-up" : "is-down"}`} title={compareLabel ?? undefined}>
              {ch >= 0 ? <TrendingUp aria-hidden="true" /> : <TrendingDown aria-hidden="true" />}
              {ch > 0 ? "+" : ""}{ch.toLocaleString("id-ID")}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="admin-chart-facts">
        <span><Sigma aria-hidden="true" /> Rata-rata <b>{fmtVal(avg)}</b> / {unit}</span>
        {values[peakIdx] > 0 ? (
          <span><Crown aria-hidden="true" /> Tertinggi <b>{fmtVal(values[peakIdx])}</b> · {buckets[peakIdx].long}</span>
        ) : null}
        <span><CalendarDays aria-hidden="true" /> <b>{activeCount}</b> dari {n} {unit} ada {metric === "visitors" ? "kunjungan" : "penjualan"}</span>
      </div>

      <div ref={wrap} className="admin-chart-plot">
        <svg width={width} height={H} role="img" aria-label={`Grafik ${m.label.toLowerCase()} per ${unit}, total ${fmtVal(total)}`}>
          <defs>
            <linearGradient id={`bar-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={m.color} />
              <stop offset="100%" stopColor={m.dark} />
            </linearGradient>
            <linearGradient id={`bar-${metric}-hi`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="35%" stopColor={m.color} />
              <stop offset="100%" stopColor={m.color} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={yAt(t)} y2={yAt(t)} className={t === 0 ? "admin-base-line" : "admin-grid-line"} />
              <text x={PAD.left - 12} y={yAt(t)} className="admin-axis-text" textAnchor="end" dominantBaseline="middle">{fmtAxis(t)}</text>
            </g>
          ))}


          {/* Sorotan kolom hanya untuk periode tanpa batang, supaya tetap jelas periode mana yang ditunjuk. */}
          {hover !== null && values[hover] <= 0 ? (
            <rect x={xAt(hover) - slot / 2 + 1} y={PAD.top - 10} width={Math.max(0, slot - 2)} height={innerH + 10} rx={8} className="admin-hover-band" />
          ) : null}

          <g key={`${metric}-${gran}`}>
            {values.map((v, i) => {
              const h = Math.max(0, base - yAt(v))
              const x = xAt(i) - barW / 2
              const r = Math.min(6, barW / 2)
              if (v <= 0) return <rect key={buckets[i].key} x={xAt(i) - 2} y={base - 3} width={4} height={3} rx={1.5} className="admin-ghost-bar" />
              return (
                <motion.path
                  key={buckets[i].key}
                  d={`M${x},${base} V${base - h + r} Q${x},${base - h} ${x + r},${base - h} H${x + barW - r} Q${x + barW},${base - h} ${x + barW},${base - h + r} V${base} Z`}
                  // Ukuran batang tidak pernah berubah saat disorot: hanya warnanya yang lebih terang.
                  fill={hover === i ? `url(#bar-${metric}-hi)` : `url(#bar-${metric})`}
                  style={{ transformOrigin: `${xAt(i)}px ${base}px`, transformBox: "view-box" }}
                  initial={reduce ? false : { scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: hover === null || hover === i ? 1 : 0.6 }}
                  transition={{ scaleY: { duration: 0.7, delay: reduce ? 0 : i * 0.02, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                />
              )
            })}
          </g>

          {avg > 0 ? (
            <g pointerEvents="none">
              <line x1={PAD.left} x2={width - PAD.right} y1={yAt(avg)} y2={yAt(avg)} className="admin-avg-line" style={{ stroke: m.color }} />
              <text x={width - PAD.right} y={yAt(avg) - 6} textAnchor="end" className="admin-avg-text" style={{ fill: m.color }}>rata-rata</text>
            </g>
          ) : null}

          {values[peakIdx] > 0 && hover === null ? (
            <g pointerEvents="none">
              <text x={xAt(peakIdx)} y={yAt(values[peakIdx]) - 10} textAnchor="middle" className="admin-peak-text">{fmtAxis(values[peakIdx])}</text>
            </g>
          ) : null}

          {buckets.map((b, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text key={b.key} x={xAt(i)} y={H - 10} className={`admin-axis-text${hover === i ? " is-hover" : ""}`} textAnchor="middle">{b.label}</text>
            ) : null,
          )}

          <rect x={PAD.left} y={PAD.top - 10} width={innerW} height={innerH + 10} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
        </svg>

        {hb ? (
          <div className="admin-chart-tip-box" style={{ left: Math.min(Math.max(xAt(hover!), 100), width - 100), top: Math.max(0, yAt(hb[metric]) - 86) }}>
            <span>{hb.long}</span>
            <strong style={{ color: m.color }}>{fmtVal(hb[metric])}</strong>
            <small>
              {hb.orders} transaksi · {rp(hb.revenue)}
              {metric === "revenue" && hb.revenue ? ` · laba ${rp(hb.profit)}` : ""}
            </small>
            {avg > 0 ? (
              <em className={hb[metric] >= avg ? "is-up" : "is-down"}>
                {hb[metric] >= avg ? "▲" : "▼"} {Math.abs(Math.round(((hb[metric] - avg) / avg) * 100))}% vs rata-rata
              </em>
            ) : null}
          </div>
        ) : null}
      </div>

      <details className="admin-chart-table">
        <summary>Lihat sebagai tabel</summary>
        <table className="admin-table is-compact">
          <thead><tr><th>Periode</th><th className="is-num">Pendapatan</th><th className="is-num">Laba</th><th className="is-num">Transaksi</th><th className="is-num">Pengunjung</th></tr></thead>
          <tbody>
            {buckets.filter((b) => b.revenue || b.orders || b.visitors).map((b) => (
              <tr key={b.key}><td>{b.long}</td><td className="is-num">{rp(b.revenue)}</td><td className="is-num">{rp(b.profit)}</td><td className="is-num">{b.orders}</td><td className="is-num">{b.visitors}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}

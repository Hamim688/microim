"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { bucketLabel, count, niceTicks, rp, rpShort } from "./format"

type Point = { key: string; revenue: number; profit: number; orders: number; visitors: number }
type Metric = "revenue" | "profit" | "orders" | "visitors"

const METRICS: { key: Metric; label: string; money: boolean; color: string }[] = [
  { key: "revenue", label: "Pendapatan", money: true, color: "#ffc928" },
  { key: "profit", label: "Laba", money: true, color: "#34d399" },
  { key: "orders", label: "Transaksi", money: false, color: "#60a5fa" },
  { key: "visitors", label: "Pengunjung", money: false, color: "#a78bfa" },
]

const H = 260
const PAD = { top: 16, right: 12, bottom: 30, left: 64 }

/** Grafik penjualan per tanggal/bulan. Satu ukuran ditampilkan sekaligus (tanpa dua sumbu); ganti lewat tab. */
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
  const [hover, setHover] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const m = METRICS.find((x) => x.key === metric)!

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const values = points.map((p) => p[metric])
  const minV = Math.min(0, ...values)
  const { top, ticks } = niceTicks(Math.max(...values, 0))
  const innerW = width - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const n = Math.max(points.length, 1)
  const asBars = n <= 62
  const slot = innerW / n
  const xAt = (i: number) => PAD.left + (asBars ? slot * i + slot / 2 : n === 1 ? innerW / 2 : (innerW * i) / (n - 1))
  const range = top - Math.min(0, minV)
  const yAt = (v: number) => PAD.top + innerH - ((v - Math.min(0, minV)) / (range || 1)) * innerH
  const zeroY = yAt(0)

  const line = values.map((v, i) => `${i ? "L" : "M"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ")
  const area = `${line} L${xAt(n - 1).toFixed(1)},${zeroY} L${xAt(0).toFixed(1)},${zeroY} Z`
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 64))))
  const fmtAxis = (v: number) => (m.money ? rpShort(v) : count(v))
  const fmtVal = (v: number) => (m.money ? rp(v) : count(v))
  const barW = Math.max(3, Math.min(28, slot - Math.max(2, slot * 0.28)))
  const ch = changes[metric]

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const i = asBars ? Math.floor(x / slot) : Math.round((x / innerW) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, i)))
  }

  const hp = hover !== null ? points[hover] : null
  const tipLeft = hover !== null ? Math.min(Math.max(xAt(hover), 90), width - 90) : 0

  return (
    <div className="admin-chart-card">
      <div className="admin-chart-head">
        <div className="admin-chart-tabs" role="tablist" aria-label="Ukuran grafik">
          {METRICS.map((x) => (
            <button key={x.key} type="button" role="tab" aria-selected={metric === x.key} className={metric === x.key ? "is-active" : undefined} onClick={() => setMetric(x.key)}>
              {metric === x.key ? <motion.span layoutId="chart-tab" className="admin-chart-tab-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} /> : null}
              <span>{x.label}</span>
            </button>
          ))}
        </div>
        <div className="admin-chart-total">
          <strong>{fmtVal(totals[metric])}</strong>
          {ch !== null ? (
            <span className={`admin-delta ${ch >= 0 ? "is-up" : "is-down"}`} title={compareLabel ?? undefined}>
              {ch >= 0 ? <TrendingUp aria-hidden="true" /> : <TrendingDown aria-hidden="true" />}
              {ch > 0 ? "+" : ""}{ch.toLocaleString("id-ID")}%
            </span>
          ) : null}
          {compareLabel && ch !== null ? <small>{compareLabel}</small> : null}
        </div>
      </div>

      <div ref={wrap} className="admin-chart-plot">
        <svg width={width} height={H} role="img" aria-label={`Grafik ${m.label.toLowerCase()} per ${points[0]?.key.length === 7 ? "bulan" : "tanggal"}`}>
          <defs>
            <linearGradient id={`fill-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={m.color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={m.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={yAt(t)} y2={yAt(t)} className="admin-grid-line" />
              <text x={PAD.left - 10} y={yAt(t)} className="admin-axis-text" textAnchor="end" dominantBaseline="middle">{fmtAxis(t)}</text>
            </g>
          ))}
          {points.map((p, i) =>
            i % labelEvery === 0 || i === n - 1 ? (
              <text key={p.key} x={xAt(i)} y={H - 8} className="admin-axis-text" textAnchor={i === 0 && !asBars ? "start" : i === n - 1 && !asBars ? "end" : "middle"}>
                {bucketLabel(p.key)}
              </text>
            ) : null,
          )}

          {asBars ? (
            <g key={`bars-${metric}`}>
              {values.map((v, i) => {
                const y = Math.min(yAt(v), zeroY)
                const h = Math.max(v === 0 ? 0 : 2, Math.abs(zeroY - yAt(v)))
                return (
                  <motion.rect
                    key={points[i].key}
                    x={xAt(i) - barW / 2}
                    width={barW}
                    rx={Math.min(4, barW / 2)}
                    initial={reduce ? false : { y: zeroY, height: 0 }}
                    animate={{ y, height: h }}
                    transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.015, ease: [0.22, 1, 0.36, 1] }}
                    fill={m.color}
                    opacity={hover === null || hover === i ? 1 : 0.45}
                  />
                )
              })}
            </g>
          ) : (
            <g key={`line-${metric}`}>
              <motion.path d={area} fill={`url(#fill-${metric})`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
              <motion.path
                d={line}
                fill="none"
                stroke={m.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          )}

          {hover !== null ? (
            <g pointerEvents="none">
              <line x1={xAt(hover)} x2={xAt(hover)} y1={PAD.top} y2={zeroY} className="admin-crosshair" />
              {!asBars ? <circle cx={xAt(hover)} cy={yAt(values[hover])} r={5} fill={m.color} stroke="#0c1c33" strokeWidth={2} /> : null}
            </g>
          ) : null}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={innerW}
            height={innerH}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
        {hp ? (
          <div className="admin-chart-tip-box" style={{ left: tipLeft }}>
            <span>{bucketLabel(hp.key, true)}</span>
            <strong>{fmtVal(hp[metric])}</strong>
            <small>
              {metric !== "orders" ? `${hp.orders} transaksi` : rp(hp.revenue)}
              {metric === "revenue" && hp.revenue ? ` · laba ${rp(hp.profit)}` : ""}
            </small>
          </div>
        ) : null}
      </div>

      <details className="admin-chart-table">
        <summary>Lihat sebagai tabel</summary>
        <table className="admin-table is-compact">
          <thead><tr><th>Tanggal</th><th className="is-num">Pendapatan</th><th className="is-num">Laba</th><th className="is-num">Transaksi</th><th className="is-num">Pengunjung</th></tr></thead>
          <tbody>
            {points.filter((p) => p.revenue || p.orders || p.visitors).map((p) => (
              <tr key={p.key}><td>{bucketLabel(p.key, true)}</td><td className="is-num">{rp(p.revenue)}</td><td className="is-num">{rp(p.profit)}</td><td className="is-num">{p.orders}</td><td className="is-num">{p.visitors}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { bucketLabel } from "./format"

/** Grafik kecil (area) untuk tren pengunjung, dengan keterangan saat disorot. */
export function Sparkline({ points, color = "#22d3ee", unit = "pengunjung" }: { points: { key: string; value: number }[]; color?: string; unit?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(300)
  const [hover, setHover] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const H = 84
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(160, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const n = points.length
  if (!n) return null
  const max = Math.max(1, ...points.map((p) => p.value))
  const x = (i: number) => (n === 1 ? w / 2 : (i / (n - 1)) * (w - 4) + 2)
  const y = (v: number) => H - 6 - (v / max) * (H - 16)
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ")
  const area = `${line} L${x(n - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`
  const hp = hover !== null ? points[hover] : null

  return (
    <div ref={wrap} className="admin-spark">
      <svg width={w} height={H} role="img" aria-label={`Tren ${unit}`}>
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} fill="url(#spark-fill)" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
        <motion.path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        {hover !== null ? (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={4} y2={H} stroke="rgba(255,255,255,.25)" strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(points[hover].value)} r={4.5} fill={color} stroke="#0c1c33" strokeWidth={2} />
          </g>
        ) : null}
        <rect
          width={w}
          height={H}
          fill="transparent"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            setHover(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1)))))
          }}
          onPointerLeave={() => setHover(null)}
        />
      </svg>
      {hp ? (
        <div className="admin-spark-tip" style={{ left: Math.min(Math.max(x(hover!), 60), w - 60) }}>
          <b>{hp.value.toLocaleString("id-ID")}</b> {unit}
          <span>{bucketLabel(hp.key, true)}</span>
        </div>
      ) : null}
    </div>
  )
}

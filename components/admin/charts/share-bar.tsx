"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { pct } from "./format"

type Part = { name: string; value: number; share: number }

/** Batang 100% bertumpuk yang interaktif: sorot bagian/legenda untuk menonjolkan porsinya. */
export function ShareBar({ parts, colors, unit = "rupiah" }: { parts: Part[]; colors: string[]; unit?: "rupiah" | "kunjungan" }) {
  const [hover, setHover] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const total = parts.reduce((s, p) => s + p.value, 0)
  if (!total) return <p className="admin-muted">Belum ada data.</p>
  const fmt = (n: number) =>
    unit === "rupiah" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n) : `${n.toLocaleString("id-ID")} kunjungan`

  return (
    <div className="admin-sharebar" onPointerLeave={() => setHover(null)}>
      <div className="admin-sharebar-track" role="img" aria-label={parts.map((p) => `${p.name} ${pct(p.share)}`).join(", ")}>
        {parts.map((p, i) =>
          p.value > 0 ? (
            <motion.span
              key={p.name}
              style={{ background: colors[i % colors.length] }}
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${p.share}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: reduce ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={hover !== null && hover !== i ? "is-dim" : undefined}
              onPointerEnter={() => setHover(i)}
            />
          ) : null,
        )}
      </div>
      <ul className="admin-legend is-inline">
        {parts.map((p, i) => (
          <li key={p.name} className={hover === i ? "is-hover" : hover !== null ? "is-dim" : undefined} onPointerEnter={() => setHover(i)}>
            <i style={{ background: colors[i % colors.length] }} aria-hidden="true" />
            <span>{p.name}</span>
            <b>{pct(p.share)}</b>
            <small>{fmt(p.value)}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { CATEGORICAL, OTHER, pct, rp } from "./format"

type Slice = { name: string; value: number; share: number }

/** Donat komposisi pendapatan (maks. 6 bagian; sisanya "Lainnya"). Legenda selalu tampil dengan persentase. */
export function Donut({ data, centerLabel }: { data: Slice[]; centerLabel: string }) {
  const [hoverRaw, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  // Klik legenda/irisan untuk "mengunci" sorotan; arahkan kursor untuk melihat sekilas.
  const hover = hoverRaw ?? pinned
  const reduce = useReducedMotion()
  const total = data.reduce((s, d) => s + d.value, 0)
  const R = 70
  const C = 2 * Math.PI * R
  const gap = data.length > 1 ? 3 : 0
  const color = (d: Slice, i: number) => (d.name === "Lainnya" ? OTHER : CATEGORICAL[i % CATEGORICAL.length])
  const active = hover !== null ? data[hover] : null
  let offset = 0

  if (!total) return <p className="admin-muted">Belum ada pendapatan di periode ini.</p>

  return (
    <div className="admin-donut">
      <div className="admin-donut-figure">
        <svg viewBox="0 0 180 180" role="img" aria-label={`Komposisi ${centerLabel.toLowerCase()}`}>
          <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(140,180,240,.08)" strokeWidth="22" />
          {data.map((d, i) => {
            const len = (d.value / total) * C
            const dash = Math.max(0, len - gap)
            const el = (
              <motion.circle
                key={d.name}
                cx="90"
                cy="90"
                r={R}
                fill="none"
                stroke={color(d, i)}
                strokeWidth={hover === i ? 26 : 22}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 90 90)"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: hover === null || hover === i ? 1 : 0.35 }}
                transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.06 }}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onClick={() => setPinned((p) => (p === i ? null : i))}
                style={{ cursor: "pointer", transition: "stroke-width .2s" }}
              />
            )
            offset += len
            return el
          })}
        </svg>
        <div className="admin-donut-center">
          <span>{active ? active.name : centerLabel}</span>
          <strong>{active ? pct(active.share) : rp(total)}</strong>
          {active ? <small>{rp(active.value)}</small> : null}
        </div>
      </div>
      <ul className="admin-legend">
        {data.map((d, i) => (
          <li
            key={d.name}
            tabIndex={0}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={() => setPinned((p) => (p === i ? null : i))}
            className={hover === i ? "is-hover" : hover !== null ? "is-dim" : undefined}
          >
            <i style={{ background: color(d, i) }} aria-hidden="true" />
            <span>{d.name}</span>
            <b>{pct(d.share)}</b>
            <small>{rp(d.value)}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { Package, Receipt, TrendingUp, Wrench } from "lucide-react"
import { count, pct, rp } from "./format"

export type RankEntry = {
  key: string
  name: string
  image: string | null
  service: boolean
  value: number
  share: number
  qty: number
  revenue: number
  profit: number
  extra?: string
}

type Mode = "qty" | "revenue" | "buyer"


/**
 * Peringkat 10 besar yang interaktif: sorot/fokus satu baris untuk melihat rinciannya,
 * baris lain meredup. Batang tumbuh saat kartu terlihat di layar.
 */
export function RankList({
  rows: allRows,
  mode,
  tone,
  summary,
  empty,
  slots: SLOTS = 10,
}: {
  rows: RankEntry[]
  mode: Mode
  tone: "gold" | "green" | "blue"
  summary: string
  empty: string
  /** Jumlah baris yang selalu ditampilkan (slot kosong tampil samar). */
  slots?: number
}) {
  const [active, setActive] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const rows = allRows.slice(0, SLOTS)
  if (!rows.length) return <p className="admin-muted admin-rank-empty">{empty}</p>
  const max = Math.max(...rows.map((r) => r.value), 1)
  const fmt = (r: RankEntry) => (mode === "qty" ? `${count(r.value)} pcs` : rp(r.value))
  const a = active !== null ? rows[active] : null
  // Selalu 10 baris supaya kartu rapi & sejajar; slot yang belum terisi ditampilkan samar.
  const slots = Math.max(0, SLOTS - rows.length)

  return (
    <div className={`admin-rank is-${tone}`} onPointerLeave={() => setActive(null)}>
      <ol className="admin-rank-list">
        {rows.map((r, i) => (
          <li
            key={r.key}
            tabIndex={0}
            className={`${active === i ? "is-active" : ""}${active !== null && active !== i ? " is-dim" : ""}`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span className={`admin-rank-pos${i < 3 ? ` is-top${i + 1}` : ""}`}>{i + 1}</span>
            <span className="admin-rank-thumb" aria-hidden="true">
              {r.image ? (
                <Image src={r.image} alt="" width={32} height={32} />
              ) : mode === "buyer" ? (
                r.name.charAt(0).toUpperCase()
              ) : r.service ? (
                <Wrench />
              ) : (
                <Package />
              )}
            </span>
            <div className="admin-rank-body">
              <div className="admin-rank-top">
                <span className="admin-rank-name">
                  {r.name}
                  {r.service ? <em>jasa</em> : null}
                </span>
                <span className="admin-rank-value">{fmt(r)}</span>
              </div>
              <div className="admin-rank-track" aria-hidden="true">
                <motion.span
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, delay: reduce ? 0 : i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            <span className="admin-rank-pct">{pct(r.share)}</span>
          </li>
        ))}
        {Array.from({ length: slots }, (_, k) => (
          <li key={`kosong-${k}`} className="is-placeholder" aria-hidden="true">
            <span className="admin-rank-pos">{rows.length + k + 1}</span>
            <span className="admin-rank-thumb" />
            <div className="admin-rank-body">
              <div className="admin-rank-top"><span className="admin-rank-name">—</span></div>
              <div className="admin-rank-track" />
            </div>
            <span className="admin-rank-pct" />
          </li>
        ))}
      </ol>

      <div className="admin-rank-detail" aria-live="polite">
        {a ? (
          <>
            <strong>{a.name}</strong>
            <div className="admin-rank-chips">
              {mode === "buyer" ? (
                <>
                  <span><Receipt aria-hidden="true" /> {a.extra}</span>
                  <span>{rp(a.revenue)}</span>
                </>
              ) : (
                <>
                  {!a.service ? <span><Package aria-hidden="true" /> {count(a.qty)} pcs</span> : null}
                  <span>{rp(a.revenue)}</span>
                  <span className="is-profit"><TrendingUp aria-hidden="true" /> laba {rp(a.profit)}</span>
                </>
              )}
              <span className="is-share">{pct(a.share)} dari total</span>
            </div>
          </>
        ) : (
          <span className="admin-rank-hint">{summary}</span>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"

export type StatusTab = { key: string; href: string; label: string; count: number; tone?: string }

/**
 * Tab status dalam kapsul kaca dengan pil emas yang meluncur ke tab terpilih (seketika saat diklik, tidak menunggu
 * halaman selesai dimuat). Dipakai di Transaksi, Produk & Stok, dan Ulasan.
 */
export function StatusTabs({ id, label, tabs, active }: { id: string; label: string; tabs: StatusTab[]; active: string }) {
  const [current, setCurrent] = useState(active)
  const [seen, setSeen] = useState(active)
  if (seen !== active) {
    setSeen(active)
    setCurrent(active)
  }
  return (
    <div className="admin-status-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => {
        const on = current === tab.key
        return (
          <Link
            key={tab.key}
            href={tab.href}
            scroll={false}
            role="tab"
            aria-selected={on}
            className={[tab.tone ? `is-${tab.tone}` : "", on ? "is-active" : ""].join(" ").trim() || undefined}
            onClick={() => setCurrent(tab.key)}
          >
            {on ? <motion.span layoutId={`status-pill-${id}`} className="admin-status-pill" transition={{ type: "spring", stiffness: 480, damping: 38 }} /> : null}
            {tab.tone ? <i aria-hidden="true" /> : null}
            <span>{tab.label}</span>
            <b>{tab.count}</b>
          </Link>
        )
      })}
    </div>
  )
}

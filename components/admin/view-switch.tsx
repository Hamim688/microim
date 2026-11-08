"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { List, Users } from "lucide-react"

type View = "pembeli" | "item"

/** Tombol Per pembeli / Per item dengan sorotan yang meluncur (langsung bergerak saat diklik). */
export function ViewSwitch({ view, hrefs }: { view: View; hrefs: Record<View, string> }) {
  const [active, setActive] = useState<View>(view)
  const [seen, setSeen] = useState(view)
  if (seen !== view) {
    setSeen(view)
    setActive(view)
  }
  const items: { key: View; label: string; icon: typeof Users }[] = [
    { key: "pembeli", label: "Per pembeli", icon: Users },
    { key: "item", label: "Per item", icon: List },
  ]
  return (
    <div className="admin-view-switch" role="tablist" aria-label="Tampilan">
      {items.map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          href={hrefs[key]}
          scroll={false}
          role="tab"
          aria-selected={active === key}
          className={active === key ? "is-active" : undefined}
          onClick={() => setActive(key)}
        >
          {active === key ? (
            <motion.span layoutId="admin-view-pill" className="admin-view-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
          ) : null}
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  )
}

/** Konten meluncur dari kanan saat pindah ke "Per item" dan dari kiri saat kembali ke "Per pembeli". */
export function ViewSlide({ view, children }: { view: View; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const dir = view === "item" ? 1 : -1
  return (
    <motion.div
      key={view}
      initial={reduce ? false : { opacity: 0, x: 36 * dir }}
      animate={{ opacity: 1, x: 0, transitionEnd: { transform: "none" } }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="admin-view-slide"
    >
      {children}
    </motion.div>
  )
}

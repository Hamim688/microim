"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { Select } from "./select"

const PERIODS = [
  { key: "7h", label: "7 hari" },
  { key: "30h", label: "30 hari" },
  { key: "bulan", label: "Bulan ini" },
  { key: "tahun", label: "Tahun ini" },
  { key: "semua", label: "Semua" },
]

/** Pilihan periode dashboard: tombol cepat + pilih bulan tertentu. */
export function PeriodPicker({ current, month, months }: { current: string; month?: string; months: { value: string; label: string }[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, start] = useTransition()
  const [active, setActive] = useState(month ? "" : current)
  const go = (qs: string) => start(() => router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false }))

  return (
    <div className="admin-period">
      <div className="admin-period-seg" role="tablist" aria-label="Periode">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={active === p.key}
            className={active === p.key ? "is-active" : undefined}
            onClick={() => {
              setActive(p.key)
              go(p.key === "semua" ? "" : `periode=${p.key}`)
            }}
          >
            {active === p.key ? <motion.span layoutId="period-pill" className="admin-period-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} /> : null}
            <span>{p.label}</span>
          </button>
        ))}
      </div>
      <Select
        label="Pilih bulan"
        className={`is-month${month ? " is-chosen" : ""}`}
        value={month ?? ""}
        onChange={(v) => {
          setActive(v ? "" : "semua")
          go(v ? `bulan=${v}` : "")
        }}
        options={[{ value: "", label: "Pilih bulan…" }, ...months]}
      />
      {pending ? <Loader2 aria-hidden="true" className="admin-spin admin-period-spin" /> : null}
    </div>
  )
}

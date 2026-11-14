"use client"

import { useSyncExternalStore, type MouseEvent } from "react"
import { motion } from "motion/react"

const spring = { type: "spring", stiffness: 420, damping: 34 } as const

/**
 * Pilihan bersegmen di dalam kapsul kaca (.glass-island): satu pil yang meluncur ke pilihan aktif.
 * `tone`: "gold" untuk saringan utama, "soft" (putih tembus pandang) untuk saringan kedua, supaya tidak ada dua
 * pil emas berdampingan. `id` harus unik per halaman (dipakai untuk animasi luncur pilnya).
 */
export function Segmented<T extends string>({ id, label, options, value, onChange, tone = "gold" }: {
  id: string
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  tone?: "gold" | "soft"
}) {
  return (
    <div className={`seg is-${tone}`} role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)}>
          {value === option ? <motion.span layoutId={`seg-${id}`} className="seg-pill" transition={spring} /> : null}
          <span>{option}</span>
        </button>
      ))}
    </div>
  )
}

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

/**
 * Menu lompat di dalam kapsul kaca: tautan ke bagian-bagian halaman (#id). Bagian yang sedang dituju alamat
 * halaman ditandai pil emas.
 * Klik tidak menambah riwayat browser (alamat diganti di tempat), supaya tombol "Kembali" tetap membawa pengunjung ke
 * halaman sebelumnya, bukan ke pilihan kapsul sebelumnya.
 */
export function AnchorIsland({ label, items }: { label: string; items: { id: string; label: string }[] }) {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "")
  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    window.history.replaceState(window.history.state, "", `#${id}`)
    // replaceState tidak memicu "hashchange", jadi dipicu sendiri supaya penanda bagian aktif ikut berpindah.
    window.dispatchEvent(new HashChangeEvent("hashchange"))
    document.getElementById(id)?.scrollIntoView()
  }
  return (
    <div className="island-wrap is-start">
      <nav className="glass-island" aria-label={label}>
        <div className="seg is-gold">
          {items.map((item) => {
            const active = hash === `#${item.id}`
            return (
              <a key={item.id} href={`#${item.id}`} aria-current={active ? "true" : undefined} onClick={(event) => jump(event, item.id)}>
                {active ? <motion.span layoutId="seg-anchor" className="seg-pill" transition={spring} /> : null}
                <span>{item.label}</span>
              </a>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

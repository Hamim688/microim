"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion, type Variants } from "motion/react"
import { useRevealOnScroll } from "@/components/landing/landing-motion"

const ease = [0.22, 1, 0.36, 1] as const

// Jalur tembaga: datang dari tepi kiri layar, berbelok 45° turun, lurus di tengah, lalu naik lagi sampai tepi kanan
// layar. viewBox 1000×60 selebar kontainer; jalurnya diperpanjang `ext` satuan ke kiri dan kanan supaya menutup
// jarak antara kontainer dan tepi layar (lihat pengukuran di bawah). Tinggi tidak diskalakan, jadi garis lurus tetap
// tipis; tanpa "non-scaling-stroke" supaya animasi penggambaran (pathLength) selalu sampai ujung.
const tracePath = (ext: number) => `M${-ext} 14 H300 L340 46 H660 L700 14 H${1000 + ext}`
const DIAGONAL = Math.hypot(40, 32)

// Bantalan solder di setiap belokan + satu via di tengah (posisi dalam % lebar, y dalam viewBox).
// `along`: jarak bantalan dari awal jalur di dalam kontainer (satuan viewBox), untuk menghitung kapan kilau lewat.
const PADS = [
  { x: 30, y: 14, along: 300 },
  { x: 34, y: 46, along: 300 + DIAGONAL },
  { x: 50, y: 46, along: 460 + DIAGONAL, via: true },
  { x: 66, y: 46, along: 620 + DIAGONAL },
  { x: 70, y: 14, along: 620 + DIAGONAL * 2 },
]
const INNER_LENGTH = 920 + DIAGONAL * 2

// Kilau jalur digambar dengan laju yang cukup pelan supaya terlihat "berjalan" dari kiri ke kanan.
const TRACE_DURATION = 1.6
const traceEase = [0.45, 0, 0.25, 1] as const

/** Bagian waktu (0..1) saat kurva cubic-bezier mencapai kemajuan `progress` (0..1). */
function timeAtProgress([x1, y1, x2, y2]: readonly number[], progress: number) {
  const at = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3
  let low = 0
  let high = 1
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    if (at(y1, y2, mid) < progress) low = mid
    else high = mid
  }
  return at(x1, x2, (low + high) / 2)
}

/** Saat kepala kilau melewati tiap bantalan (detik), supaya bantalan menyala tepat ketika dilewati. */
function padDelays(ext: number) {
  const total = INNER_LENGTH + ext * 2
  return PADS.map((pad) => TRACE_DURATION * timeAtProgress(traceEase, (ext + pad.along) / total))
}

const traceVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0, transition: { duration: 0 } },
  show: { pathLength: 1, opacity: 1, transition: { duration: TRACE_DURATION, ease: traceEase } },
}
const padVariants: Variants = {
  hidden: { scale: 0, opacity: 0, transition: { duration: 0 } },
  show: (delay: number) => ({ scale: [0, 1.5, 1], opacity: 1, transition: { duration: 0.5, delay, ease } }),
}

/**
 * Pembatas Tentang → Layanan: jalur PCB berbelok dengan bantalan solder, sekaligus tepi atas section Layanan
 * yang berlatar emas. Setiap kali masuk layar: kilau jalur tergambar dari tepi kiri layar sampai tepi kanan layar,
 * tiap bantalan menyala (berdenyut + cincin riak) tepat saat dilewati, lalu satu komet cahaya melintas. Tingginya 0.
 */
export function PcbDivider() {
  const [ref, state] = useRevealOnScroll<HTMLDivElement>(1)
  const shown = state === "show" ? "show" : "hidden"
  // Perpanjangan jalur di luar kontainer (satuan viewBox). Nilai awal cukup untuk HP; diperbarui setelah diukur.
  const [ext, setExt] = useState(80)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // ResizeObserver langsung memanggil sekali saat mulai mengamati, lalu tiap lebar kontainer berubah.
    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return
      const gutter = Math.max(rect.left, document.documentElement.clientWidth - rect.right, 0)
      setExt(Math.ceil((gutter / rect.width) * 1000) + 8)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  const trace = tracePath(ext)
  const delays = padDelays(ext)
  return (
    <div className="pcb-divider" aria-hidden="true">
      <div ref={ref} className={`site-container pcb-divider-inner${shown === "show" ? " is-live" : ""}`}>
        <svg className="pcb-divider-svg" viewBox="0 0 1000 60" preserveAspectRatio="none" focusable="false">
          {/* Tepi atas section Layanan (emas) mengikuti jalur: emas di bawah jalur, lekuk tengah tetap navy. */}
          <path className="pcb-notch" d="M300 14 L340 46 H660 L700 14 Z" />
          <path className="pcb-fill" d="M-4000 14 H300 L340 46 H660 L700 14 H5000 V61 H-4000 Z" />
          <motion.path
            d={trace}
            className="pcb-trace"
            variants={traceVariants}
            initial="hidden"
            animate={shown}
          />
          {/* Komet: satu denyut cahaya melintasi jalur setelah kilau selesai tergambar. */}
          <path className="pcb-comet" d={trace} pathLength={1} />
        </svg>
        {PADS.map((pad, i) => (
          <motion.i
            key={`${pad.x}-${pad.y}`}
            className={`pcb-pad${pad.via ? " is-via" : ""}`}
            style={{ left: `${pad.x}%`, top: `${pad.y - 30}px`, "--d": `${delays[i].toFixed(3)}s` } as CSSProperties}
            custom={delays[i]}
            variants={padVariants}
            initial="hidden"
            animate={shown}
          />
        ))}
      </div>
    </div>
  )
}

"use client"

import { motion, type Variants } from "motion/react"
import { useRevealOnScroll } from "@/components/landing/landing-motion"

const ease = [0.22, 1, 0.36, 1] as const

// Jalur tembaga: datang dari kiri, berbelok 45° turun, lurus di tengah, lalu naik lagi ke kanan.
// viewBox 1000×60, melebar mengikuti lebar kontainer. Tinggi tidak diskalakan, jadi garis lurus tetap tipis;
// tanpa "non-scaling-stroke" supaya animasi penggambaran (pathLength) selalu sampai ujung di layar lebar.
const TRACE = "M0 14 H300 L340 46 H660 L700 14 H1000"

// Bantalan solder di setiap belokan + satu via di tengah (posisi dalam % lebar, y dalam viewBox).
const PADS = [
  { x: 30, y: 14 },
  { x: 34, y: 46 },
  { x: 50, y: 46, via: true },
  { x: 66, y: 46 },
  { x: 70, y: 14 },
]

const traceVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0, transition: { duration: 0 } },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease } },
}
const padVariants: Variants = {
  hidden: { scale: 0, opacity: 0, transition: { duration: 0 } },
  show: (i: number) => ({ scale: 1, opacity: 1, transition: { duration: 0.45, delay: 0.35 + i * 0.12, ease } }),
}

/**
 * Pembatas Tentang → Layanan: jalur PCB berbelok dengan bantalan solder, sekaligus tepi atas section Layanan
 * yang berlatar emas. Kilau jalurnya tergambar dari kiri ke kanan setiap kali masuk layar. Tingginya 0.
 */
export function PcbDivider() {
  const [ref, state] = useRevealOnScroll<HTMLDivElement>(1)
  const shown = state === "show" ? "show" : "hidden"
  return (
    <div className="pcb-divider" aria-hidden="true">
      <div ref={ref} className="site-container pcb-divider-inner">
        <svg className="pcb-divider-svg" viewBox="0 0 1000 60" preserveAspectRatio="none" focusable="false">
          <defs>
            <linearGradient id="pcb-trace-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fff3b8" stopOpacity="0" />
              <stop offset=".18" stopColor="#fff3b8" stopOpacity=".7" />
              <stop offset=".5" stopColor="#fffbe6" stopOpacity="1" />
              <stop offset=".82" stopColor="#fff3b8" stopOpacity=".7" />
              <stop offset="1" stopColor="#fff3b8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Tepi atas section Layanan (emas) mengikuti jalur: emas di bawah jalur, lekuk tengah tetap navy. */}
          <path className="pcb-notch" d="M300 14 L340 46 H660 L700 14 Z" />
          <path className="pcb-fill" d="M-4000 14 H300 L340 46 H660 L700 14 H5000 V61 H-4000 Z" />
          <motion.path
            d={TRACE}
            className="pcb-trace"
            variants={traceVariants}
            initial="hidden"
            animate={shown}
          />
        </svg>
        {PADS.map((pad, i) => (
          <motion.i
            key={`${pad.x}-${pad.y}`}
            className={`pcb-pad${pad.via ? " is-via" : ""}`}
            style={{ left: `${pad.x}%`, top: `${pad.y - 30}px` }}
            custom={i}
            variants={padVariants}
            initial="hidden"
            animate={shown}
          />
        ))}
      </div>
    </div>
  )
}

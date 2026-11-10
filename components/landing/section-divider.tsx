"use client"

import { motion, type Variants } from "motion/react"
import { useRevealOnScroll } from "@/components/landing/landing-motion"

const ease = [0.22, 1, 0.36, 1] as const
// Tersembunyi seketika (reset tak terlihat); tergambar setiap kali masuk layar.
const lineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0, transition: { duration: 0 } },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease } },
}
const nodeVariants: Variants = {
  hidden: { scale: 0, transition: { duration: 0 } },
  show: { scale: 1, transition: { duration: 0.5, delay: 0.35, ease } },
}

/**
 * Pembatas antar section di Beranda: garis tipis bergaya jalur PCB dengan "titik" emas di tengah
 * (senada dengan berlian di pita berjalan). Setiap kali terlihat, garis tergambar dari tengah ke samping.
 * Tingginya 0, jadi tidak menambah jarak maupun menimbulkan sambungan warna antar section.
 */
export function SectionDivider() {
  const [ref, state] = useRevealOnScroll<HTMLSpanElement>(1)
  const shown = state === "show" ? "show" : "hidden"
  return (
    <div className="section-divider" aria-hidden="true">
      <div className="site-container section-divider-inner">
        <motion.span ref={ref} className="section-divider-line" variants={lineVariants} initial="hidden" animate={shown} />
        <motion.i className="section-divider-node" variants={nodeVariants} initial="hidden" animate={shown} />
      </div>
    </div>
  )
}

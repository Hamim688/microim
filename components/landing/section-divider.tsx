"use client"

import { motion } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Pembatas antar section di Beranda: garis tipis bergaya jalur PCB dengan "titik" emas di tengah
 * (senada dengan berlian di pita berjalan). Saat pertama terlihat, garis tergambar dari tengah ke samping.
 * Tingginya 0, jadi tidak menambah jarak maupun menimbulkan sambungan warna antar section.
 */
export function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <div className="site-container section-divider-inner">
        <motion.span
          className="section-divider-line"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.9, ease }}
        />
        <motion.i
          className="section-divider-node"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease }}
        />
      </div>
    </div>
  )
}

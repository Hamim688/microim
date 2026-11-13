"use client"

import type { CSSProperties } from "react"
import { useRevealOnScroll } from "@/components/landing/landing-motion"

/**
 * Kartu "datasheet" berbentuk chip IC di bagian Tentang: nama Microim tercetak di badan chip seperti marking IC,
 * tiap baris spesifikasi bernomor pin. Saat masuk layar pin emas tumbuh, kilau menyapu badan chip, dan baris
 * muncul berurutan (lihat .about-chip di CSS).
 */
export function AboutChip({ specs, tagline }: { specs: { label: string; value: string }[]; tagline: string }) {
  const [ref, state] = useRevealOnScroll<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className={`about-chip${state === "show" ? " is-live" : ""}`}>
      <span className="about-chip-sheen" aria-hidden="true" />
      <span className="about-chip-notch" aria-hidden="true" />
      <span className="about-chip-pin1" aria-hidden="true" />
      <div className="about-chip-marking">
        <span className="about-chip-kicker">DATASHEET</span>
        <strong>MICROIM</strong>
        <span className="about-chip-fullname">Microcontroller Immediately Made</span>
      </div>
      <dl className="about-chip-specs">
        {specs.map(({ label, value }, index) => (
          <div key={label} style={{ "--row": index } as CSSProperties}>
            <dt><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="about-chip-tagline" style={{ "--row": specs.length } as CSSProperties}>“{tagline}”</p>
    </div>
  )
}

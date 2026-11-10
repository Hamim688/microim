"use client"

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { BrainCircuit, Check, Gauge, Lightbulb, Link2, UsersRound, Zap } from "lucide-react"
import { motion, type Variants } from "motion/react"
import { ScrollReveal, useRevealOnScroll } from "@/components/landing/landing-motion"

const values = [
  { letter: "M", title: "Mutu", text: "Memberikan solusi teknologi dengan kualitas yang terukur.", icon: Check },
  { letter: "I", title: "Inovatif", text: "Mengembangkan teknologi kreatif untuk kebutuhan masa depan.", icon: Lightbulb },
  { letter: "C", title: "Cerdas", text: "Menghubungkan perangkat dan sistem melalui rancangan yang tepat.", icon: BrainCircuit },
  { letter: "R", title: "Responsif", text: "Memahami kebutuhan pengguna dalam setiap proses rekayasa.", icon: Zap },
  { letter: "O", title: "Optimal", text: "Memilih solusi yang sesuai untuk tujuan dan batasan proyek.", icon: Gauge },
  { letter: "I", title: "Integratif", text: "Menyatukan perangkat keras, perangkat lunak tertanam, aplikasi, dan konektivitas.", icon: Link2 },
  { letter: "M", title: "Mudah", text: "Membuat teknologi kompleks terasa lebih mudah digunakan.", icon: UsersRound },
]

// Setiap kali masuk layar, huruf M-I-C-R-O-I-M muncul berurutan: naik dari bawah saat di-scroll ke bawah,
// turun dari atas saat di-scroll ke atas. Reset terjadi diam-diam setelah keluar layar.
const wordVariants: Variants = { below: {}, above: {}, show: { transition: { staggerChildren: 0.06 } } }
const letterVariants: Variants = {
  below: { opacity: 0, y: 28, transition: { duration: 0 } },
  above: { opacity: 0, y: -28, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * Nilai M-I-C-R-O-I-M: kata "MICROIM" sebagai deretan huruf besar yang bisa dipilih (klik, ketuk, atau
 * tombol panah). Garis emas meluncur ke huruf terpilih dan artinya tampil di bawah.
 */
export function ValuesSection() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [wordRef, wordState] = useRevealOnScroll<HTMLDivElement>(0.5)

  const select = (index: number, focus = false) => {
    setActive(index)
    if (focus) tabs.current[index]?.focus()
  }
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = values.length - 1
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null
    if (next === null) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <section className="values-section" aria-labelledby="values-heading">
      <div className="site-container">
        <ScrollReveal className="values-head">
          <h2 id="values-heading"><span>M-I-C-R-O-I-M</span> Nilai Perusahaan</h2>
          <p>Tujuh nilai di balik nama Microim. Pilih huruf untuk melihat artinya.</p>
        </ScrollReveal>

        <motion.div
          ref={wordRef}
          className="values-word"
          role="tablist"
          aria-label="Nilai M-I-C-R-O-I-M"
          style={{ "--i": active } as CSSProperties}
          variants={wordVariants}
          initial="below"
          animate={wordState}
        >
            {values.map(({ letter, title }, index) => (
              <button
                key={`${letter}-${title}`}
                ref={(el) => { tabs.current[index] = el }}
                type="button"
                role="tab"
                id={`value-tab-${index}`}
                aria-controls={`value-panel-${index}`}
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                className={`values-letter${index === active ? " is-active" : ""}`}
                onClick={() => select(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <motion.span className="values-letter-char" aria-hidden="true" variants={letterVariants}>{letter}</motion.span>
                <span className="values-letter-name">{title}</span>
              </button>
            ))}
            <span className="values-indicator" aria-hidden="true" />
        </motion.div>

        <ScrollReveal delay={0.25}>

          {values.map(({ title, text, icon: Icon }, index) => (
            <div
              key={title}
              role="tabpanel"
              id={`value-panel-${index}`}
              aria-labelledby={`value-tab-${index}`}
              hidden={index !== active}
              className="values-panel"
            >
              <span className="values-panel-icon" aria-hidden="true"><Icon /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

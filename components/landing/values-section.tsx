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
 * tombol panah). Lampu sorot panggung berdiri di atas garis emas dan meluncur ke huruf terpilih: menunduk &
 * padam saat bergeser, lalu mendangak dan menyala membentuk sorotan V ke huruf itu. Artinya tampil di bawah.
 */
export function ValuesSection() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [wordRef, wordState] = useRevealOnScroll<HTMLDivElement>(0.5)
  // Lampu sorot: padam saat meluncur ke huruf baru, menyala lagi setelah tiba (≈ durasi luncuran).
  const [lit, setLit] = useState(true)
  const lightTimer = useRef<number | undefined>(undefined)

  const select = (index: number, focus = false) => {
    if (index !== active) {
      setLit(false)
      window.clearTimeout(lightTimer.current)
      lightTimer.current = window.setTimeout(() => setLit(true), 560)
    }
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
            {/* Rel lampu panggung (track light) dengan takik di bawah setiap huruf. */}
            <span className="values-track" aria-hidden="true" />
            {/* Lampu sorot panggung + sorotan berbentuk V ke huruf terpilih. */}
            <span className={`values-spot${lit && wordState === "show" ? " is-lit" : ""}`} aria-hidden="true">
              <span className="values-beam" />
              <span className="values-rail" />
              <span className="values-lamp">
                {/* Kaki + tiang + gagang U (diam) */}
                <svg className="lamp-stand" viewBox="0 0 48 40" focusable="false">
                  <rect x="16" y="36" width="16" height="4" rx="2" fill="#6e3d1c" />
                  <rect x="22.8" y="29" width="2.4" height="7.5" fill="#cfe0f5" />
                  <path d="M11 17 V25 Q11 30 16 30 H32 Q37 30 37 25 V17" fill="none" stroke="#cfe0f5" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                {/* Kepala lampu: menunduk ke depan (ke arah penonton) pada poros gagang; daun pintu biru berengsel. */}
                <svg className="lamp-head" viewBox="0 0 48 40" focusable="false">
                  <defs>
                    <linearGradient id="lamp-copper" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="#d08a4c" />
                      <stop offset="1" stopColor="#6e3d1c" />
                    </linearGradient>
                  </defs>
                  <path className="lamp-door lamp-door-back" d="M18 10 L19 3 H29 L30 10 Z" fill="#1f4fb0" />
                  <rect x="13" y="11" width="22" height="15" rx="4" fill="url(#lamp-copper)" />
                  <ellipse className="lamp-lens" cx="24" cy="11" rx="10" ry="3.4" />
                  <path className="lamp-door lamp-door-l" d="M14 11 L5 4 L8 1.5 L16 9 Z" fill="#2f6fe0" />
                  <path className="lamp-door lamp-door-r" d="M34 11 L43 4 L40 1.5 L32 9 Z" fill="#2f6fe0" />
                  <circle cx="11" cy="19" r="1.6" fill="#cfe0f5" />
                  <circle cx="37" cy="19" r="1.6" fill="#cfe0f5" />
                </svg>
                {/* Tampak depan saat menunduk: lensa menghadap penonton, daun pintu setengah menutup. */}
                <svg className="lamp-front" viewBox="0 0 48 40" focusable="false">
                  <rect x="17" y="5.5" width="14" height="4" rx="1.2" fill="#1f4fb0" />
                  <circle cx="24" cy="19" r="11" fill="url(#lamp-copper)" />
                  <circle cx="24" cy="19" r="8" fill="#3a2d14" />
                  <rect className="lamp-front-door" x="12.5" y="9" width="7.5" height="20" rx="1.5" fill="#2f6fe0" />
                  <rect className="lamp-front-door" x="28" y="9" width="7.5" height="20" rx="1.5" fill="#2f6fe0" />
                  <circle cx="11" cy="19" r="1.6" fill="#cfe0f5" />
                  <circle cx="37" cy="19" r="1.6" fill="#cfe0f5" />
                </svg>
              </span>
            </span>
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

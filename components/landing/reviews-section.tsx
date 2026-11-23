import type { CSSProperties } from "react"
import { Star } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { RevealFlag } from "@/components/landing/reveal-flag"
import { LedStripDivider } from "@/components/landing/led-strip-divider"
import { ReviewsRail } from "@/components/landing/reviews-rail"
import type { ReviewSummary } from "@/lib/reviews"

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={`rv-stars${className ? ` ${className}` : ""}`} role="img" aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} aria-hidden="true" className={n <= value ? "is-on" : undefined} />)}
    </span>
  )
}

/**
 * Bintang skor rata-rata: emas logam (sama dengan huruf nilai MICROIM) dengan kilau putih yang menyapu dari kiri ke
 * kanan, lalu jeda. Gradasinya satu untuk kelima bintang dan dianimasikan lewat SVG supaya tidak perlu JavaScript.
 */
function ShinyStars({ value }: { value: number }) {
  return (
    <span className="rv-stars is-shiny" role="img" aria-label={`${value} dari 5 bintang`}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="rv-star-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff0b0" />
            <stop offset=".55" stopColor="#ffc928" />
            <stop offset="1" stopColor="#c9930a" />
          </linearGradient>
          <linearGradient id="rv-star-glint" x1="0" y1="0" x2="1" y2="0" gradientTransform="translate(-1.5 0)">
            <stop offset=".35" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".65" stopColor="#fff" stopOpacity="0" />
            <animateTransform attributeName="gradientTransform" type="translate" values="-1.5 0;-1.5 0;1.5 0;1.5 0" keyTimes="0;.45;.8;1" dur="4.5s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
      </svg>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={n <= value ? "is-on" : undefined} aria-hidden="true" focusable="false">
          <path className="rv-star-base" d={STAR} />
          {n <= value ? <path className="rv-star-glint" d={STAR} /> : null}
        </svg>
      ))}
    </span>
  )
}

// Bentuk bintang (sama dengan ikon Star dari lucide).
const STAR = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"

const decimal = (n: number) => n.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/**
 * Ulasan (Beranda): nilai rata-rata besar di kiri, lalu deretan kartu ulasan yang bisa digeser ke samping.
 * Hanya ulasan yang disetujui admin; section tidak tampil sama sekali bila belum ada.
 * Diletakkan tepat sebelum Kontak: menjawab keraguan pengunjung persis sebelum diajak chat.
 */
export function ReviewsSection({ summary }: { summary: ReviewSummary }) {
  const { reviews, average, count } = summary
  if (reviews.length === 0) return null
  return (
    <section className="rv-section" id="ulasan" aria-labelledby="reviews-heading">
      <LedStripDivider />
      <div className="site-container">
        <ScrollReveal className="rv-head">
          <h2 id="reviews-heading">Sudah Terbukti, <span>Ini Kata Mereka.</span></h2>
          <div className="rv-score" aria-label={`Rata-rata ${decimal(average)} dari 5, dari ${count} ulasan`}>
            <strong aria-hidden="true">{decimal(average)}</strong>
            <div aria-hidden="true">
              <ShinyStars value={Math.round(average)} />
              <p>dari {count} ulasan pelanggan</p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <RevealFlag className="rv-rail" amount={0.2}>
        <ReviewsRail>
          {reviews.map((r, index) => (
            <li key={r.id} className="rv-card" style={{ "--c": Math.min(index, 6) } as CSSProperties}>
              <Stars value={r.rating} />
              <blockquote>{r.comment}</blockquote>
              <footer>
                <span className="rv-avatar" aria-hidden="true">{r.name.trim().charAt(0).toUpperCase()}</span>
                <span className="rv-who">
                  <strong>{r.name}</strong>
                  {r.detail ? <small>{r.detail}</small> : null}
                </span>
              </footer>
              {r.item ? <p className="rv-item">{r.item}</p> : null}
            </li>
          ))}
        </ReviewsRail>
      </RevealFlag>
    </section>
  )
}

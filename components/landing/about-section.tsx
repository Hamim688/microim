import { ScrollReveal } from "@/components/landing/landing-motion"

const VISION = "Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global."

/** Visi Microim sebagai satu pernyataan besar (dipakai di Beranda & halaman /about). */
export function VisionStatement() {
  return (
    <figure className="vision-statement">
      <figcaption>Visi Microim</figcaption>
      <blockquote>
        <p>“{VISION}”</p>
      </blockquote>
    </figure>
  )
}

export function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="site-container">
        <ScrollReveal className="about-head">
          <div>
            <span className="section-kicker">TENTANG MICROIM</span>
            <h2>Membangun Teknologi Lewat Inovasi</h2>
          </div>
          <p>Microim menghubungkan ide kreatif dengan penerapan nyata melalui pengembangan perangkat keras dan perangkat lunak.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <VisionStatement />
        </ScrollReveal>
      </div>
    </section>
  )
}

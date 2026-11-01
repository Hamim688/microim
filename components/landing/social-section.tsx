import { ArrowUpRight, AtSign } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { siteSocials } from "@/lib/site"

export function SocialSection() {
  if (siteSocials.length === 0) return null
  return (
    <section className="social-section" aria-labelledby="social-heading">
      <div className="site-container">
        <ScrollReveal>
          <div className="social-panel">
            <div>
              <span className="section-kicker">IKUTI MICROIM</span>
              <h2 id="social-heading">Lihat Proses, Tips, dan Produk Terbaru</h2>
              <p>Kami membagikan proses perakitan, tips mikrokontroler, dan update produk di media sosial.</p>
            </div>
            <div className="social-links">
              {siteSocials.map((social) => (
                <a key={social.name} className="social-link" href={social.url} target="_blank" rel="noopener noreferrer">
                  <span className="social-link-icon"><AtSign aria-hidden="true" /></span>
                  <span className="social-link-text">
                    <strong>{social.name}</strong>
                    <span>{social.handle}</span>
                  </span>
                  <ArrowUpRight className="social-link-arrow" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

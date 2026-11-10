import Link from "next/link"
import Image from "next/image"
import { GraduationCap, MessageCircle, ShieldCheck, ShoppingBag, Zap } from "lucide-react"
import { whatsappLink } from "@/lib/site"
import { Esp32Viewer } from "@/components/landing/esp32-viewer"
import { HeroReplay } from "@/components/landing/hero-replay"

const heroProof = [
  { label: "Respons Cepat", icon: Zap },
  { label: "Diuji Sebelum Diserahkan", icon: ShieldCheck },
  { label: "Ramah Proyek Kampus", icon: GraduationCap },
]

function HardwareIllustration() {
  return (
    <div className="hero-esp32">
      <Esp32Viewer>
        <Image
          src="/images/esp32-poster.webp"
          alt="Papan ESP32 DevKit Microim"
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          priority
        />
      </Esp32Viewer>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero-section" id="home">
      <HeroReplay />
      <div className="hero-circuit-grid" aria-hidden="true" />
      <div className="hero-pointer-field">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="status-light" /> RAKIT · PROGRAM · KOMPONEN</div>
            <h1><span className="hero-line">Microcontroller</span> <span className="hero-line">Immediately Made.</span></h1>
            <p>Microim menyediakan jasa perakitan dan pemrograman mikrokontroler, lengkap dengan komponen ready stock yang bisa COD di area kampus, untuk membawa idemu dari purwarupa hingga perangkat siap pakai.</p>
            <div className="hero-actions">
              <a className="button-primary" href={whatsappLink("Halo Microim, saya ingin berkonsultasi mengenai proyek perangkat.")} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /> Konsultasi via WhatsApp</a>
              <Link className="button-secondary" href="/products"><ShoppingBag aria-hidden="true" /> Lihat Produk</Link>
            </div>
            <ul className="hero-proof" aria-label="Keunggulan Microim">
              {heroProof.map(({ label, icon: Icon }) => (
                <li key={label}><Icon aria-hidden="true" />{label}</li>
              ))}
            </ul>
          </div>
          <div className="hero-visual"><HardwareIllustration /></div>
        </div>
      </div>
    </section>
  )
}

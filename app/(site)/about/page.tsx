import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Globe2 } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { ValuesSection } from "@/components/landing/values-section"
import { OrderSteps } from "@/components/landing/order-steps"
import { LandingMotion } from "@/components/landing/landing-motion"

export const metadata: Metadata = {
  title: "Tentang",
  description: "Kenali Microim (Microcontroller Immediately Made): visi, nilai M-I-C-R-O-I-M, dan cara kami bekerja.",
}

export default function AboutPage() {
  return (
    <LandingMotion>
      <PageHero kicker="TENTANG MICROIM" title={<>Microcontroller <span>Immediately Made</span></>}>
        Microim adalah usaha rekayasa teknologi yang berfokus pada perakitan perangkat IoT, pemrograman mikrokontroler, dan penyediaan komponen elektronik, agar ide teknologi lebih cepat menjadi perangkat nyata.
      </PageHero>

      <section className="about-section">
        <div className="site-container">
          <div className="vision-panel">
            <div>
              <span className="section-kicker">VISI UTAMA PERUSAHAAN</span>
              <blockquote>“Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global.”</blockquote>
            </div>
            <div className="vision-badge"><Globe2 aria-hidden="true" /><span>PENGEMBANGAN<br />MENDUNIA</span></div>
            <div className="vision-watermark" aria-hidden="true">M</div>
          </div>
        </div>
      </section>

      <ValuesSection />
      <OrderSteps />

      <section className="cta-section">
        <div className="cta-panel">
          <span className="section-kicker">MARI BERKOLABORASI</span>
          <h2>Punya Ide Perangkat?</h2>
          <p>Ceritakan kebutuhanmu, kami bantu dari pemilihan komponen sampai perangkat siap dipakai.</p>
          <div className="cta-actions">
            <Link className="button-primary" href="/contact">Hubungi Microim <ArrowUpRight aria-hidden="true" /></Link>
            <Link className="button-secondary" href="/services">Lihat Layanan</Link>
          </div>
        </div>
      </section>
    </LandingMotion>
  )
}

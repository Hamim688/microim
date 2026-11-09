import type { Metadata } from "next"
import { Cpu, MessageCircle, Package, Terminal } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { OrderSteps } from "@/components/landing/order-steps"
import { LandingMotion, ScrollReveal } from "@/components/landing/landing-motion"
import { whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Layanan",
  description: "Jasa perakitan perangkat IoT, pemrograman mikrokontroler (Arduino, ESP32), dan paket komponen proyek dari Microim.",
}

const services = [
  {
    code: "RAKIT.01",
    icon: Cpu,
    title: "Perakitan Perangkat & IoT",
    body: "Pemilihan komponen, wiring, penyolderan, dan perakitan rangkaian mikrokontroler beserta sensor, aktuator, dan catu daya. Setiap perangkat dites dulu sebelum diserahkan.",
  },
  {
    code: "PROGRAM.02",
    icon: Terminal,
    title: "Pemrograman Mikrokontroler",
    body: "Kode program Arduino/ESP32 (C/C++) untuk membaca sensor, menggerakkan motor dan servo, hingga mengirim data ke dashboard IoT lewat WiFi, lengkap dengan penjelasan alurnya.",
  },
  {
    code: "PAKET.03",
    icon: Package,
    title: "Komponen & Paket Proyek",
    body: "Komponen ready stock dengan harga mahasiswa, plus bundling paket proyek (mis. mobil kit) yang sudah dicek kecocokannya, sehingga tidak perlu takut salah beli modul.",
  },
]

export default function ServicesPage() {
  return (
    <LandingMotion>
      <PageHero kicker="LAYANAN REKAYASA" title={<>Jasa Rakit Perangkat &amp; <span>Pemrograman</span></>}>
        Dari perakitan purwarupa hingga sistem tertanam yang siap dipakai. Pilih layanan, lalu konsultasikan kebutuhanmu lewat WhatsApp.
      </PageHero>

      <section className="services-section">
        <div className="site-container">
          <div className="services-grid">
            {services.map(({ code, icon: Icon, title, body }, index) => (
              <ScrollReveal key={code} delay={index * 0.08}>
                <article className="service-card">
                  <div className="service-icon"><Icon aria-hidden="true" /></div>
                  <span className="service-code">{code}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <div className="service-card-bottom">
                    <span>KONSULTASI</span>
                    <a href={whatsappLink(`Halo Microim, saya ingin konsultasi layanan ${title}.`)} target="_blank" rel="noopener noreferrer" aria-label={`Konsultasi ${title} lewat WhatsApp`}>
                      <MessageCircle aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <OrderSteps />
    </LandingMotion>
  )
}

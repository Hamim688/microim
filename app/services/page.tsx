import type { Metadata } from "next"
import { Cpu, MessageCircle, Smartphone, Terminal } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { OrderSteps } from "@/components/landing/order-steps"
import { LandingMotion, ScrollReveal } from "@/components/landing/landing-motion"
import { whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Layanan",
  description: "Jasa perakitan perangkat IoT, pemrograman sistem tertanam, dan pembuatan aplikasi pemantau dari Microim.",
}

const services = [
  {
    code: "RAKIT.01",
    icon: Cpu,
    title: "Perakitan Perangkat & IoT",
    body: "Perancangan skematik, tata letak PCB khusus, pemilihan sensor dan aktuator, serta integrasi modul nirkabel (LoRa, ESP32, GSM/seluler).",
  },
  {
    code: "PROGRAM.02",
    icon: Terminal,
    title: "Pemrograman Sistem Tertanam",
    body: "Pengembangan perangkat lunak tertanam C/C++ yang deterministik dengan FreeRTOS, penghematan daya baterai, dan pembaruan jarak jauh yang aman.",
  },
  {
    code: "APLIKASI.03",
    icon: Smartphone,
    title: "Pembuatan Aplikasi Seluler",
    body: "Aplikasi lintas platform untuk menerima telemetri sensor melalui Bluetooth hemat energi (BLE), REST API, atau MQTT WebSocket.",
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

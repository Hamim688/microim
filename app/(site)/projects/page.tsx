import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { LandingMotion, ScrollReveal } from "@/components/landing/landing-motion"
import { whatsappLink } from "@/lib/site"

const projects = [
  {
    title: "Telemetri Kualitas Air & Oksigen Terlarut",
    category: "IoT",
    desc: "Sistem pemantauan tambak melalui LoRaWAN jarak jauh dengan baterai panel surya yang bertahan hingga 14 hari.",
    tech: ["ESP32", "LoRaWAN", "FreeRTOS", "MQTT"],
  },
  {
    title: "Kendaraan Logistik Otomatis & Penghindar Rintangan",
    category: "Robotika",
    desc: "Robot pengangkut barang di gudang dengan sensor ultrasonik dan LiDAR berbasis mikrokontroler presisi tinggi.",
    tech: ["STM32", "Pengendali H-Bridge", "Pengendali PID", "BLE 5.0"],
  },
  {
    title: "Pencatat Suhu Rantai Dingin",
    category: "Sistem Tertanam",
    desc: "Pencatat data berakurasi tinggi dengan enkripsi memori internal dan sinkronisasi NFC ke ponsel pintar.",
    tech: ["ATmega328P", "DS18B20", "EEPROM", "NFC"],
  },
]

export const metadata: Metadata = {
  title: "Proyek",
  description: "Contoh bidang proyek IoT, robotika, dan sistem tertanam yang bisa dikerjakan bersama Microim.",
}

export default function ProjectsPage() {
  return (
    <LandingMotion>
      <PageHero kicker="CONTOH BIDANG PROYEK" title={<>Proyek Rekayasa &amp; <span>Purwarupa</span></>}>
        Gambaran jenis proyek perangkat keras, mikrokontroler, dan otomasi yang bisa kami bantu wujudkan. Punya ide serupa? Konsultasikan saja.
      </PageHero>
      <div className="site-container page-body">
        <div className="projects-page-grid">
          {projects.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <article className="service-card project-page-card">
                <span className="project-category"><i /> {p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t) => <span key={t}>{t}</span>)}
                </div>
                <div className="service-card-bottom">
                  <span>PROYEK SERUPA?</span>
                  <a href={whatsappLink(`Halo Microim, saya ingin konsultasi proyek serupa: ${p.title}.`)} target="_blank" rel="noopener noreferrer" aria-label={`Konsultasikan proyek serupa ${p.title}`}>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </LandingMotion>
  )
}

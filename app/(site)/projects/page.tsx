import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { LandingMotion, ScrollReveal } from "@/components/landing/landing-motion"
import { whatsappLink } from "@/lib/site"

// Contoh proyek yang bisa dirakit dari komponen yang tersedia di katalog Microim.
const projects = [
  {
    title: "Smart Car 2WD Radar Scanner",
    category: "Robotika",
    desc: "Mobil robot yang memindai sekitarnya hingga 180° dengan sensor ultrasonik di atas servo, lalu menghindari rintangan secara otomatis.",
    tech: ["ESP32", "Servo SG90", "Sensor SRF04", "Driver L298N"],
  },
  {
    title: "Robot Line Follower",
    category: "Robotika",
    desc: "Robot pengikut garis untuk praktikum dan lomba: membaca lintasan dengan sensor garis dan mengatur kecepatan dua motor DC.",
    tech: ["Arduino / ESP32", "Sensor Garis", "Motor DC Gearbox TT", "Driver L298N"],
  },
  {
    title: "Pemantau Ruangan Berbasis IoT",
    category: "IoT",
    desc: "Perangkat pembaca suhu, kelembapan, atau jarak yang mengirim data lewat WiFi ke dashboard di HP, cocok untuk tugas mata kuliah IoT.",
    tech: ["ESP32", "Sensor", "WiFi", "Dashboard IoT"],
  },
]

export const metadata: Metadata = {
  title: "Proyek",
  description: "Contoh proyek IoT dan robotika (smart car, line follower, pemantau IoT) yang bisa dirakit dan diprogram bersama Microim.",
}

export default function ProjectsPage() {
  return (
    <LandingMotion>
      <PageHero kicker="CONTOH PROYEK" title={<>Proyek Rekayasa &amp; <span>Purwarupa</span></>}>
        Contoh proyek yang bisa kami rakit dan program dari komponen di katalog Microim. Punya ide serupa atau tugas dengan spesifikasi berbeda? Konsultasikan saja.
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

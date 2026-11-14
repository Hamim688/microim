import Link from "next/link"
import { ArrowUpRight, Check, Code2, Cpu, MessageCircle, ShoppingBag } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { whatsappLink } from "@/lib/site"

// Cakupan tiap layanan mengikuti rencana bisnis Microim (reseller komponen, jasa perakitan, jasa programming).
const services = [
  {
    icon: Cpu,
    title: "Jasa Rakit Perangkat & IoT",
    body: "Perakitan perangkat, purwarupa, dan sistem IoT sesuai kebutuhan proyek, dari pemilihan komponen sampai siap diuji.",
    points: ["Perakitan & wiring", "Integrasi komponen", "Diuji sebelum diserahkan"],
    href: "/services",
    action: "Lihat jasa rakit",
  },
  {
    icon: Code2,
    title: "Jasa Pemrograman",
    body: "Pemrograman mikrokontroler, perangkat lunak tertanam, dan integrasi aplikasi agar perangkat bekerja sesuai kebutuhanmu.",
    points: ["Kode mikrokontroler", "Integrasi IoT & aplikasi", "Disesuaikan dengan proyekmu"],
    href: "/services",
    action: "Lihat jasa pemrograman",
  },
  {
    icon: ShoppingBag,
    title: "Komponen IoT & Elektronik",
    body: "Cari papan mikrokontroler, sensor, motor, dan modul elektronik untuk merakit proyekmu sendiri.",
    points: ["Papan mikrokontroler", "Sensor, servo & motor", "Kit & perlengkapan purwarupa"],
    href: "/products",
    action: "Belanja komponen",
  },
]

/**
 * Layanan (Beranda): section kuning emas + navy, senada materi promosi Microim. Tepi atasnya mengikuti jalur PCB
 * (lihat PcbDivider), tepi bawahnya miring ke section Produk. Seluruh kartu bisa diklik.
 */
export function ServicesPreview() {
  return (
    <section className="svc-section" id="services-core" aria-labelledby="services-heading">
      <div className="site-container">
        <ScrollReveal className="svc-head">
          <h2 id="services-heading">Butuh Dirakit, Diprogram, atau Komponennya?</h2>
          <p>Pilih bantuan teknis atau temukan komponen yang kamu perlukan untuk mulai berkarya.</p>
        </ScrollReveal>

        <div className="svc-grid">
          {services.map(({ icon: Icon, title, body, points, href, action }, index) => (
            <ScrollReveal key={title} delay={index * 0.09} className="svc-cell">
              <Link className="svc-card" href={href}>
                <span className="svc-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3><Icon aria-hidden="true" />{title}</h3>
                <p>{body}</p>
                <ul>
                  {points.map((point) => (
                    <li key={point}><Check aria-hidden="true" />{point}</li>
                  ))}
                </ul>
                <span className="svc-action">{action}<span className="svc-arrow" aria-hidden="true"><ArrowUpRight /></span></span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.1} className="svc-help">
          <p><strong>Belum yakin butuh yang mana?</strong> Ceritakan proyekmu, kami bantu pilihkan.</p>
          <a
            className="svc-help-button"
            href={whatsappLink("Halo Microim, saya ingin berkonsultasi tentang layanan yang cocok untuk proyek saya.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" />Konsultasi via WhatsApp
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}

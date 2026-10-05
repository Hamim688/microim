import Link from "next/link"
import { ArrowRight, Code2, Cpu, ShoppingBag } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"

const services = [
  { code: "RAKIT.01", icon: Cpu, title: "Jasa Rakit Perangkat & IoT", body: "Perakitan perangkat, purwarupa, dan sistem IoT sesuai kebutuhan proyek—dari pemilihan komponen sampai siap diuji.", href: "/services", action: "LIHAT JASA RAKIT" },
  { code: "PROGRAM.02", icon: Code2, title: "Jasa Pemrograman", body: "Pemrograman mikrokontroler, perangkat lunak tertanam, dan integrasi aplikasi agar perangkat bekerja sesuai kebutuhanmu.", href: "/services", action: "LIHAT JASA PEMROGRAMAN" },
  { code: "TOKO.IOT.03", icon: ShoppingBag, title: "Komponen IoT & Elektronik", body: "Cari papan mikrokontroler, sensor, motor, dan modul elektronik untuk merakit proyekmu sendiri.", href: "/products", action: "BELANJA KOMPONEN" },
]

export function ServicesPreview() {
  return (
    <section className="services-section" id="services-core">
      <div className="site-container">
        <ScrollReveal className="section-heading centered-heading">
          <span className="section-kicker">JASA &amp; PRODUK MIKROIM</span>
          <h2>Butuh Dirakit, Diprogram, atau Komponennya?</h2>
          <p>Pilih bantuan teknis atau temukan komponen yang kamu perlukan untuk mulai berkarya.</p>
        </ScrollReveal>
        <div className="services-grid">
          {services.map(({ code, icon: Icon, title, body, href, action }, index) => (
            <ScrollReveal key={code} delay={index * 0.09}>
              <article className="service-card">
                <div className="service-icon"><Icon aria-hidden="true" /></div>
                <span className="service-code">{code}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="service-card-bottom"><span>{action}</span><Link href={href} aria-label={`${action}: ${title}`}><ArrowRight aria-hidden="true" /></Link></div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

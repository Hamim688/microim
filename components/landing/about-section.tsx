import { AboutChip } from "@/components/landing/about-chip"
import { AboutReasons } from "@/components/landing/about-reasons"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { RevealFlag } from "@/components/landing/reveal-flag"
import { VisionStatement } from "@/components/landing/vision-statement"

// Dipakai juga oleh halaman /about.
export { VisionStatement }

// Isi "datasheet" & masalah → solusi diambil dari rencana bisnis Microim (deck Canva "Microim Wenak").
const DATASHEET = [
  { label: "Layanan", value: "Komponen ready stock · Perakitan hardware · Pemrograman & IoT" },
  { label: "Untuk", value: "Mahasiswa praktikum, tugas akhir & hobiis elektronika" },
  { label: "Distribusi", value: "Same-day & COD area kampus · kurir untuk luar kota" },
  { label: "Kualitas", value: "Modul dites sebelum dijual, diberi label pinout" },
]

/**
 * Tentang Microim (konsep "datasheet"): judul bab besar + kartu berbentuk chip IC berisi profil singkat,
 * lalu "Kenapa Microim ada" (daftar masalah + panel solusi interaktif, lihat AboutReasons), dan visi.
 * Nilai M-I-C-R-O-I-M ada di ValuesSection.
 */
export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-heading">
      <div className="site-container">
        <div className="about-intro">
          <RevealFlag className="about-title-block" amount={0.3}>
            <h2 id="about-heading" className="about-title">
              <span className="about-title-line"><span>Tentang</span></span>
              <span className="about-title-line"><span className="is-gold">Microim.</span></span>
            </h2>
            <p className="about-subtitle">Membangun Teknologi Lewat Inovasi</p>
            <p className="about-lead">
              Microim hadir menjembatani akses komponen dari distributor grosir langsung ke tangan mahasiswa, tanpa
              ongkos kirim dan tanpa waktu tunggu, lengkap dengan jasa perakitan dan pemrograman untuk menghidupkan
              proyekmu.
            </p>
          </RevealFlag>

          <ScrollReveal delay={0.1} className="about-chip-wrap">
            <AboutChip specs={DATASHEET} tagline="Komponen Lengkap, Kerja Tanggap." />
          </ScrollReveal>
        </div>

        <div className="about-reasons">
          <ScrollReveal className="about-reasons-head">
            <div>
              <span className="about-mono">MASALAH → SOLUSI</span>
              <h3>Kenapa Microim ada</h3>
            </div>
            <p>Tiga kendala yang paling sering dialami mahasiswa saat mengerjakan proyek, dan cara Microim menjawabnya.</p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <AboutReasons />
          </ScrollReveal>
        </div>

        <VisionStatement />
      </div>
    </section>
  )
}

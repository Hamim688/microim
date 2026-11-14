import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Code2, Cpu, MessageCircle, ShoppingBag } from "lucide-react"
import { SubpageHead } from "@/components/layout/subpage-head"
import { HashTarget } from "@/components/layout/hash-target"
import { AnchorIsland } from "@/components/layout/segmented"
import { OrderSteps } from "@/components/landing/order-steps"
import { LandingMotion, PageEntrance, ScrollReveal } from "@/components/landing/landing-motion"
import { whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Layanan",
  description: "Jasa perakitan perangkat IoT, pemrograman mikrokontroler (Arduino, ESP32), dan paket komponen proyek dari Microim.",
}

// `id` dipakai sebagai jangkar: kartu Layanan di Beranda menuju /services#rakit dan /services#pemrograman.
const services = [
  {
    id: "rakit",
    short: "Jasa rakit",
    icon: Cpu,
    title: "Jasa Rakit Perangkat & IoT",
    body: "Pemilihan komponen, wiring, penyolderan, dan perakitan rangkaian mikrokontroler beserta sensor, aktuator, dan catu daya. Setiap perangkat dites dulu sebelum diserahkan.",
    points: ["Pemilihan komponen yang cocok", "Wiring, penyolderan, dan perakitan", "Integrasi sensor, aktuator, dan catu daya", "Dites sebelum diserahkan"],
    fits: "Tugas praktikum, tugas akhir, robot dan mobil kit.",
  },
  {
    id: "pemrograman",
    short: "Jasa pemrograman",
    icon: Code2,
    title: "Jasa Pemrograman Mikrokontroler",
    body: "Kode program Arduino/ESP32 (C/C++) untuk membaca sensor, menggerakkan motor dan servo, hingga mengirim data ke dashboard IoT lewat WiFi, lengkap dengan penjelasan alurnya.",
    points: ["Kode Arduino dan ESP32 (C/C++)", "Baca sensor, gerakkan motor dan servo", "Kirim data ke dashboard IoT lewat WiFi", "Disertai penjelasan alur program"],
    fits: "Perangkat sudah dirakit tapi belum jalan, atau butuh fitur tambahan di kodenya.",
  },
  {
    id: "komponen",
    short: "Komponen",
    icon: ShoppingBag,
    title: "Komponen & Paket Proyek",
    body: "Komponen ready stock dengan harga mahasiswa, plus bundling paket proyek (mis. mobil kit) yang sudah dicek kecocokannya, sehingga tidak perlu takut salah beli modul.",
    points: ["Komponen ready stock", "Harga mahasiswa", "Paket proyek yang sudah dicek kecocokannya", "COD di area kampus"],
    fits: "Kamu yang mau merakit sendiri dan butuh komponennya cepat.",
  },
]

/**
 * Halaman Layanan: tiga layanan sebagai baris besar bernomor (nomornya sama dengan kartu Layanan di Beranda), tiap
 * baris punya jangkar sendiri. Baris yang dituju dari tautan (#rakit, #pemrograman, #komponen) nomornya terisi emas.
 */
export default function ServicesPage() {
  return (
    <LandingMotion>
      <section className="subpage" aria-labelledby="services-page-title">
        <div className="site-container">
          <PageEntrance>
            <SubpageHead id="services-page-title" backTo="/#services-core" title="Dirakit, Diprogram," accent="atau Komponennya Saja.">
              Pilih bantuan yang kamu perlukan, lalu konsultasikan kebutuhanmu lewat WhatsApp. Belum yakin butuh yang mana? Ceritakan saja proyekmu.
            </SubpageHead>
          </PageEntrance>

          {/* Menu lompat berbahan kaca bening. */}
          <AnchorIsland label="Daftar layanan" items={services.map(({ id, short }) => ({ id, label: short }))} />

          <div className="svcp-list">
            {services.map(({ id, icon: Icon, title, body, points, fits }, index) => (
              <ScrollReveal key={id}>
                <HashTarget className="svcp-item" id={id} labelledBy={`${id}-title`}>
                  <div className="svcp-title">
                    <span className="svcp-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <h2 id={`${id}-title`}><Icon aria-hidden="true" />{title}</h2>
                  </div>
                  <div className="svcp-body">
                    <p>{body}</p>
                    <ul>
                      {points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}
                    </ul>
                    <p className="svcp-fits"><strong>Cocok untuk:</strong> {fits}</p>
                    <div className="svcp-actions">
                      <a className="button-primary" href={whatsappLink(`Halo Microim, saya ingin konsultasi layanan ${title}.`)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle aria-hidden="true" />Konsultasi via WhatsApp
                      </a>
                      {id === "komponen" ? (
                        <Link className="button-secondary" href="/products">Lihat Katalog <ArrowRight aria-hidden="true" /></Link>
                      ) : (
                        <Link className="button-secondary" href="/contact">Isi Formulir Pengajuan</Link>
                      )}
                    </div>
                  </div>
                </HashTarget>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <OrderSteps />
    </LandingMotion>
  )
}

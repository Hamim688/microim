import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, AtSign, Mail, MapPin, MessageCircle, NotebookPen } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { RevealFlag } from "@/components/landing/reveal-flag"
import { SignalDivider } from "@/components/landing/signal-divider"
import { siteContact, siteSocials, whatsappLink } from "@/lib/site"

// Kalimat pembuka siap pakai: tiap balon membuka WhatsApp dengan pesan yang sudah terisi.
const starters = [
  "Mau tanya stok dan harga komponen.",
  "Butuh jasa rakit untuk tugas praktikum.",
  "Mau konsultasi proyek tugas akhir.",
  "Butuh bantuan pemrograman ESP32 atau Arduino.",
]

/**
 * Kontak (Beranda): penutup halaman. Kiri: ajakan, dua tombol, dan rincian kontak (termasuk media sosial).
 * Kanan: panel percakapan berisi kalimat pembuka yang bisa dipilih; balonnya muncul berurutan saat masuk layar.
 * Tepi atasnya berbentuk sinyal digital (lihat SignalDivider).
 */
export function ContactSection() {
  return (
    <section className="kontak-section" id="contact" aria-labelledby="contact-heading">
      <SignalDivider />
      <div className="site-container kontak-grid">
        <ScrollReveal className="kontak-copy">
          <h2 id="contact-heading">Punya Ide atau Tugas? <span>Ceritakan Saja.</span></h2>
          <p className="kontak-lead">Tugas praktikum, tugas akhir, atau proyek pribadi: cukup chat, kami bantu cek kebutuhan, pilihkan komponen, dan hitung perkiraan biayanya.</p>
          <div className="kontak-actions">
            <a className="button-primary" href={whatsappLink("Halo Microim, saya ingin bertanya tentang produk/jasa Microim.")} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />Chat via WhatsApp
            </a>
            <Link className="button-secondary" href="/contact"><NotebookPen aria-hidden="true" />Isi Formulir Pengajuan</Link>
          </div>
          <ul className="kontak-details">
            <li>
              <MessageCircle aria-hidden="true" />
              <span>WhatsApp</span>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">{siteContact.whatsappDisplay}</a>
            </li>
            <li>
              <Mail aria-hidden="true" />
              <span>Email</span>
              <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>
            </li>
            {siteSocials.map((social) => (
              <li key={social.name}>
                <AtSign aria-hidden="true" />
                <span>{social.name}</span>
                <a href={social.url} target="_blank" rel="noopener noreferrer">{social.handle}</a>
              </li>
            ))}
            <li>
              <MapPin aria-hidden="true" />
              <span>Lokasi</span>
              <p>{siteContact.location}</p>
            </li>
          </ul>
        </ScrollReveal>

        <RevealFlag className="kontak-chat" amount={0.3}>
          <div className="kontak-chat-top">
            <Image src="/logo/logo-baru.png" alt="" width={40} height={40} />
            <p><strong>Microim</strong><span>Pesan dibalas secepatnya</span></p>
          </div>
          <p className="kontak-bubble is-in" style={{ "--b": 0 } as CSSProperties}>Halo! Mau mulai dari mana? Pilih salah satu, pesannya langsung siap dikirim di WhatsApp.</p>
          <ul className="kontak-starters">
            {starters.map((text, index) => (
              <li key={text} style={{ "--b": index + 1 } as CSSProperties}>
                <a className="kontak-bubble is-out" href={whatsappLink(`Halo Microim. ${text}`)} target="_blank" rel="noopener noreferrer">
                  {text}<span className="sr-only"> Kirim lewat WhatsApp</span><ArrowUpRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </RevealFlag>
      </div>
    </section>
  )
}

import { CircuitBoard, MessageCircle, PackageCheck, Search } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { whatsappLink } from "@/lib/site"

const steps = [
  { icon: Search, title: "Pilih atau Ceritakan", text: "Pilih komponen dari katalog, atau ceritakan ide perangkat yang ingin kamu buat." },
  { icon: MessageCircle, title: "Chat lewat WhatsApp", text: "Kami bantu cek kebutuhan, rekomendasi komponen, dan perkiraan biayanya." },
  { icon: CircuitBoard, title: "Kami Siapkan", text: "Komponen disiapkan, atau perangkat dirakit dan diprogram sesuai kesepakatan." },
  { icon: PackageCheck, title: "Terima & Coba", text: "Perangkat siap dipakai. Kalau ada kendala, tinggal tanya lagi." },
]

export function OrderSteps() {
  return (
    <section className="steps-section" id="cara-pesan">
      <div className="site-container">
        <ScrollReveal className="section-heading centered-heading">
          <span className="section-kicker">CARA PESAN</span>
          <h2>Dari Ide ke Perangkat dalam 4 Langkah</h2>
          <p>Tanpa ribet. Semua obrolan cukup lewat WhatsApp.</p>
        </ScrollReveal>
        <ol className="steps-grid">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal key={title} delay={index * 0.08}>
              <li className="step-card">
                <div className="step-card-top">
                  <span className="step-number">0{index + 1}</span>
                  <span className="step-icon"><Icon aria-hidden="true" /></span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
        <div className="steps-action">
          <a className="button-primary" href={whatsappLink("Halo Microim, saya ingin bertanya tentang produk/jasa Microim.")} target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden="true" /> Chat Sekarang
          </a>
        </div>
      </div>
    </section>
  )
}

import type { CSSProperties } from "react"
import { CircuitBoard, MessageCircle, PackageCheck, Search } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { RevealFlag } from "@/components/landing/reveal-flag"

const steps = [
  { icon: Search, title: "Pilih atau ceritakan", text: "Pilih komponen dari katalog, atau ceritakan ide perangkat yang ingin kamu buat." },
  { icon: MessageCircle, title: "Chat lewat WhatsApp", text: "Kami bantu cek kebutuhan, rekomendasi komponen, dan perkiraan biayanya." },
  { icon: CircuitBoard, title: "Kami siapkan", text: "Komponen disiapkan, atau perangkat dirakit dan diprogram sesuai kesepakatan." },
  { icon: PackageCheck, title: "Terima dan coba", text: "Perangkat siap dipakai. Kalau ada kendala, tinggal tanya lagi." },
]

/**
 * Cara pesan: empat langkah di sepanjang satu jalur PCB. Saat masuk layar, jalur menyala emas dari langkah pertama
 * ke langkah terakhir dan tiap bantalan solder menyala ketika dilewati. Di tablet dan HP jalurnya menjadi tegak.
 * Dipakai di Beranda (lanjutan section Produk) serta halaman /about dan /services.
 */
export function OrderSteps() {
  return (
    <section className="steps-section" id="cara-pesan" aria-labelledby="steps-heading">
      <div className="site-container">
        <ScrollReveal className="steps-head">
          <h2 id="steps-heading">Dari Chat sampai Perangkat di Tanganmu</h2>
          <p>Empat langkah, tanpa ribet. Semua obrolan cukup lewat WhatsApp.</p>
        </ScrollReveal>

        <RevealFlag className="steps-flow" amount={0.3}>
          <ol className="steps-rail">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} style={{ "--s": index } as CSSProperties}>
                <i className="steps-pad" aria-hidden="true" />
                <span className="steps-num" aria-hidden="true">{index + 1}</span>
                <h3><Icon aria-hidden="true" />{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </RevealFlag>
      </div>
    </section>
  )
}

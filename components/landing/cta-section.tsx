import Link from "next/link"
import { ArrowUpRight, CircuitBoard, MessageSquareText } from "lucide-react"

export function CTASection() {
  return (
    <section className="cta-section" id="contact">
      <div className="cta-glow" aria-hidden="true" />
      <div className="cta-panel">
        <span className="section-kicker">WUJUDKAN GAGASAN BERSAMA</span>
        <CircuitBoard className="cta-mark" aria-hidden="true" />
        <h2>Siap Mewujudkan<br className="desktop-break" /> Solusi Teknologimu?</h2>
        <p>Diskusikan kebutuhan teknologi Anda bersama MikroIm.</p>
        <div className="cta-actions">
          <Link className="button-primary" href="/contact">Mulai Proyek <ArrowUpRight aria-hidden="true" /></Link>
          <Link className="button-secondary" href="/contact"><MessageSquareText aria-hidden="true" /> Kirim Pengajuan Proyek</Link>
        </div>
        <div className="cta-points"><span>Perangkat Keras &amp; IoT</span><i /><span>Sistem Tertanam</span><i /><span>Aplikasi Seluler</span></div>
      </div>
    </section>
  )
}

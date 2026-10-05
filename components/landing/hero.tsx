import Link from "next/link"
import Image from "next/image"
import { ArrowDown, ArrowUpRight, CircuitBoard, ShoppingBag, Wifi } from "lucide-react"
import { PointerField } from "@/components/landing/pointer-field"

function HardwareIllustration() {
  return (
      <div className="hero-board-frame" aria-label="Ilustrasi rangkaian IoT">
      <div className="hero-board-topline">
        <span><i /> SISTEM / INTI</span>
        <span className="hero-board-status"><Wifi aria-hidden="true" /> TELEMETRI AKTIF</span>
      </div>
      <div className="hero-board-image-wrap">
        <Image
          className="hero-board-art"
          src="/images/iot-board-hero.png"
          alt="Rangkaian perangkat IoT MikroIm dengan mikrokontroler dan sensor"
          width={1536}
          height={1024}
          sizes="(max-width: 760px) 100vw, 55vw"
          priority
        />
      </div>
      <div className="hero-board-footer">
        <span><CircuitBoard aria-hidden="true" /> SISTEM PERANGKAT</span>
        <span>PERANGKAT + SISTEM TERTANAM + KONEKTIVITAS</span>
        <span className="hero-bars"><i /><i /><i /><i /><i /></span>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-circuit-grid" aria-hidden="true" />
      <PointerField className="hero-pointer-field">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="status-light" /> SOLUSI IOT &amp; PERANGKAT KERAS MASA DEPAN</div>
            <h1>Menghubungkan Ide Lewat <span>Teknologi Cerdas</span></h1>
            <p>MikroIm mewujudkan gagasan melalui IoT, sistem tertanam, dan perangkat digital untuk menciptakan inovasi masa depan.</p>
            <div className="hero-actions">
              <Link className="button-primary" href="/contact">Konsultasikan Proyek <ArrowUpRight aria-hidden="true" /></Link>
              <Link className="button-secondary" href="/products"><ShoppingBag aria-hidden="true" /> Lihat Produk</Link>
            </div>
            <div className="hero-tags" aria-label="Bidang teknologi utama"><span><i /> Sistem IoT</span><span><i /> Purwarupa Kustom</span><span><i /> Perangkat hingga Aplikasi</span></div>
            <a className="hero-scroll" href="#about"><ArrowDown aria-hidden="true" /> GULIR UNTUK MELIHAT</a>
          </div>
          <div className="hero-visual"><HardwareIllustration /></div>
        </div>
      </PointerField>
      <div className="hero-bottom-line" aria-hidden="true" />
    </section>
  )
}

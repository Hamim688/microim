import Link from "next/link"
import Image from "next/image"
import { ArrowDown, ArrowUpRight, CircuitBoard, ShoppingBag, Wifi } from "lucide-react"
import { PointerField } from "@/components/landing/pointer-field"

function HardwareIllustration() {
  return (
    <div className="hero-board-frame" aria-label="Illustration of an IoT circuit board">
      <div className="hero-board-topline">
        <span><i /> SYSTEM / CORE</span>
        <span className="hero-board-status"><Wifi aria-hidden="true" /> TELEMETRY ACTIVE</span>
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
        <span><CircuitBoard aria-hidden="true" /> EDGE SYSTEMS</span>
        <span>HW + FW + CONNECTIVITY</span>
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
            <div className="eyebrow hero-eyebrow"><span className="status-light" /> NEXT-GEN IOT &amp; HARDWARE SOLUTIONS</div>
            <h1>Connecting Ideas Through <span>Intelligent Technology</span></h1>
            <p>MikroIm menghadirkan solusi teknologi melalui IoT, embedded system, dan pengembangan perangkat digital untuk menciptakan inovasi masa depan.</p>
            <div className="hero-actions">
              <Link className="button-primary" href="/contact">Konsultasikan Proyek <ArrowUpRight aria-hidden="true" /></Link>
              <Link className="button-secondary" href="/products"><ShoppingBag aria-hidden="true" /> Lihat Produk</Link>
            </div>
            <div className="hero-tags" aria-label="Core technology areas"><span><i /> IoT Systems</span><span><i /> Custom Prototyping</span><span><i /> Edge to App</span></div>
            <a className="hero-scroll" href="#about"><ArrowDown aria-hidden="true" /> SCROLL TO EXPLORE</a>
          </div>
          <div className="hero-visual"><HardwareIllustration /></div>
        </div>
      </PointerField>
      <div className="hero-bottom-line" aria-hidden="true" />
    </section>
  )
}

import Link from "next/link"
import { ArrowDown, ArrowUpRight, CircuitBoard, Cpu, Wifi } from "lucide-react"

function HardwareIllustration() {
  return (
    <div className="hero-board-frame" aria-label="Illustration of an IoT circuit board">
      <div className="hero-board-topline">
        <span><i /> SYSTEM / CORE</span>
        <span className="hero-board-status"><Wifi aria-hidden="true" /> TELEMETRY ACTIVE</span>
      </div>
      <svg className="hero-board-art" viewBox="0 0 680 430" role="img" aria-labelledby="board-title board-desc">
        <title id="board-title">MikroIm IoT hardware system</title>
        <desc id="board-desc">A circuit board connected to sensors, a microcontroller, and wireless telemetry.</desc>
        <defs>
          <linearGradient id="board" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#1B3658"/><stop offset="1" stopColor="#071426"/></linearGradient>
          <linearGradient id="chip" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#355276"/><stop offset="1" stopColor="#101F33"/></linearGradient>
          <linearGradient id="trace" x1="0" x2="1"><stop stopColor="#FFC928" stopOpacity=".1"/><stop offset=".5" stopColor="#FFC928"/><stop offset="1" stopColor="#FFC928" stopOpacity=".18"/></linearGradient>
          <filter id="boardGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
          <pattern id="boardGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#55708f" strokeOpacity=".12" strokeWidth="1"/></pattern>
        </defs>
        <ellipse cx="340" cy="220" rx="245" ry="143" fill="#FFC928" opacity=".12" filter="url(#boardGlow)"/>
        <path d="M111 234c25-79 104-133 224-134 104 0 196 39 233 94 29 44-8 108-73 133-94 37-254 52-348 1-34-18-49-54-36-94Z" fill="none" stroke="#FFC928" strokeOpacity=".6" strokeWidth="2"/>
        <path d="M130 245c36-62 101-106 207-111 95-4 175 24 211 66" fill="none" stroke="#ffe08a" strokeOpacity=".35" strokeWidth="1" strokeDasharray="4 8"/>
        <g transform="translate(151 97) rotate(-8 190 120)">
          <path d="m28 45 376-24 81 53-19 212-376 26-78-57 16-210Z" fill="url(#board)" stroke="#52708f" strokeWidth="2"/>
          <path d="m28 45 376-24 81 53-19 212-376 26-78-57 16-210Z" fill="url(#boardGrid)" opacity=".9"/>
          <path d="m28 45 78 53-16 210m314-287 81 53m-81-53-18 211m-296-134 94-7 25 18m-119 56 73-4 23 16m148-130 76-5m-87 166 91-7m-246-42 88-6 27-31m153 63-83 6-22 28" fill="none" stroke="url(#trace)" strokeWidth="3"/>
          <g fill="#071426" stroke="#91a6c0" strokeWidth="2"><rect x="164" y="91" width="122" height="108" rx="8"/><rect x="320" y="81" width="48" height="42" rx="5"/><rect x="89" y="199" width="60" height="42" rx="5"/><rect x="317" y="206" width="77" height="45" rx="5"/></g>
          <rect x="175" y="102" width="100" height="86" rx="4" fill="url(#chip)" stroke="#FFC928" strokeOpacity=".6"/>
          <path d="M185 112h80v66h-80z" fill="none" stroke="#a9bdd6" strokeOpacity=".3"/>
          <text x="225" y="142" textAnchor="middle" fill="#eaf1ff" fontFamily="monospace" fontSize="13" letterSpacing="2">MIKROIM</text>
          <text x="225" y="163" textAnchor="middle" fill="#FFC928" fontFamily="monospace" fontSize="9" letterSpacing="2">IOT / MCU</text>
          <g fill="#b8c8dd" opacity=".8"><rect x="153" y="107" width="8" height="5"/><rect x="153" y="120" width="8" height="5"/><rect x="153" y="133" width="8" height="5"/><rect x="153" y="146" width="8" height="5"/><rect x="153" y="159" width="8" height="5"/><rect x="153" y="172" width="8" height="5"/><rect x="289" y="107" width="8" height="5"/><rect x="289" y="120" width="8" height="5"/><rect x="289" y="133" width="8" height="5"/><rect x="289" y="146" width="8" height="5"/><rect x="289" y="159" width="8" height="5"/><rect x="289" y="172" width="8" height="5"/></g>
          <g fill="#FFC928"><circle cx="45" cy="60" r="4"/><circle cx="455" cy="87" r="4"/><circle cx="433" cy="266" r="4"/><circle cx="92" cy="289" r="4"/></g>
          <g stroke="#c1cddd" strokeWidth="2" opacity=".7"><path d="M59 83v49m8-49v49m8-49v49m8-49v49M420 119v48m8-48v48m8-48v48m8-48v48M187 220v22m9-22v22m9-22v22m9-22v22m9-22v22"/></g>
          <g fill="#122944" stroke="#8398b3"><rect x="319" y="139" width="55" height="40" rx="4"/><rect x="96" y="126" width="39" height="45" rx="4"/><rect x="403" y="188" width="31" height="38" rx="3"/></g>
          <g fill="#e2b64b"><rect x="336" y="148" width="8" height="8" rx="1"/><rect x="351" y="148" width="8" height="8" rx="1"/><rect x="336" y="162" width="8" height="8" rx="1"/><rect x="351" y="162" width="8" height="8" rx="1"/></g>
        </g>
        <g fill="#FFC928"><circle cx="102" cy="136" r="3"/><circle cx="577" cy="279" r="3"/><circle cx="521" cy="96" r="2"/></g>
      </svg>
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
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="status-light" /> NEXT-GEN IOT &amp; HARDWARE SOLUTIONS</div>
          <h1>Connecting Ideas Through <span>Intelligent Technology</span></h1>
          <p>MikroIm menghadirkan solusi teknologi melalui IoT, embedded system, dan pengembangan perangkat digital untuk menciptakan inovasi masa depan.</p>
          <div className="hero-actions">
            <Link className="button-primary" href="/contact">Konsultasikan Proyek <ArrowUpRight aria-hidden="true" /></Link>
            <Link className="button-secondary" href="#services-core"><Cpu aria-hidden="true" /> Explore Solutions</Link>
          </div>
          <div className="hero-tags" aria-label="Core technology areas"><span><i /> IoT Systems</span><span><i /> Custom Prototyping</span><span><i /> Edge to App</span></div>
          <a className="hero-scroll" href="#about"><ArrowDown aria-hidden="true" /> SCROLL TO EXPLORE</a>
        </div>
        <div className="hero-visual"><HardwareIllustration /></div>
      </div>
      <div className="hero-bottom-line" aria-hidden="true" />
    </section>
  )
}

import Link from "next/link"
import { ArrowUpRight, CircuitBoard, MessageSquareText } from "lucide-react"

export function CTASection() {
  return (
    <section className="cta-section" id="contact">
      <div className="cta-glow" aria-hidden="true" />
      <div className="cta-panel">
        <span className="section-kicker">LET’S BUILD SOMETHING MEANINGFUL</span>
        <CircuitBoard className="cta-mark" aria-hidden="true" />
        <h2>Ready to Build Your<br className="desktop-break" /> Technology Solution?</h2>
        <p>Diskusikan kebutuhan teknologi Anda bersama MikroIm.</p>
        <div className="cta-actions">
          <Link className="button-primary" href="/contact">Start Your Project <ArrowUpRight aria-hidden="true" /></Link>
          <Link className="button-secondary" href="/contact"><MessageSquareText aria-hidden="true" /> Send a Project Inquiry</Link>
        </div>
        <div className="cta-points"><span>Hardware &amp; IoT</span><i /><span>Embedded Systems</span><i /><span>Mobile Applications</span></div>
      </div>
    </section>
  )
}

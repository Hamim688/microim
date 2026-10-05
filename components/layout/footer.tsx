import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Cpu } from "lucide-react"

const links = [
  { label: "Home", href: "/" },
  { label: "About MikroIm", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <Link href="/" className="footer-brand flex items-center gap-3.5 mb-4" aria-label="MikroIm home">
              <Image src="/logo/logo-baru.png" alt="MikroIm Technology and IoT Lab" width={48} height={48} quality={100} className="rounded-2xl" />
              <span className="text-white font-bold tracking-normal" style={{ fontSize: '1.45rem', fontFamily: 'var(--font-body)' }}>MikroIm</span>
            </Link>
            <p>Connecting ideas, hardware, software, and intelligent technology.</p>
            <blockquote>“Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global.”</blockquote>
          </div>
          <div className="footer-column"><h2>Quick Links</h2><ul>{links.map(({ label, href }) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul></div>
          <div className="footer-column"><h2>Engineering</h2><ul><li><Link href="/services">Hardware &amp; IoT Development</Link></li><li><Link href="/services">Embedded System Programming</Link></li><li><Link href="/services">Mobile Application Development</Link></li><li><Link href="/products">IoT Products</Link></li></ul></div>
          <div className="footer-column footer-contact"><h2>Contact MikroIm</h2><p>Have a technology idea to discuss?</p><Link className="footer-contact-link" href="/contact">Start a conversation <ArrowUpRight aria-hidden="true" /></Link><span className="footer-engineering-mark"><Cpu aria-hidden="true" /> HARDWARE + SOFTWARE</span></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} MikroIm. All rights reserved.</span><span>Technology Engineering &amp; IoT</span></div>
      </div>
    </footer>
  )
}

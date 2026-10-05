import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Cpu } from "lucide-react"

const links = [
  { label: "Beranda", href: "/" },
  { label: "Tentang MikroIm", href: "/about" },
  { label: "Layanan", href: "/services" },
  { label: "Proyek", href: "/projects" },
  { label: "Kontak", href: "/contact" },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <Link href="/" className="footer-brand" aria-label="Beranda MikroIm"><Image src="/logo/mikroim-logo.svg" alt="Laboratorium Teknologi dan IoT MikroIm" width={320} height={80} /></Link>
            <p>Menghubungkan gagasan, perangkat keras, perangkat lunak, dan teknologi cerdas.</p>
            <blockquote>“Menjadi perusahaan yang mendorong pengembangan dan pembelajaran teknologi informasi hingga mendunia.”</blockquote>
          </div>
          <div className="footer-column"><h2>Tautan</h2><ul>{links.map(({ label, href }) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul></div>
          <div className="footer-column"><h2>Rekayasa</h2><ul><li><Link href="/services">Pengembangan Perangkat &amp; IoT</Link></li><li><Link href="/services">Pemrograman Sistem Tertanam</Link></li><li><Link href="/services">Pembuatan Aplikasi Seluler</Link></li><li><Link href="/products">Produk IoT</Link></li></ul></div>
          <div className="footer-column footer-contact"><h2>Kontak MikroIm</h2><p>Ada gagasan teknologi yang ingin dibahas?</p><Link className="footer-contact-link" href="/contact">Mari berdiskusi <ArrowUpRight aria-hidden="true" /></Link><span className="footer-engineering-mark"><Cpu aria-hidden="true" /> PERANGKAT KERAS + LUNAK</span></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} MikroIm. Hak cipta dilindungi.</span><span>Rekayasa Teknologi &amp; IoT</span></div>
      </div>
    </footer>
  )
}

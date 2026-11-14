import Image from "next/image"
import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"
import { SocialIcon } from "@/components/icons/social-icon"
import { siteConfig, siteContact, siteSocials, whatsappLink } from "@/lib/site"

const links = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/about" },
  { label: "Layanan", href: "/services" },
  { label: "Produk", href: "/products" },
  { label: "Proyek", href: "/projects" },
  { label: "Kontak", href: "/contact" },
]

/**
 * Footer ramping: merek + tagline, tautan halaman, dan kontak singkat (footer tampil di semua halaman, jadi kontak
 * tetap ada walau Beranda sudah punya section Kontak). Baris bawah: hak cipta dan lokasi.
 */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div className="footer-brand-block">
            <Link href="/" className="footer-brand" aria-label="Beranda Microim">
              <Image src="/logo/logo-baru.png" alt="" width={48} height={48} quality={100} />
              <span>Microim</span>
            </Link>
            <p className="footer-tagline">{siteConfig.tagline}</p>
            <p className="footer-about">Komponen IoT siap COD di area kampus, plus jasa rakit dan pemrograman mikrokontroler.</p>
          </div>

          <nav className="footer-nav" aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title">Halaman</h2>
            <ul>
              {links.map(({ label, href }) => <li key={label}><Link href={href}>{label}</Link></li>)}
            </ul>
          </nav>

          <div className="footer-contact">
            <h2>Hubungi kami</h2>
            <ul>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />{siteContact.whatsappDisplay}</a></li>
              <li><a href={`mailto:${siteContact.email}`}><Mail aria-hidden="true" />{siteContact.email}</a></li>
              {siteSocials.map((social) => (
                <li key={social.name}><a href={social.url} target="_blank" rel="noopener noreferrer"><SocialIcon name={social.name} />{social.handle}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Microim. Hak cipta dilindungi.</span>
          <span>{siteContact.location}</span>
        </div>
      </div>
    </footer>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

const navLinks = [
  { name: "Beranda", href: "/", activePath: "/" },
  { name: "Tentang", href: "/#about", activePath: "/about" },
  { name: "Layanan", href: "/#services-core", activePath: "/services" },
  { name: "Produk", href: "/products", activePath: "/products" },
  { name: "Proyek", href: "/#projects", activePath: "/projects" },
  { name: "Kontak", href: "/#contact", activePath: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-link flex items-center gap-3" aria-label="Beranda MikroIm" onClick={() => setIsOpen(false)}>
          <Image src="/logo/logo-baru.png" alt="Laboratorium Teknologi dan IoT MikroIm" width={40} height={40} priority quality={100} className="rounded-2xl" />
          <span className="text-white font-bold tracking-normal" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-body)' }}>MikroIm</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navLinks.map(({ name, href, activePath }) => {
            const isActive = pathname === activePath
            return <Link aria-current={isActive ? "page" : undefined} className={isActive ? "active" : ""} href={href} key={name}>{name}</Link>
          })}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">Mulai Proyek <ArrowUpRight aria-hidden="true" /></Link>
          <button className="mobile-menu-button" type="button" aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav className={`mobile-nav${isOpen ? " is-open" : ""}`} id="mobile-navigation" aria-label="Navigasi seluler" aria-hidden={!isOpen}>
        {navLinks.map(({ name, href }) => <Link href={href} key={name} onClick={() => setIsOpen(false)}>{name}</Link>)}
        <Link className="mobile-nav-cta" href="/contact" onClick={() => setIsOpen(false)}>Mulai Proyek <ArrowUpRight aria-hidden="true" /></Link>
      </nav>
    </header>
  )
}

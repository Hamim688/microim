"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react"

const navLinks = [
  { name: "Beranda", href: "/", sectionId: "home", activePath: "/" },
  { name: "Tentang", href: "/#about", sectionId: "about", activePath: "/about" },
  { name: "Layanan", href: "/#services-core", sectionId: "services-core", activePath: "/services" },
  { name: "Produk", href: "/#products", sectionId: "products", activePath: "/products" },
  { name: "Proyek", href: "/#projects", sectionId: "projects", activePath: "/projects" },
  { name: "Kontak", href: "/#contact", sectionId: "contact", activePath: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("home")
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      if (pathname === "/") {
        const sections = ["contact", "projects", "products", "services-core", "about", "home"]
        const scrollPosition = window.scrollY + 140

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId)
          if (element) {
            const top = element.offsetTop
            const height = element.offsetHeight
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId)
              break
            }
          }
        }
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  return (
    <header className={`site-header transition-all duration-300 ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="site-header-inner">
        <Link href="/" className="brand-link flex items-center gap-3" aria-label="Beranda MikroIm" onClick={() => setIsOpen(false)}>
          <Image src="/logo/logo-baru.png" alt="Laboratorium Teknologi dan IoT MikroIm" width={40} height={40} priority quality={100} className="rounded-2xl" />
          <span className="text-white font-bold tracking-normal" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-body)' }}>MikroIm</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {navLinks.map(({ name, href, sectionId, activePath }) => {
            const isActive = pathname === "/" 
              ? (activeSection === sectionId || (!activeSection && sectionId === "home"))
              : (pathname === activePath || (pathname.startsWith(activePath) && activePath !== "/"))

            return (
              <Link 
                aria-current={isActive ? "page" : undefined} 
                className={isActive ? "active" : ""} 
                href={href} 
                key={name}
              >
                {name}
              </Link>
            )
          })}
        </nav>
        <div className="header-actions">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-[#FFC928] border border-[#173359] hover:border-[#FFC928]/40 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FFC928]" />
            <span>Masuk</span>
          </Link>
          <Link className="header-cta" href="/contact">Mulai Proyek <ArrowUpRight aria-hidden="true" /></Link>
          <button className="mobile-menu-button" type="button" aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav className={`mobile-nav${isOpen ? " is-open" : ""}`} id="mobile-navigation" aria-label="Navigasi seluler" aria-hidden={!isOpen}>
        {navLinks.map(({ name, href, sectionId, activePath }) => {
          const isActive = pathname === "/" 
            ? (activeSection === sectionId || (!activeSection && sectionId === "home"))
            : (pathname === activePath || (pathname.startsWith(activePath) && activePath !== "/"))

          return (
            <Link 
              href={href} 
              key={name} 
              className={isActive ? "active text-[#FFC928] font-bold" : ""} 
              onClick={() => setIsOpen(false)}
            >
              {name}
            </Link>
          )
        })}
        <Link className="mobile-nav-cta" href="/login" onClick={() => setIsOpen(false)}>
          <LogIn className="w-4 h-4 text-[#FFC928]" /> Masuk Akun
        </Link>
        <Link className="mobile-nav-cta" href="/contact" onClick={() => setIsOpen(false)}>Mulai Proyek <ArrowUpRight aria-hidden="true" /></Link>
      </nav>
    </header>
  )
}

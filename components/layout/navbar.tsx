"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { motion } from "motion/react"

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
  const headerRef = useRef<HTMLElement>(null)

  // Menu HP: tutup dengan Esc atau ketukan di luar header.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [isOpen])
  const [activeSection, setActiveSection] = useState<string>("home")
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Saat menu diklik, pil langsung pindah ke tujuan dan scroll spy "dikunci"
  // sampai scroll halus selesai, supaya pil tidak mampir ke section yang dilewati.
  const lockRef = useRef<string | null>(null)
  const unlockTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const computeActive = () => {
      const marker = window.innerHeight * 0.35
      let current = "home"
      for (const { sectionId } of navLinks) {
        const element = document.getElementById(sectionId)
        if (element && element.getBoundingClientRect().top <= marker) current = sectionId
      }
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      return nearBottom ? "contact" : current
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (pathname !== "/") return
      if (lockRef.current) {
        window.clearTimeout(unlockTimer.current)
        unlockTimer.current = window.setTimeout(() => {
          lockRef.current = null
          setActiveSection(computeActive())
        }, 160)
        return
      }
      setActiveSection(computeActive())
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.clearTimeout(unlockTimer.current)
    }
  }, [pathname])

  const closeTimer = useRef<number | undefined>(undefined)
  const selectSection = (sectionId: string) => {
    // Di HP, beri waktu pil emas meluncur ke menu tujuan sebelum menu ditutup.
    window.clearTimeout(closeTimer.current)
    if (isOpen) closeTimer.current = window.setTimeout(() => setIsOpen(false), 380)
    if (pathname !== "/") return
    lockRef.current = sectionId
    setActiveSection(sectionId)
    window.clearTimeout(unlockTimer.current)
    unlockTimer.current = window.setTimeout(() => {
      lockRef.current = null
    }, 1500)
  }

  return (
    <header ref={headerRef} className={`site-header transition-all duration-300 ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="site-header-inner">
        <Link href="/" className="brand-link flex items-center gap-3" aria-label="Beranda Microim" onClick={() => setIsOpen(false)}>
          <Image src="/logo/logo-baru.png" alt="Logo Microim" width={40} height={40} priority quality={100} className="rounded-2xl" />
          <span className="text-white font-bold tracking-normal" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-body)' }}>Microim</span>
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
                onClick={() => selectSection(sectionId)}
              >
                {isActive ? <motion.span className="nav-pill" layoutId="nav-pill" transition={{ type: "spring", bounce: 0, duration: 0.6 }} /> : null}
                <span className="nav-label">{name}</span>
              </Link>
            )
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
        {navLinks.map(({ name, href, sectionId, activePath }) => {
          const isActive = pathname === "/"
            ? (activeSection === sectionId || (!activeSection && sectionId === "home"))
            : (pathname === activePath || (pathname.startsWith(activePath) && activePath !== "/"))

          return (
            <Link
              href={href}
              key={name}
              className={isActive ? "active" : ""}
              aria-current={isActive ? "page" : undefined}
              tabIndex={isOpen ? undefined : -1}
              onClick={() => selectSection(sectionId)}
            >
              {isActive ? <motion.span className="nav-pill" layoutId="mobile-nav-pill" transition={{ type: "spring", bounce: 0, duration: 0.45 }} /> : null}
              <span className="nav-label">{name}</span>
            </Link>
          )
        })}
        <Link className="mobile-nav-cta" href="/contact" tabIndex={isOpen ? undefined : -1} onClick={() => setIsOpen(false)}>Mulai Proyek <ArrowUpRight aria-hidden="true" /></Link>
      </nav>
    </header>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services-core" },
  { name: "Products", href: "/products" },
  { name: "Projects", href: "/#projects" },
  { name: "Contact", href: "/#contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-link" aria-label="MikroIm home" onClick={() => setIsOpen(false)}>
          <Image src="/logo/mikroim-logo.svg" alt="MikroIm Technology and IoT Lab" width={320} height={80} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map(({ name, href }, index) => {
            const isActive = (index === 0 && pathname === "/") || pathname === `/${name.toLowerCase()}`
            return <Link aria-current={isActive ? "page" : undefined} className={isActive ? "active" : ""} href={href} key={name}>{name}</Link>
          })}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">Start Your Project <ArrowUpRight aria-hidden="true" /></Link>
          <button className="mobile-menu-button" type="button" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav className={`mobile-nav${isOpen ? " is-open" : ""}`} id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!isOpen}>
        {navLinks.map(({ name, href }) => <Link href={href} key={name} onClick={() => setIsOpen(false)}>{name}</Link>)}
        <Link className="mobile-nav-cta" href="/contact" onClick={() => setIsOpen(false)}>Start Your Project <ArrowUpRight aria-hidden="true" /></Link>
      </nav>
    </header>
  )
}

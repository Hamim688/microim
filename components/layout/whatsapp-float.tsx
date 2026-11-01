"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { whatsappLink } from "@/lib/site"

const hiddenOn = ["/admin", "/login", "/contact"]

function SmileyChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Balon chat */}
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" strokeWidth="1.9" />
      {/* Sepasang mata senyum dengan jarak jeda lega (◠   ◠) */}
      <path d="M7 11.5c.8-2 2.2-2 3 0" strokeWidth="2.1" />
      <path d="M14 11.5c.8-2 2.2-2 3 0" strokeWidth="2.1" />
    </svg>
  )
}

export function WhatsappFloat() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (hiddenOn.some((path) => pathname.startsWith(path))) return null

  return (
    <aside aria-label="Bantuan WhatsApp" className={`whatsapp-float-wrap${visible ? " is-visible" : ""}`}>
      <a
        className="whatsapp-float"
        href={whatsappLink("Halo Microim, saya ingin berkonsultasi mengenai proyek/produk.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi cepat lewat WhatsApp"
        tabIndex={visible ? 0 : -1}
      >
        <SmileyChatIcon className="whatsapp-icon" />
        <span className="whatsapp-label">Konsultasi WA</span>
      </a>
    </aside>
  )
}

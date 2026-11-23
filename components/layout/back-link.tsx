"use client"

import { useEffect, useRef, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

// Jumlah perpindahan halaman di dalam situs sejak dibuka. Lebih dari 0 berarti ada halaman sebelumnya di situs ini,
// jadi "Kembali" boleh memakai riwayat browser (posisi gulir halaman sebelumnya ikut dipulihkan).
const visits = { count: 0 }

/**
 * Dipasang sekali di kerangka situs: mencatat setiap perpindahan halaman (bukan perpindahan section/#) dan
 * menerapkan scroll halus hanya untuk tautan #anchor di halaman yang sama, supaya perpindahan antar-halaman / Kembali
 * langsung mendarat di posisi tujuan tanpa menggulir dari atas Beranda.
 */
export function RouteWatcher() {
  const pathname = usePathname()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) first.current = false
    else visits.count += 1
  }, [pathname])

  useEffect(() => {
    const onClick = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin || !url.hash || url.pathname !== window.location.pathname) return
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (!target) return
      event.preventDefault()
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
      window.history.pushState(null, "", url.hash)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}

/**
 * Tautan "Kembali": kembali ke tempat terakhir pengunjung berada (halaman dan posisi gulirnya), bukan ke atas Beranda.
 * Jika halaman ini dibuka langsung (tidak ada halaman sebelumnya di situs), menuju `fallback`, yaitu section yang
 * sesuai di Beranda.
 */
export function BackLink({ fallback, className, label = "Kembali" }: { fallback: string; className?: string; label?: string }) {
  const router = useRouter()
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (visits.count === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    router.back()
  }
  return (
    <Link href={fallback} className={className} onClick={onClick}>
      <ArrowLeft aria-hidden="true" />{label}
    </Link>
  )
}

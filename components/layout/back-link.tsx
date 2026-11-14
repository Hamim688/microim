"use client"

import { useEffect, useRef, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

// Jumlah perpindahan halaman di dalam situs sejak dibuka. Lebih dari 0 berarti ada halaman sebelumnya di situs ini,
// jadi "Kembali" boleh memakai riwayat browser (posisi gulir halaman sebelumnya ikut dipulihkan).
const visits = { count: 0 }

/** Dipasang sekali di kerangka situs: mencatat setiap perpindahan halaman (bukan perpindahan section/#). */
export function RouteWatcher() {
  const pathname = usePathname()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) first.current = false
    else visits.count += 1
  }, [pathname])
  return null
}

/**
 * Tautan "Kembali": kembali ke tempat terakhir pengunjung berada (halaman dan posisi gulirnya), bukan ke atas Beranda.
 * Jika halaman ini dibuka langsung (tidak ada halaman sebelumnya di situs), menuju `fallback`, yaitu section yang
 * sesuai di Beranda.
 */
export function BackLink({ fallback, className }: { fallback: string; className?: string }) {
  const router = useRouter()
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (visits.count === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    router.back()
  }
  return (
    <Link href={fallback} className={className} onClick={onClick}>
      <ArrowLeft aria-hidden="true" />Kembali
    </Link>
  )
}

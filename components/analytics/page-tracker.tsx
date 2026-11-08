"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/** Mengirim satu catatan kunjungan setiap pindah halaman (situs publik saja). Menghormati "Do Not Track". */
export function PageTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_TRACK_DEV) return
    if (navigator.doNotTrack === "1") return
    const data = JSON.stringify({ path: pathname, referrer: document.referrer })
    if (!navigator.sendBeacon?.("/api/track", new Blob([data], { type: "application/json" }))) {
      fetch("/api/track", { method: "POST", body: data, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {})
    }
  }, [pathname])
  return null
}

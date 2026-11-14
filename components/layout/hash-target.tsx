"use client"

import { useSyncExternalStore, type ReactNode } from "react"

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

/**
 * <article> yang mendapat kelas "is-target" saat alamat halaman menunjuk ke `id`-nya (mis. /services#rakit).
 * Dipakai sebagai ganti selektor CSS `:target`, yang tidak ikut berubah saat berpindah halaman tanpa muat ulang.
 */
export function HashTarget({ id, className, labelledBy, children }: { id: string; className: string; labelledBy?: string; children: ReactNode }) {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "")
  return (
    <article id={id} className={`${className}${hash === `#${id}` ? " is-target" : ""}`} aria-labelledby={labelledBy}>
      {children}
    </article>
  )
}

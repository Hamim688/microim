"use client"

import type { ReactNode } from "react"
import { useRevealOnScroll } from "@/components/landing/landing-motion"

/**
 * Pembungkus ringan: menambahkan kelas "is-live" selama elemen terlihat di layar (dan melepasnya saat sudah
 * sepenuhnya keluar), supaya urutan animasinya bisa diatur lewat CSS dan berulang tiap kali masuk layar.
 */
export function RevealFlag({ children, className = "", amount = 0.25 }: { children: ReactNode; className?: string; amount?: number }) {
  const [ref, state] = useRevealOnScroll<HTMLDivElement>(amount)
  return (
    <div ref={ref} className={`${className}${state === "show" ? " is-live" : ""}`}>
      {children}
    </div>
  )
}

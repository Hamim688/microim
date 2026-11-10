"use client"

import { useEffect, useRef } from "react"

/**
 * Memutar ulang animasi masuk hero setiap kali hero masuk layar lagi (kembali dari bawah / klik "Beranda").
 * Reset dilakukan diam-diam saat hero sudah di luar layar; saat masuk lagi, elemen datang dari atas
 * (searah scroll ke atas). Animasi saat halaman pertama dibuka tidak berubah.
 */
export function HeroReplay() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const hero = ref.current?.closest<HTMLElement>(".hero-section")
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const leave = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) hero.classList.add("is-reset", "is-replay")
      },
      { threshold: 0 },
    )
    const enter = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.24) hero.classList.remove("is-reset")
      },
      { threshold: 0.25 },
    )
    leave.observe(hero)
    enter.observe(hero)
    return () => {
      leave.disconnect()
      enter.disconnect()
    }
  }, [])

  return <span ref={ref} hidden />
}

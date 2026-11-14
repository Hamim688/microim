"use client"

import type { CSSProperties } from "react"
import { useRevealOnScroll } from "@/components/landing/landing-motion"

const VISION = "Menjadi perusahaan yang mendorong pengembangan dan pembelajaran Teknologi IT di level global."
// Kata penutup yang ditonjolkan dengan warna emas.
const KEY_FROM = VISION.split(" ").length - 2

/**
 * Visi Microim sebagai satu pernyataan besar (dipakai di Beranda & halaman /about). Saat masuk layar,
 * kalimatnya "menyala" kata demi kata; pembaca layar tetap menerima kalimat utuh.
 */
export function VisionStatement() {
  const [ref, state] = useRevealOnScroll<HTMLElement>(0.45)
  const words = VISION.split(" ")
  return (
    <figure ref={ref} className={`vision-statement${state === "show" ? " is-live" : ""}`}>
      <figcaption>Visi Microim</figcaption>
      <blockquote>
        <p aria-label={`“${VISION}”`}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              aria-hidden="true"
              className={`vision-word${index >= KEY_FROM ? " is-key" : ""}`}
              style={{ "--w": index } as CSSProperties}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </blockquote>
    </figure>
  )
}

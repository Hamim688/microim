import type { CSSProperties } from "react"
import { RevealFlag } from "@/components/landing/reveal-flag"

/** Jumlah LED; strip lebih lebar dari layar terlebar, sisanya terpotong di tepi kanan. */
const LEDS = 64

/**
 * Pembatas Proyek → Ulasan: strip LED sepanjang tepi atas section Ulasan. Saat masuk layar, LED menyala emas satu per
 * satu dari kiri ke kanan, seperti bintang rating yang terisi. Ujung kiri strip punya konektor kecil.
 */
export function LedStripDivider() {
  return (
    <RevealFlag className="led-strip" amount={0.6}>
      <span className="led-strip-plug" aria-hidden="true" />
      <ul className="led-strip-row" aria-hidden="true">
        {Array.from({ length: LEDS }, (_, i) => (
          <li key={i} style={{ "--i": i } as CSSProperties}><i /></li>
        ))}
      </ul>
    </RevealFlag>
  )
}

import { RevealFlag } from "@/components/landing/reveal-flag"

// Satu periode sinyal digital (lebar 360px, berulang): lebar pulsa tidak seragam, seperti bit data yang dikirim.
const WAVE = "M0 26 H40 V8 H100 V26 H130 V8 H160 V26 H230 V8 H300 V26 H360"
const HEIGHT = 36

/**
 * Pembatas Proyek → Kontak: tepi atas section Kontak berbentuk sinyal digital (HIGH/LOW). Garis emasnya tersapu dari
 * kiri ke kanan setiap kali masuk layar. Polanya memakai ukuran piksel asli (bukan diregangkan), jadi tebal garis
 * tegak dan mendatar selalu sama di semua lebar layar. Diletakkan di awal section Kontak dan ditarik ke atas
 * setinggi dirinya, sehingga celah sinyalnya memperlihatkan latar section Proyek.
 */
export function SignalDivider() {
  return (
    <RevealFlag className="signal-divider" amount={0.9}>
      <svg className="signal-fill-layer" width="100%" height={HEIGHT} aria-hidden="true" focusable="false">
        <defs>
          <pattern id="signal-wave-fill" width="360" height={HEIGHT} patternUnits="userSpaceOnUse">
            <path className="signal-fill" d={`${WAVE} V${HEIGHT} H0 Z`} />
          </pattern>
        </defs>
        <rect width="100%" height={HEIGHT} fill="url(#signal-wave-fill)" />
      </svg>
      <div className="signal-line-wipe">
        <svg width="100%" height={HEIGHT} aria-hidden="true" focusable="false">
          <defs>
            <pattern id="signal-wave-line" width="360" height={HEIGHT} patternUnits="userSpaceOnUse">
              <path className="signal-line" d={WAVE} />
            </pattern>
          </defs>
          <rect width="100%" height={HEIGHT} fill="url(#signal-wave-line)" />
        </svg>
      </div>
    </RevealFlag>
  )
}

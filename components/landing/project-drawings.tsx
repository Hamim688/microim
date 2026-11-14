import type { CSSProperties } from "react"
import type { ExampleProject } from "@/lib/projects"

// Urutan goresan: tiap elemen "tergambar" sedikit setelah elemen sebelumnya (lihat .proj-drawing di globals.css).
const k = (order: number) => ({ "--k": order }) as CSSProperties

/**
 * Mobil robot tampak samping, melaju ke kanan: roda penggerak besar, roda bebas kecil, papan di atas sasis, dan
 * kepala sensor ultrasonik di atas servo. Gelombangnya memancar ke dinding penghalang (emas) di depan; panah
 * lengkung di atas sensor menandakan kepala sensor berputar memindai.
 */
function SmartCar() {
  return (
    <>
      {/* Lantai */}
      <path className="is-draw" pathLength={1} d="M6 130 H234" style={k(0)} />
      {/* Sasis, roda penggerak (dengan poros), dan roda bebas */}
      <rect className="is-draw" pathLength={1} x="30" y="74" width="132" height="10" rx="4" style={k(1)} />
      <circle className="is-draw" pathLength={1} cx="66" cy="107" r="22" style={k(2)} />
      <circle className="is-draw" pathLength={1} cx="66" cy="107" r="6" style={k(3)} />
      <path className="is-draw" pathLength={1} d="M140 84 V110" style={k(3)} />
      <circle className="is-draw" pathLength={1} cx="140" cy="120" r="9" style={k(4)} />
      {/* Papan mikrokontroler dan baterai di atas sasis */}
      <rect className="is-draw" pathLength={1} x="42" y="58" width="50" height="16" rx="2" style={k(5)} />
      <path className="is-draw" pathLength={1} d="M50 58 V52 M58 58 V52 M66 58 V52 M74 58 V52 M82 58 V52" style={k(6)} />
      <rect className="is-draw" pathLength={1} x="98" y="62" width="26" height="12" rx="2" style={k(6)} />
      {/* Servo dan kepala sensor ultrasonik dengan dua "mata" menghadap ke depan */}
      <rect className="is-draw" pathLength={1} x="134" y="58" width="20" height="16" rx="2" style={k(7)} />
      <rect className="is-draw" pathLength={1} x="140" y="30" width="12" height="28" rx="2" style={k(8)} />
      <path className="is-draw" pathLength={1} d="M152 35 H159 V42 H152 M152 46 H159 V53 H152" style={k(9)} />
      {/* Panah putar: kepala sensor memindai kiri-kanan */}
      <path className="is-draw is-gold" pathLength={1} d="M132 22 A15 9 0 0 1 160 22 M160 22 L154 20 M160 22 L158 16" style={k(10)} />
      {/* Gelombang ultrasonik menuju dinding */}
      <path className="is-soft" d="M168 36 A12 12 0 0 1 168 52" style={k(11)} />
      <path className="is-soft" d="M178 29 A21 21 0 0 1 178 59" style={k(12)} />
      <path className="is-soft" d="M188 22 A30 30 0 0 1 188 66" style={k(13)} />
      {/* Dinding penghalang */}
      <rect className="is-draw is-gold" pathLength={1} x="206" y="14" width="14" height="116" rx="1" style={k(14)} />
      <path className="is-draw is-gold" pathLength={1} d="M206 40 L220 26 M206 66 L220 52 M206 92 L220 78 M206 118 L220 104" style={k(15)} />
    </>
  )
}

/** Robot pengikut garis tampak atas: sasis, dua roda, deret sensor di depan, dan lintasan yang dilewati. */
function LineFollower() {
  return (
    <>
      <path className="is-track" d="M4 80 H84" />
      <path className="is-track" d="M176 80 C202 80 208 54 236 48" />
      <rect className="is-draw" pathLength={1} x="84" y="52" width="76" height="56" rx="9" style={k(0)} />
      <rect className="is-draw" pathLength={1} x="101" y="38" width="36" height="12" rx="3" style={k(1)} />
      <rect className="is-draw" pathLength={1} x="101" y="110" width="36" height="12" rx="3" style={k(1)} />
      <rect className="is-draw" pathLength={1} x="100" y="66" width="30" height="28" rx="2" style={k(2)} />
      <path className="is-draw" pathLength={1} d="M160 68 H166 M160 92 H166" style={k(3)} />
      <rect className="is-draw" pathLength={1} x="166" y="58" width="10" height="44" rx="2" style={k(4)} />
      <circle className="is-draw is-gold" pathLength={1} cx="171" cy="68" r="2" style={k(5)} />
      <circle className="is-draw is-gold" pathLength={1} cx="171" cy="80" r="2" style={k(6)} />
      <circle className="is-draw is-gold" pathLength={1} cx="171" cy="92" r="2" style={k(7)} />
    </>
  )
}

/** Papan ESP32 dengan antena, gelombang WiFi, dan HP yang menampilkan grafik data. */
function IotMonitor() {
  return (
    <>
      <rect className="is-draw" pathLength={1} x="20" y="56" width="78" height="52" rx="5" style={k(0)} />
      <rect className="is-draw" pathLength={1} x="32" y="68" width="28" height="28" rx="2" style={k(1)} />
      <path className="is-draw" pathLength={1} d="M70 70 H86 V78 H74 V86 H86 V94" style={k(2)} />
      <path className="is-soft" d="M110 71 A16 16 0 0 1 110 93" style={k(3)} />
      <path className="is-soft" d="M120 62 A28 28 0 0 1 120 102" style={k(4)} />
      <path className="is-soft" d="M130 53 A40 40 0 0 1 130 111" style={k(5)} />
      <rect className="is-draw" pathLength={1} x="162" y="26" width="58" height="108" rx="9" style={k(6)} />
      <path className="is-draw" pathLength={1} d="M174 46 H208 M174 56 H194" style={k(7)} />
      <rect className="is-draw is-gold" pathLength={1} x="174" y="92" width="9" height="26" style={k(8)} />
      <rect className="is-draw is-gold" pathLength={1} x="188" y="76" width="9" height="42" style={k(9)} />
      <rect className="is-draw is-gold" pathLength={1} x="202" y="98" width="9" height="20" style={k(10)} />
    </>
  )
}

// Tiap gambar punya bingkai (viewBox) sendiri yang pas dengan isinya, supaya ketiganya tampil sama besar.
const DRAWINGS = {
  "smart-car": { Drawing: SmartCar, viewBox: "0 8 240 128" },
  "line-follower": { Drawing: LineFollower, viewBox: "0 30 240 100" },
  "iot-monitor": { Drawing: IotMonitor, viewBox: "14 20 212 120" },
}

/** Gambar teknik sederhana untuk tiap contoh proyek; goresannya tergambar saat barisnya masuk layar. */
export function ProjectDrawing({ slug }: { slug: ExampleProject["slug"] }) {
  const { Drawing, viewBox } = DRAWINGS[slug]
  return (
    <svg className="proj-drawing" viewBox={viewBox} aria-hidden="true" focusable="false">
      <Drawing />
    </svg>
  )
}

import type { CSSProperties, ReactNode } from "react"

// Gambar teknik garis untuk tiap ide proyek. Tiga gambar pertama (proyek unggulan Beranda) "tergambar" berurutan
// saat masuk layar: tiap elemen punya urutan --k (lihat .proj-drawing di globals.css). Gambar lainnya tampil langsung.
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

/**
 * Ilustrasi kepala halaman /projects: bola lampu (ide) berisi chip, dengan jalur PCB dari dudukannya menuju tiga
 * wujud proyek: roda robot, papan mikrokontroler, dan sinyal nirkabel. Tergambar berurutan saat masuk layar.
 */
function Ideas() {
  return (
    <>
      {/* Kaca lampu dan dudukannya */}
      <path className="is-draw" pathLength={1} d="M146 141 A58 58 0 1 1 214 141 V160 H146 Z" style={k(0)} />
      <path className="is-draw" pathLength={1} d="M150 170 H210 M156 180 H204 M168 190 H192" style={k(2)} />
      {/* Chip di dalam lampu (emas) dengan kaki-kakinya, tersambung ke dudukan */}
      <rect className="is-draw is-gold" pathLength={1} x="160" y="74" width="40" height="40" rx="4" style={k(3)} />
      <path className="is-draw is-gold" pathLength={1} d="M152 84 H160 M152 94 H160 M152 104 H160 M200 84 H208 M200 94 H208 M200 104 H208" style={k(4)} />
      <circle className="is-draw is-gold" pathLength={1} cx="180" cy="94" r="6" style={k(5)} />
      <path className="is-draw" pathLength={1} d="M170 114 V141 M190 114 V141" style={k(5)} />
      {/* Sinar */}
      <path className="is-draw is-gold" pathLength={1} d="M180 10 V22 M112 44 L121 53 M248 44 L239 53 M94 94 H107 M253 94 H266" style={k(6)} />
      {/* Jalur PCB dari dudukan ke tiga wujud proyek, dengan bantalan solder di ujungnya */}
      <path className="is-draw" pathLength={1} d="M172 196 L154 214 H74" style={k(7)} />
      <path className="is-draw" pathLength={1} d="M180 196 V212" style={k(7)} />
      <path className="is-draw" pathLength={1} d="M188 196 L206 214 H284" style={k(7)} />
      <circle className="is-draw is-gold" pathLength={1} cx="74" cy="214" r="4" style={k(9)} />
      <circle className="is-draw is-gold" pathLength={1} cx="180" cy="212" r="4" style={k(9)} />
      <circle className="is-draw is-gold" pathLength={1} cx="284" cy="214" r="4" style={k(9)} />
      {/* Roda robot */}
      <circle className="is-draw" pathLength={1} cx="44" cy="214" r="24" style={k(10)} />
      <circle className="is-draw" pathLength={1} cx="44" cy="214" r="7" style={k(11)} />
      {/* Papan mikrokontroler */}
      <rect className="is-draw" pathLength={1} x="154" y="220" width="52" height="30" rx="3" style={k(10)} />
      <rect className="is-draw" pathLength={1} x="162" y="228" width="18" height="14" rx="1.5" style={k(11)} />
      <path className="is-draw" pathLength={1} d="M190 228 V242 M197 228 V242" style={k(11)} />
      {/* Sinyal nirkabel */}
      <path className="is-soft" d="M296 207 A9 9 0 0 1 296 221" style={k(11)} />
      <path className="is-soft" d="M306 200 A17 17 0 0 1 306 228" style={k(12)} />
      <path className="is-soft" d="M316 193 A25 25 0 0 1 316 235" style={k(13)} />
    </>
  )
}

// ---- Bagian yang dipakai berulang oleh gambar-gambar di bawah (bingkai 240×120) ----

/** Papan mikrokontroler: papan, chip, dan deret pin. */
function Board({ x, y, w = 46, h = 30 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="3" />
      <rect x={x + 8} y={y + 8} width={w * 0.38} height={h - 16} rx="1.5" />
      <path d={`M${x + w - 14} ${y + 8} V${y + h - 8} M${x + w - 8} ${y + 8} V${y + h - 8}`} />
    </>
  )
}

/** Gelombang sinyal (tiga busur putus-putus) memancar ke kanan dari titik (x, y). */
function Waves({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? 0 : 1
  const d = flip ? -1 : 1
  return (
    <>
      <path className="is-dash" d={`M${x} ${y - 6} A8 8 0 0 ${s} ${x} ${y + 6}`} />
      <path className="is-dash" d={`M${x + 8 * d} ${y - 11} A14 14 0 0 ${s} ${x + 8 * d} ${y + 11}`} />
      <path className="is-dash" d={`M${x + 16 * d} ${y - 16} A20 20 0 0 ${s} ${x + 16 * d} ${y + 16}`} />
    </>
  )
}

/** HP tegak dengan dua baris teks; isi layar tambahan lewat children. */
function Phone({ x, y, children }: { x: number; y: number; children?: ReactNode }) {
  return (
    <>
      <rect x={x} y={y} width="44" height="84" rx="7" />
      <path d={`M${x + 16} ${y + 8} H${x + 28}`} />
      {children}
    </>
  )
}

/** Mobil robot tampak samping (sasis, roda penggerak, roda bebas, papan) di atas lantai. */
function CarSide({ x }: { x: number }) {
  return (
    <>
      <path d={`M${x - 14} 107 H${x + 122}`} />
      <rect x={x} y="62" width="100" height="8" rx="3" />
      <circle cx={x + 26} cy="88" r="18" />
      <circle cx={x + 26} cy="88" r="5" />
      <path d={`M${x + 84} 70 V90`} />
      <circle cx={x + 84} cy="98" r="8" />
      <rect x={x + 10} y="48" width="40" height="14" rx="2" />
    </>
  )
}

/** Mobil robot tampak atas (sasis dan dua roda). */
function CarTop({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width="52" height="40" rx="6" />
      <rect x={x + 10} y={y - 9} width="24" height="8" rx="2" />
      <rect x={x + 10} y={y + 41} width="24" height="8" rx="2" />
    </>
  )
}

const SIMPLE: Record<string, ReactNode> = {
  // Mobil dikendalikan dari HP: tombol arah di layar, sinyal Bluetooth menuju mobil.
  "mobil-rc-bluetooth": (
    <>
      <CarSide x={24} />
      <Waves x={160} y={56} flip />
      <Phone x={180} y={18}>
        <path className="is-gold" d="M202 52 V76 M190 64 H214" />
        <circle className="is-gold" cx="202" cy="64" r="15" />
      </Phone>
    </>
  ),
  // Lengan empat sendi di atas alas, penjepit di ujung mengambil kotak.
  "lengan-robot-4dof": (
    <>
      <path d="M20 108 H220" />
      <rect x="62" y="94" width="56" height="14" rx="3" />
      <path d="M90 94 L74 58 L122 30 L164 52" />
      <circle cx="90" cy="94" r="5" />
      <circle cx="74" cy="58" r="5" />
      <circle cx="122" cy="30" r="5" />
      <circle cx="164" cy="52" r="5" />
      <path d="M164 52 L178 46 V56 M164 52 L170 66 L180 64" />
      <rect className="is-gold" x="178" y="90" width="18" height="18" rx="2" />
      <path className="is-dash" d="M182 66 V86" />
    </>
  ),
  // Robot dua roda yang tegak; panah emas menandakan koreksi kemiringan.
  "robot-self-balancing": (
    <>
      <path d="M40 108 H200" />
      <circle cx="120" cy="88" r="20" />
      <circle cx="120" cy="88" r="5" />
      <rect x="103" y="14" width="34" height="56" rx="4" />
      <path d="M103 32 H137 M103 50 H137" />
      <path className="is-dash" d="M120 6 V112" />
      <path className="is-gold" d="M86 24 A44 44 0 0 0 78 54 M78 54 L76 46 M78 54 L85 49" />
      <path className="is-gold" d="M154 24 A44 44 0 0 1 162 54 M162 54 L164 46 M162 54 L155 49" />
    </>
  ),
  // Labirin tampak atas; robot (emas) dan jalur yang ditempuhnya.
  "robot-maze-solver": (
    <>
      <path d="M30 12 H210 V108 H70 M30 12 V108 H46" />
      <path d="M70 12 V72 M110 108 V46 M150 12 V72 M190 108 V46" />
      <rect className="is-gold" x="42" y="82" width="16" height="16" rx="3" />
      <path className="is-dash" d="M50 78 V32 H90 V90 H130 V32 H170 V90 H200" />
    </>
  ),
  // Arena sumo tampak miring: dua robot saling dorong di dalam lingkaran.
  "robot-sumo-mini": (
    <>
      <ellipse cx="120" cy="62" rx="98" ry="46" />
      <ellipse className="is-dash" cx="120" cy="62" rx="86" ry="38" />
      <rect x="70" y="48" width="38" height="28" rx="4" />
      <path d="M108 52 L120 62 L108 72" />
      <rect className="is-gold" x="134" y="48" width="38" height="28" rx="4" />
      <path className="is-gold" d="M134 52 L122 62 L134 72" />
      <circle cx="82" cy="62" r="5" />
      <circle className="is-gold" cx="160" cy="62" r="5" />
    </>
  ),
  // Mobil robot menyemprot ke arah api (emas).
  "robot-pemadam-api": (
    <>
      <CarSide x={20} />
      <rect x="96" y="44" width="22" height="18" rx="2" />
      <path d="M118 52 H130" />
      <path className="is-dash" d="M134 50 L176 40 M134 53 L178 56 M134 56 L176 72" />
      <path className="is-gold" d="M200 106 C178 90 196 72 194 50 C214 68 222 90 200 106 Z" />
      <path className="is-gold" d="M200 106 C192 96 200 88 200 80 C208 90 208 98 200 106 Z" />
    </>
  ),
  // Mobil dengan kamera di atasnya; video tampil di HP lewat WiFi.
  "mobil-esp32-cam": (
    <>
      <CarSide x={20} />
      <rect x="84" y="38" width="26" height="24" rx="3" />
      <circle className="is-gold" cx="97" cy="50" r="7" />
      <Waves x={150} y={46} />
      <Phone x={184} y={18}>
        <rect x="190" y="34" width="32" height="36" rx="2" />
        <path className="is-gold" d="M202 44 L212 52 L202 60 Z" />
      </Phone>
    </>
  ),
  // Modul di tangan dimiringkan (panah emas), sinyal nirkabel menuju mobil robot.
  "robot-kendali-gestur": (
    <>
      <g transform="rotate(-16 56 60)">
        <rect x="28" y="42" width="56" height="36" rx="6" />
        <rect x="42" y="52" width="20" height="16" rx="2" />
        <path d="M70 50 V70" />
      </g>
      <path className="is-gold" d="M24 30 A40 40 0 0 1 72 18 M72 18 L64 16 M72 18 L67 25" />
      <Waves x={104} y={60} />
      <CarTop x={160} y={40} />
      <path className="is-gold" d="M218 60 H232 M232 60 L226 55 M232 60 L226 65" />
    </>
  ),
  // Mobil robot dengan penjepit di depan yang membawa kotak (emas) di atas lintasan.
  "robot-transporter": (
    <>
      <path className="is-track" d="M4 112 H236" />
      <CarSide x={24} />
      <path d="M124 66 H146 M146 50 V82 M146 50 H166 M146 82 H166" />
      <rect className="is-gold" x="152" y="54" width="22" height="24" rx="2" />
      <path className="is-dash" d="M196 66 H226 M226 66 L219 61 M226 66 L219 71" />
    </>
  ),
  // Dudukan dua sumbu: kamera di atas tiang; panah emas untuk putar kiri-kanan dan atas-bawah.
  "kamera-pan-tilt": (
    <>
      <path d="M40 108 H200" />
      <rect x="92" y="92" width="56" height="16" rx="3" />
      <path d="M120 92 V70 M98 70 H142 M98 70 V40 M142 70 V40" />
      <rect x="104" y="28" width="44" height="28" rx="4" />
      <circle cx="148" cy="42" r="9" />
      <circle cx="98" cy="42" r="3" />
      <path className="is-gold" d="M74 86 A46 12 0 0 0 166 86 M166 86 L158 84 M166 86 L162 93" />
      <path className="is-gold" d="M172 20 A30 30 0 0 1 172 64 M172 64 L166 58 M172 64 L178 57" />
    </>
  ),
  // HP dengan sakelar, sinyal ke modul relay, lampu menyala (emas).
  "smart-home-relay": (
    <>
      <Phone x={14} y={18}>
        <rect x="22" y="52" width="28" height="14" rx="7" />
        <circle className="is-gold" cx="43" cy="59" r="5" />
      </Phone>
      <Waves x={70} y={60} />
      <rect x="104" y="40" width="50" height="40" rx="3" />
      <path d="M112 48 H124 V60 H112 Z M134 48 H146 V60 H134 Z M112 70 H146" />
      <path className="is-dash" d="M154 60 H180" />
      <circle className="is-gold" cx="204" cy="52" r="18" />
      <path className="is-gold" d="M196 72 H212 M198 80 H210" />
      <path className="is-gold" d="M204 24 V16 M228 52 H236 M224 34 L230 28 M184 34 L178 28" />
    </>
  ),
  // Pot tanaman dengan sensor kelembapan di tanah; selang dari wadah air meneteskan air (emas).
  "penyiram-tanaman": (
    <>
      <path d="M20 108 H220" />
      <path d="M118 66 H178 L170 108 H126 Z" />
      <path d="M148 66 V34 M148 46 C136 44 132 34 134 26 C146 28 150 38 148 46 M148 54 C160 52 166 42 164 34 C152 36 148 46 148 54" />
      <path d="M130 66 V52 M136 66 V52 M127 52 H139 V40 H127 Z" />
      <rect x="30" y="60" width="50" height="48" rx="4" />
      <path className="is-dash" d="M34 76 H76" />
      <path d="M72 60 V22 H148" />
      <path className="is-gold" d="M158 20 V26 M162 30 V36 M154 32 V38" />
    </>
  ),
  // Awan dengan matahari (emas) dan hujan, di samping tiang berisi papan sensor.
  "stasiun-cuaca": (
    <>
      <path d="M20 108 H220" />
      <circle className="is-gold" cx="78" cy="34" r="14" />
      <path className="is-gold" d="M78 10 V14 M54 34 H58 M61 17 L64 20 M95 17 L92 20" />
      <path d="M52 66 H118 A14 14 0 0 0 116 38 A20 20 0 0 0 78 40 A16 16 0 0 0 52 66 Z" />
      <path className="is-dash" d="M64 76 L58 92 M84 76 L78 92 M104 76 L98 92" />
      <path d="M176 108 V60" />
      <Board x={152} y={28} w={48} h={32} />
      <path d="M176 28 V16 M166 16 H186" />
    </>
  ),
  // Pembaca RFID di samping pintu; kartu (emas) ditempelkan.
  "kunci-pintu-rfid": (
    <>
      <path d="M20 110 H220" />
      <rect x="146" y="10" width="62" height="100" rx="3" />
      <circle cx="158" cy="64" r="4" />
      <rect x="84" y="38" width="38" height="50" rx="5" />
      <path className="is-dash" d="M96 56 A9 9 0 0 1 110 56 M92 50 A15 15 0 0 1 114 50" />
      <circle cx="103" cy="68" r="3" />
      <g transform="rotate(-14 46 62)">
        <rect className="is-gold" x="24" y="48" width="46" height="30" rx="4" />
        <path className="is-gold" d="M32 58 H46 M32 66 H58" />
      </g>
    </>
  ),
  // Kartu ditempel ke pembaca, data masuk ke lembar kerja (baris bercentang emas).
  "absensi-rfid": (
    <>
      <g transform="rotate(-12 34 62)">
        <rect x="14" y="48" width="42" height="28" rx="4" />
        <path d="M22 58 H34 M22 66 H46" />
      </g>
      <rect x="70" y="36" width="38" height="50" rx="5" />
      <path className="is-dash" d="M82 54 A9 9 0 0 1 96 54 M78 48 A15 15 0 0 1 100 48" />
      <Waves x={118} y={60} />
      <rect x="150" y="20" width="74" height="82" rx="3" />
      <path d="M150 40 H224 M150 60 H224 M150 80 H224 M174 20 V102" />
      <path className="is-gold" d="M158 50 L162 54 L168 46 M158 70 L162 74 L168 66" />
    </>
  ),
  // Tabung gas dengan asap; modul sensor di sebelahnya membunyikan alarm (emas).
  "detektor-gas": (
    <>
      <path d="M20 108 H220" />
      <rect x="34" y="44" width="46" height="64" rx="12" />
      <path d="M50 44 V34 H64 V44 M46 34 H68" />
      <circle className="is-dash" cx="100" cy="40" r="7" />
      <circle className="is-dash" cx="114" cy="26" r="9" />
      <circle className="is-dash" cx="96" cy="18" r="5" />
      <Board x={128} y={60} w={50} h={34} />
      <circle className="is-gold" cx="206" cy="44" r="7" />
      <path className="is-gold" d="M190 30 A22 22 0 0 0 190 58 M222 30 A22 22 0 0 1 222 58" />
    </>
  ),
  // Tempat sampah dengan tutup terbuka; sensor di depan memancarkan gelombang; garis emas = batas isi.
  "tempat-sampah-pintar": (
    <>
      <path d="M20 108 H220" />
      <path d="M86 46 H154 L146 108 H94 Z" />
      <path d="M84 44 L150 16" />
      <path d="M100 60 V96 M120 60 V96 M140 60 V96" />
      <path className="is-gold is-dash" d="M90 70 H150" />
      <rect x="158" y="52" width="14" height="12" rx="2" />
      <Waves x={178} y={58} />
    </>
  ),
  // Stopkontak tersambung ke papan pengukur dan layar; petir emas = daya listrik.
  "monitoring-daya": (
    <>
      <rect x="16" y="38" width="46" height="46" rx="6" />
      <circle cx="31" cy="61" r="3.5" />
      <circle cx="47" cy="61" r="3.5" />
      <path d="M62 61 H84" />
      <Board x={84} y={44} w={50} h={34} />
      <path d="M134 61 H156" />
      <rect x="156" y="34" width="68" height="54" rx="4" />
      <path d="M166 74 H214" />
      <path className="is-gold" d="M194 42 L182 60 H192 L186 72 L202 54 H192 Z" />
    </>
  ),
  // Akuarium dengan ikan; wadah pakan di atasnya menjatuhkan butiran (emas) sesuai jam.
  "pemberi-pakan-otomatis": (
    <>
      <path d="M20 110 H220" />
      <rect x="46" y="46" width="124" height="64" rx="3" />
      <path className="is-dash" d="M46 60 H170" />
      <ellipse cx="96" cy="86" rx="16" ry="9" />
      <path d="M112 86 L124 78 V94 Z" />
      <circle cx="88" cy="84" r="1.5" />
      <path d="M128 14 H156 L150 38 H134 Z" />
      <path className="is-gold" d="M142 44 V46 M138 52 V54 M146 54 V56 M142 64 V66" />
      <circle cx="200" cy="34" r="16" />
      <path d="M200 24 V34 L207 39" />
    </>
  ),
  // Palang parkir terangkat (emas), mobil tampak atas, dan garis slot parkir.
  "smart-parking": (
    <>
      <path d="M16 108 H224" />
      <rect x="28" y="66" width="14" height="42" rx="2" />
      <path className="is-gold" d="M38 68 L110 30" />
      <circle cx="35" cy="70" r="4" />
      <path className="is-dash" d="M130 24 V96 M176 24 V96 M222 24 V96" />
      <rect x="138" y="36" width="30" height="50" rx="7" />
      <path d="M144 50 H162 M144 72 H162" />
      <path className="is-gold" d="M192 46 V74 M192 46 H202 A7 7 0 0 1 202 60 H192" />
    </>
  ),
  // Bak larutan dengan dua probe sensor dan tanaman di atasnya; papan pengukur di kanan.
  "monitoring-hidroponik": (
    <>
      <path d="M16 110 H224" />
      <rect x="30" y="58" width="112" height="52" rx="3" />
      <path className="is-gold is-dash" d="M30 74 H142" />
      <path d="M60 36 V92 M54 92 H66 V102 H54 Z M108 36 V92 M102 92 H114 V102 H102 Z" />
      <path d="M84 58 V40 M84 46 C76 44 72 38 74 30 C82 32 86 38 84 46 M84 50 C92 48 96 42 94 34" />
      <path className="is-dash" d="M60 36 C60 18 130 14 168 40 M108 36 C116 26 150 26 176 40" />
      <Board x={160} y={42} w={52} h={36} />
    </>
  ),
  // Kamera di dinding dengan sensor gerak; kerucut deteksi mengenai orang (emas).
  "kamera-keamanan-pir": (
    <>
      <path d="M24 8 V112" />
      <path d="M24 34 H44" />
      <rect x="44" y="20" width="46" height="28" rx="4" />
      <circle cx="90" cy="34" r="9" />
      <path d="M52 62 A12 12 0 0 1 76 62 Z" />
      <path className="is-dash" d="M100 34 L196 18 M100 38 L196 106" />
      <circle className="is-gold" cx="178" cy="42" r="9" />
      <path className="is-gold" d="M178 51 V84 M162 64 H194 M178 84 L166 108 M178 84 L190 108" />
    </>
  ),
  // Tandon air: sensor di atas mengukur jarak ke permukaan air (emas); skala di sisi kanan.
  "pemantau-ketinggian-air": (
    <>
      <path d="M40 110 H200" />
      <path d="M70 18 V110 M170 18 V110" />
      <rect x="106" y="10" width="28" height="14" rx="2" />
      <path className="is-dash" d="M112 30 A10 10 0 0 0 128 30 M106 38 A18 18 0 0 0 134 38 M100 46 A26 26 0 0 0 140 46" />
      <path className="is-gold" d="M70 70 C82 64 94 76 106 70 S130 64 142 70 S160 74 170 70" />
      <path d="M178 26 H188 M178 48 H184 M178 70 H188 M178 92 H184" />
    </>
  ),
  // Papan LED menampilkan jam "12:45" (emas).
  "jam-running-text": (
    <>
      <rect x="34" y="30" width="172" height="60" rx="5" />
      <path d="M52 90 V104 M188 90 V104 M40 104 H64 M176 104 H200" />
      <path className="is-gold" d="M70 46 V74" />
      <path className="is-gold" d="M86 46 H102 V60 H86 V74 H102" />
      <circle className="is-gold" cx="116" cy="54" r="1.6" />
      <circle className="is-gold" cx="116" cy="66" r="1.6" />
      <path className="is-gold" d="M130 46 V60 H146 M146 46 V74" />
      <path className="is-gold" d="M176 46 H160 V60 H176 V74 H160" />
    </>
  ),
}

// Tiap gambar unggulan punya bingkai (viewBox) sendiri yang pas dengan isinya, supaya ketiganya tampil sama besar.
const FEATURED: Record<string, { Drawing: () => ReactNode; viewBox: string }> = {
  "smart-car": { Drawing: SmartCar, viewBox: "0 8 240 128" },
  "line-follower": { Drawing: LineFollower, viewBox: "0 30 240 100" },
  "iot-monitor": { Drawing: IotMonitor, viewBox: "14 20 212 120" },
  // Bukan proyek: ilustrasi umum "ide proyek" untuk kepala halaman /projects.
  ideas: { Drawing: Ideas, viewBox: "8 0 344 258" },
}

/** Gambar teknik sebuah ide proyek. Slug yang belum punya gambar tidak menampilkan apa-apa. */
export function ProjectDrawing({ slug }: { slug: string }) {
  const featured = FEATURED[slug]
  if (featured) {
    const { Drawing, viewBox } = featured
    return (
      <svg className="proj-drawing" viewBox={viewBox} aria-hidden="true" focusable="false">
        <Drawing />
      </svg>
    )
  }
  const simple = SIMPLE[slug]
  if (!simple) return null
  return (
    <svg className="proj-drawing" viewBox="0 0 240 120" aria-hidden="true" focusable="false">
      {simple}
    </svg>
  )
}

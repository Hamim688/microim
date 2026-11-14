"use client"

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { ArrowRight, ShieldCheck, Timer, TriangleAlert, Truck, Wallet, X, Zap } from "lucide-react"

// Masalah → solusi diambil dari "Latar Belakang & Validasi Masalah" di rencana bisnis Microim.
const REASONS = [
  {
    icon: Timer,
    problem: "Butuh komponen H-1 praktikum",
    detail: "Belanja online dari luar kota butuh 2–4 hari, padahal tenggat tinggal sehari-dua hari.",
    solutionIcon: Zap,
    before: "2–4 hari menunggu kiriman",
    after: "Hari itu juga.",
    solution: "Komponen ready stock dengan same-day delivery dan COD di area kampus.",
  },
  {
    icon: Truck,
    problem: "Ongkos kirim bikin mahal",
    detail: "Ongkir luar kota sering terasa lebih berat daripada harga komponennya sendiri.",
    solutionIcon: Wallet,
    before: "Ongkir luar kota yang mahal",
    after: "Tanpa ongkir.",
    solution: "COD di area kampus, dengan stok yang diambil langsung dari distributor grosir.",
  },
  {
    icon: TriangleAlert,
    problem: "Rawan salah beli modul",
    detail: "Level logika 3.3V vs 5V, board tidak kompatibel, dan marketplace hanya mengirim hardware kosongan.",
    solutionIcon: ShieldCheck,
    before: "Hardware kosongan tanpa panduan",
    after: "Dites & berlabel pinout.",
    solution: "Kamu dibantu memilih modul yang cocok, sampai dirakit dan diprogram.",
  },
]

type Point = { x: number; y: number }
type Geometry = { width: number; height: number; starts: Point[]; end: Point }

/** Jalur PCB dari tepi kanan kartu masalah ke tepi kiri panel: lurus, belok 45°, turun/naik, belok 45°, lurus. */
function routePath(start: Point, end: Point, index: number) {
  const dy = end.y - start.y
  if (Math.abs(dy) < 2) return `M${start.x} ${start.y} H${end.x}`
  const dir = Math.sign(dy)
  const chamfer = Math.min(10, Math.abs(dy) / 2)
  // Tiap jalur berbelok di posisi berbeda supaya ruas tegaknya tidak bertumpuk.
  const bend = start.x + (end.x - start.x) * (0.3 + 0.2 * index)
  return `M${start.x} ${start.y} H${bend - chamfer} L${bend} ${start.y + dir * chamfer} V${end.y - dir * chamfer} L${bend + chamfer} ${end.y} H${end.x}`
}

/**
 * "Kenapa Microim ada": daftar masalah (kiri) yang bisa dipilih + satu panel solusi besar (kanan) yang berganti
 * isi, menampilkan perbandingan sebelum → sesudah. Ketiga masalah tersambung ke panel lewat jalur PCB; jalur
 * masalah terpilih menyala dan dialiri satu denyut cahaya. Di HP, panel solusi muncul tepat di bawah masalah
 * terpilih (akordeon) dan jalurnya disembunyikan.
 * Pola tab vertikal (klik, sorot, atau tombol panah atas/bawah). Panel yang tidak terpilih diberi `inert`
 * (bukan `hidden`) supaya di HP bisa membuka-menutup dengan transisi tinggi.
 */
export function AboutReasons() {
  const [active, setActive] = useState(0)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  // Ukur posisi kartu & panel (pakai offset, jadi tidak terpengaruh geseran kartu aktif) untuk menggambar jalur.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => {
      const panel = root.querySelector<HTMLElement>(".why-panel.is-open")
      if (!panel || tabs.current.some((tab) => !tab)) return
      setGeometry({
        width: root.offsetWidth,
        height: root.offsetHeight,
        starts: tabs.current.map((tab) => ({ x: tab!.offsetLeft + tab!.offsetWidth, y: tab!.offsetTop + tab!.offsetHeight / 2 })),
        end: { x: panel.offsetLeft, y: panel.offsetTop + panel.offsetHeight / 2 },
      })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = REASONS.length - 1
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  const routes = geometry && geometry.end.x - geometry.starts[0].x > 24
    ? geometry.starts.map((start, index) => routePath(start, geometry.end, index))
    : null

  return (
    <div ref={rootRef} className="why" role="tablist" aria-orientation="vertical" aria-label="Masalah yang dijawab Microim">
      {routes && geometry ? (
        <svg className="why-routes" viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true" focusable="false">
          {routes.map((d, index) => (index === active ? null : <path key={d} className="why-route" d={d} />))}
          <path className="why-route is-active" d={routes[active]} />
          {/* Denyut cahaya: dijalankan ulang tiap ganti masalah (key berubah). */}
          <path key={`pulse-${active}`} className="why-route-pulse" d={routes[active]} pathLength={1} />
          {geometry.starts.map((start, index) => (
            <circle key={`pad-${index}`} className={`why-pad${index === active ? " is-active" : ""}`} cx={start.x} cy={start.y} r={4} />
          ))}
          <circle className="why-pad is-end" cx={geometry.end.x} cy={geometry.end.y} r={5.5} />
        </svg>
      ) : null}
      {REASONS.map(({ icon: Icon, problem, detail, solutionIcon: SolutionIcon, before, after, solution }, index) => {
        const selected = index === active
        return [
          <button
            key={`tab-${problem}`}
            ref={(el) => { tabs.current[index] = el }}
            type="button"
            role="tab"
            id={`why-tab-${index}`}
            aria-controls={`why-panel-${index}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={`why-tab${selected ? " is-active" : ""}`}
            style={{ "--r": index + 1 } as CSSProperties}
            onClick={() => setActive(index)}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index) }}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="why-tab-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="why-tab-body">
              <span className="why-tab-title"><Icon aria-hidden="true" />{problem}</span>
              <span className="why-tab-detail">{detail}</span>
            </span>
            <span className="why-tab-arrow" aria-hidden="true"><ArrowRight /></span>
          </button>,
          <div
            key={`panel-${problem}`}
            role="tabpanel"
            id={`why-panel-${index}`}
            aria-labelledby={`why-tab-${index}`}
            className={`why-panel${selected ? " is-open" : ""}`}
            inert={!selected}
          >
            {/* Pembungkus dalam: memungkinkan panel membuka-menutup halus di HP (grid 0fr → 1fr). */}
            <div className="why-panel-inner">
              <div className="why-panel-content">
                {/* Baris atas: label + lampu indikator berisi ikon solusi (sebaris, jadi tidak menabrak teks). */}
                <div className="why-panel-top">
                  <span className="why-panel-tag">Solusi Microim</span>
                  <span className="why-lamp" aria-hidden="true"><SolutionIcon /></span>
                </div>
                <p className="why-before"><X aria-hidden="true" /><span className="sr-only">Sebelumnya: </span><s>{before}</s></p>
                <p className="why-after">{after}</p>
                <p className="why-solution-text">{solution}</p>
              </div>
            </div>
          </div>,
        ]
      })}
    </div>
  )
}

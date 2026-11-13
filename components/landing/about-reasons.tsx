"use client"

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { ArrowRight, ShieldCheck, Timer, TriangleAlert, Truck, Wallet, Zap } from "lucide-react"

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

/**
 * "Kenapa Microim ada": daftar masalah (kiri) yang bisa dipilih + satu panel solusi besar (kanan) yang berganti
 * isi, menampilkan perbandingan sebelum → sesudah. Di HP, panel solusi muncul tepat di bawah masalah terpilih.
 * Pola tab vertikal (klik, sorot, atau tombol panah atas/bawah).
 */
export function AboutReasons() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

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

  return (
    <div className="why" role="tablist" aria-orientation="vertical" aria-label="Masalah yang dijawab Microim">
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
            className="why-panel"
            hidden={!selected}
          >
            <SolutionIcon className="why-panel-watermark" aria-hidden="true" />
            <span className="why-panel-tag"><SolutionIcon aria-hidden="true" />Solusi Microim</span>
            <p className="why-before"><span className="sr-only">Sebelumnya: </span><s>{before}</s></p>
            <p className="why-after">{after}</p>
            <p className="why-solution-text">{solution}</p>
          </div>,
        ]
      })}
    </div>
  )
}

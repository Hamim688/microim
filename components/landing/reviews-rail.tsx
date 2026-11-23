"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

/** Lebar badan roket (px), sama dengan --car-w di CSS. */
const ROCKET_W = 70

type Spark = {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  size: number
  rot: number
  bright: boolean
}

/**
 * Deretan kartu ulasan dengan penunjuk geser berupa roket astronot kecil di atas lintasan bintang.
 * Hanya roketnya yang bisa ditarik (kursor atau jari), dan kartu ikut bergeser seketika mengikuti roket. Saat bergerak
 * api pendorong menyala dan memercikkan bintang-bintang kecil di belakangnya; roket menghadap ke arah tarikan (juga
 * otomatis berbalik di kedua ujung), dan kartu berhenti tepat di titik roket dilepas. Tombol panah menggeser per kartu.
 */
export function ReviewsRail({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const roadRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ progress: 0, scrollable: false, road: 0 })
  const [facing, setFacing] = useState<1 | -1>(1)
  const [turning, setTurning] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [thrusting, setThrusting] = useState(false)
  const [sparks, setSparks] = useState<Spark[]>([])
  const grab = useRef<{ offset: number } | null>(null)
  /** Posisi geser saat arah roket terakhir ditetapkan; roket baru berbalik setelah bergerak cukup jauh dari sini. */
  const turnAnchor = useRef(0)
  const thrustTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const turnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSparkScroll = useRef(0)
  const sparkSeq = useRef(0)
  const facingRef = useRef<1 | -1>(1)

  const spawnSpark = useCallback((progress: number, roadWidth: number, roadHeight: number, dir: 1 | -1) => {
    if (roadWidth <= ROCKET_W) return
    const rocketLeft = progress * (roadWidth - ROCKET_W)
    const nozzleX = dir === 1 ? rocketLeft + 2 : rocketLeft + ROCKET_W - 2
    const id = ++sparkSeq.current
    const spark: Spark = {
      id,
      x: nozzleX,
      y: roadHeight / 2 + (Math.random() - 0.5) * 10,
      dx: -dir * (18 + Math.random() * 24),
      dy: (Math.random() - 0.5) * 22,
      size: 7 + Math.random() * 6,
      rot: Math.round(Math.random() * 90),
      bright: id % 2 === 0,
    }
    setSparks((prev) => [...prev.slice(-13), spark])
    setTimeout(() => {
      setSparks((prev) => prev.filter((item) => item.id !== id))
    }, 560)
  }, [])

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const progress = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0
    const roadWidth = roadRef.current?.clientWidth ?? 0
    const roadHeight = roadRef.current?.clientHeight ?? 48

    // Roket menghadap ke arah gerakan: berbalik saat ditarik mundur (setelah bergerak lebih dari 12px, supaya tidak
    // berkedip karena gerakan kecil), dan otomatis berbalik saat menyentuh ujung kanan atau kiri.
    let nextFacing = facingRef.current
    if (max > 0 && el.scrollLeft >= max - 1) {
      nextFacing = -1
      turnAnchor.current = el.scrollLeft
    } else if (el.scrollLeft <= 1) {
      nextFacing = 1
      turnAnchor.current = el.scrollLeft
    } else if (Math.abs(el.scrollLeft - turnAnchor.current) > 12) {
      nextFacing = el.scrollLeft > turnAnchor.current ? 1 : -1
      turnAnchor.current = el.scrollLeft
    }
    if (nextFacing !== facingRef.current) {
      facingRef.current = nextFacing
      setFacing(nextFacing)
      setTurning(true)
      if (turnTimer.current) clearTimeout(turnTimer.current)
      turnTimer.current = setTimeout(() => setTurning(false), 480)
    }

    // Nyalakan api pendorong dan percikkan bintang saat posisi scroll berubah.
    const moved = Math.abs(el.scrollLeft - lastSparkScroll.current)
    if (moved > 2) {
      setThrusting(true)
      if (thrustTimer.current) clearTimeout(thrustTimer.current)
      thrustTimer.current = setTimeout(() => setThrusting(false), 180)
    }
    if (moved > 14) {
      lastSparkScroll.current = el.scrollLeft
      spawnSpark(progress, roadWidth, roadHeight, nextFacing)
    }

    setState({ progress, scrollable: max > 4, road: roadWidth })
  }, [spawnSpark])

  useEffect(() => {
    return () => {
      if (thrustTimer.current) clearTimeout(thrustTimer.current)
      if (turnTimer.current) clearTimeout(turnTimer.current)
    }
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    el.addEventListener("scroll", measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    if (roadRef.current) observer.observe(roadRef.current)
    return () => {
      el.removeEventListener("scroll", measure)
      observer.disconnect()
    }
  }, [measure, state.scrollable])

  /** Letakkan roket (bagian yang dipegang) di bawah penunjuk, lalu geser kartu ke posisi yang sesuai. */
  const driveTo = (clientX: number, offset: number) => {
    const track = trackRef.current
    const road = roadRef.current
    if (!track || !road) return
    const rect = road.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - offset - rect.left) / (rect.width - ROCKET_W)))
    track.scrollLeft = ratio * (track.scrollWidth - track.clientWidth)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const road = roadRef.current
    if (!road) return
    const rocketLeft = road.getBoundingClientRect().left + state.progress * (road.clientWidth - ROCKET_W)
    // Hanya roket yang bisa ditarik; menekan garis di luar roket tidak melakukan apa-apa.
    if (event.clientX < rocketLeft || event.clientX > rocketLeft + ROCKET_W) return
    grab.current = { offset: event.clientX - rocketLeft }
    event.currentTarget.setPointerCapture(event.pointerId)
    trackRef.current?.classList.add("is-dragging")
    setDragging(true)
    setThrusting(true)
    driveTo(event.clientX, grab.current.offset)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (grab.current) driveTo(event.clientX, grab.current.offset)
  }
  const endDrag = () => {
    if (!grab.current) return
    grab.current = null
    trackRef.current?.classList.remove("is-dragging")
    setDragging(false)
    setThrusting(false)
  }

  const step = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "18") || 18
    const distance = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8
    el.scrollBy({ left: dir * distance, behavior: "smooth" })
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const el = trackRef.current
    if (!el) return
    if (event.key === "ArrowRight") step(1)
    else if (event.key === "ArrowLeft") step(-1)
    else if (event.key === "Home") el.scrollTo({ left: 0, behavior: "smooth" })
    else if (event.key === "End") el.scrollTo({ left: el.scrollWidth, behavior: "smooth" })
    else return
    event.preventDefault()
  }

  return (
    <>
      <ul ref={trackRef} className="rv-track" aria-label="Ulasan pelanggan">
        {children}
      </ul>

      {state.scrollable ? (
        <div className="site-container rv-nav">
          <div
            ref={roadRef}
            className={`rv-road${dragging ? " is-dragging" : ""}${thrusting ? " is-thrusting" : ""}`}
            role="slider"
            aria-label="Geser ulasan"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(state.progress * 100)}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
            style={{ "--p": state.progress } as CSSProperties}
          >
            <span className="rv-road-line" aria-hidden="true" />
            {sparks.map((s) => (
              <svg
                key={s.id}
                className={`rv-spark${s.bright ? " is-bright" : ""}`}
                viewBox="0 0 12 12"
                aria-hidden="true"
                focusable="false"
                style={
                  {
                    left: `${s.x}px`,
                    top: `${s.y}px`,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    "--dx": `${s.dx}px`,
                    "--dy": `${s.dy}px`,
                    "--rot": `${s.rot}deg`,
                  } as CSSProperties
                }
              >
                <path d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z" />
              </svg>
            ))}
            <span className={`rv-car${turning ? " is-turning" : ""}`} aria-hidden="true">
              <span className="rv-car-swoop">
                <svg
                  viewBox="16 0 70 40"
                  style={{ transform: `perspective(240px) rotateY(${facing === 1 ? 0 : 180}deg)` }}
                  focusable="false"
                >
                {/* Roket astronot imut menghadap kanan: api pendorong, sirip emas, badan kapsul gemuk, jendela bulat
                    dengan astronot mungil di dalamnya, dan moncong emas. */}
                <g className="rkt-flame">
                  <path className="rkt-flame-outer" d="M18 14.5 Q6 14 0 20 Q6 26 18 25.5 Z" />
                  <path className="rkt-flame-inner" d="M18 17 Q10 17.5 6 20 Q10 22.5 18 23 Z" />
                </g>
                <path className="rkt-fin" d="M24 14 Q20 5 29 5.5 Q34 7 37 12.5 Z" />
                <path className="rkt-fin" d="M24 26 Q20 35 29 34.5 Q34 33 37 27.5 Z" />
                <rect className="rkt-nozzle" x="17" y="15.5" width="6" height="9" rx="1.5" />
                <path className="rkt-hull" d="M22 14 Q29 8.5 49 8.5 Q70 8.5 85 20 Q70 31.5 49 31.5 Q29 31.5 22 26 Z" />
                <path className="rkt-hull-shade" d="M23 24.5 Q42 29.5 69 27 Q78 24.5 84.5 20 Q70 31.5 49 31.5 Q29 31.5 22 26 Z" />
                <path className="rkt-nose" d="M71 11.4 Q79 14.4 85 20 Q79 25.6 71 28.6 Q74.5 20 71 11.4 Z" />
                <path className="rkt-stripe" d="M27 11.6 Q29.5 20 27 28.4" />
                <circle className="rkt-window-rim" cx="50" cy="20" r="8.6" />
                <circle className="rkt-window" cx="50" cy="20" r="6.7" />
                {/* Astronot mungil mengintip dari jendela */}
                <path className="rkt-suit" d="M44.6 24.8 Q50 22.2 55.4 24.8 A6.7 6.7 0 0 1 44.6 24.8 Z" />
                <circle className="rkt-helmet" cx="50" cy="19.1" r="4.6" />
                <rect className="rkt-visor" x="47.2" y="16.8" width="6.2" height="4.4" rx="2.2" />
                <circle className="rkt-eye" cx="49.2" cy="19" r=".65" />
                <circle className="rkt-eye" cx="51.7" cy="19" r=".65" />
                <path className="rkt-glint" d="M48.1 17.6 Q49.5 17 51.2 17.4" />
                <path className="rkt-fin-center" d="M21 19.2 H30 Q31.5 20 30 20.8 H21 Z" />
              </svg>
              </span>
            </span>
          </div>
          <div className="rv-arrows">
            <button type="button" onClick={() => step(-1)} disabled={state.progress <= 0.001} aria-label="Ulasan sebelumnya"><ChevronLeft aria-hidden="true" /></button>
            <button type="button" onClick={() => step(1)} disabled={state.progress >= 0.999} aria-label="Ulasan berikutnya"><ChevronRight aria-hidden="true" /></button>
          </div>
        </div>
      ) : null}
    </>
  )
}

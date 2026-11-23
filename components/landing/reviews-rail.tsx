"use client"

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"

/**
 * Deretan kartu ulasan yang bisa digeser, dengan penunjuk posisi berupa mobil RC di jalan raya (menggantikan bilah
 * geser bawaan browser). Mobil mengikuti posisi geser, bisa diseret, jalannya bisa diklik untuk melompat, dan bisa
 * digerakkan dengan tombol panah. Mobil menghadap ke arah gerakan terakhir.
 */
export function ReviewsRail({ children }: { children: ReactNode }) {
  const trackId = useId()
  const trackRef = useRef<HTMLUListElement>(null)
  const roadRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [scrollable, setScrollable] = useState(false)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [driving, setDriving] = useState(false)
  const last = useRef(0)
  const dragging = useRef(false)
  const stopTimer = useRef<number | undefined>(undefined)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setScrollable(max > 4)
    const next = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0
    if (Math.abs(next - last.current) > 0.002) setFacing(next > last.current ? 1 : -1)
    last.current = next
    setProgress(next)
    // Roda "berputar" selama digeser, berhenti sebentar setelah gerakan selesai.
    setDriving(true)
    window.clearTimeout(stopTimer.current)
    stopTimer.current = window.setTimeout(() => setDriving(false), 180)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    setDriving(false)
    el.addEventListener("scroll", measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", measure)
      observer.disconnect()
      window.clearTimeout(stopTimer.current)
    }
  }, [measure])

  /** Geser deretan kartu sesuai posisi penunjuk di sepanjang jalan. */
  const scrollToPointer = (clientX: number, smooth: boolean) => {
    const track = trackRef.current
    const road = roadRef.current
    if (!track || !road) return
    const rect = road.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    track.scrollTo({ left: ratio * (track.scrollWidth - track.clientWidth), behavior: smooth ? "smooth" : "auto" })
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    // Saat diseret, snap kartu dimatikan supaya mobil mengikuti jari tanpa tersentak.
    trackRef.current?.classList.add("is-dragging")
    scrollToPointer(event.clientX, true)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) scrollToPointer(event.clientX, false)
  }
  const endDrag = () => {
    dragging.current = false
    trackRef.current?.classList.remove("is-dragging")
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track) return
    const step = track.clientWidth * 0.8
    if (event.key === "ArrowRight") track.scrollBy({ left: step, behavior: "smooth" })
    else if (event.key === "ArrowLeft") track.scrollBy({ left: -step, behavior: "smooth" })
    else if (event.key === "Home") track.scrollTo({ left: 0, behavior: "smooth" })
    else if (event.key === "End") track.scrollTo({ left: track.scrollWidth, behavior: "smooth" })
    else return
    event.preventDefault()
  }

  return (
    <>
      <ul ref={trackRef} id={trackId} className="rv-track" aria-label="Ulasan pelanggan">
        {children}
      </ul>
      {scrollable ? (
        <div className="site-container">
          <div
            ref={roadRef}
            className={`rv-road${driving ? " is-driving" : ""}`}
            role="scrollbar"
            aria-orientation="horizontal"
            aria-controls={trackId}
            aria-label="Geser ulasan"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
          >
            <span className="rv-road-lane" aria-hidden="true" />
            <span className="rv-car" style={{ "--p": progress } as CSSProperties} aria-hidden="true">
              <svg viewBox="0 0 64 34" style={{ scale: `${facing} 1` }} focusable="false">
                {/* Mobil RC tampak atas: roda, sasis emas, kaca, lampu depan, antena. */}
                <rect className="rv-car-wheel" x="9" y="1" width="12" height="7" rx="2" />
                <rect className="rv-car-wheel" x="43" y="1" width="12" height="7" rx="2" />
                <rect className="rv-car-wheel" x="9" y="26" width="12" height="7" rx="2" />
                <rect className="rv-car-wheel" x="43" y="26" width="12" height="7" rx="2" />
                <rect className="rv-car-body" x="4" y="6" width="56" height="22" rx="8" />
                <rect className="rv-car-glass" x="30" y="10" width="14" height="14" rx="3" />
                <circle className="rv-car-light" cx="58" cy="11" r="2" />
                <circle className="rv-car-light" cx="58" cy="23" r="2" />
                <path className="rv-car-antenna" d="M14 17 L4 9" />
              </svg>
            </span>
          </div>
        </div>
      ) : null}
    </>
  )
}

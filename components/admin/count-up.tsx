"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "motion/react"

const formatters = {
  rupiah: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }),
  number: new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }),
}

/** Angka yang "menghitung naik" saat pertama terlihat. */
export function CountUp({ value, format = "number" }: { value: number; format?: keyof typeof formatters }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setShown(v) })
    return () => controls.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref} className="admin-num">
      {formatters[format].format(Math.round(reduce ? value : shown))}
    </span>
  )
}

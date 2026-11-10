"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { MotionConfig, motion, type Variants } from "motion/react"

const smoothEase = [0.22, 1, 0.36, 1] as const

export function LandingMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export function PageEntrance({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: smoothEase }}
    >
      {children}
    </motion.div>
  )
}

/** "below" / "above": tersembunyi, akan masuk dari bawah / dari atas. "show": tampil. */
export type RevealState = "below" | "above" | "show"

/**
 * Animasi masuk yang berulang setiap kali elemen masuk layar.
 * - Masuk: saat bagian elemen yang terlihat mencapai `amount`.
 * - Reset: diam-diam, hanya setelah elemen benar-benar keluar layar (tidak ada animasi keluar yang terlihat).
 * - Arah: elemen yang keluar lewat atas akan masuk lagi dari atas saat di-scroll ke atas, dan sebaliknya.
 */
export function useRevealOnScroll<T extends Element>(amount = 0.14) {
  const ref = useRef<T>(null)
  const [state, setState] = useState<RevealState>("below")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const enter = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= amount * 0.98) setState("show")
      },
      { threshold: amount },
    )
    const leave = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setState(entry.boundingClientRect.top < 0 ? "above" : "below")
      },
      { threshold: 0 },
    )
    enter.observe(el)
    leave.observe(el)
    return () => {
      enter.disconnect()
      leave.disconnect()
    }
  }, [amount])

  return [ref, state] as const
}

/** Variasi tersembunyi berlaku seketika (reset tak terlihat); hanya "show" yang beranimasi. */
const revealVariants: Variants = {
  below: { opacity: 0, y: 14, transition: { duration: 0 } },
  above: { opacity: 0, y: -14, transition: { duration: 0 } },
  show: { opacity: 1, y: 0 },
}

export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const [ref, state] = useRevealOnScroll<HTMLDivElement>(0.14)
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={revealVariants}
      initial="below"
      animate={state}
      transition={{ duration: 0.85, delay, ease: smoothEase }}
    >
      {children}
    </motion.div>
  )
}

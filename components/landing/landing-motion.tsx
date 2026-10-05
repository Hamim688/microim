"use client"

import type { ReactNode } from "react"
import { MotionConfig, motion } from "motion/react"

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

export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.85, delay, ease: smoothEase }}
    >
      {children}
    </motion.div>
  )
}

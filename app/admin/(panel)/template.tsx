"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "motion/react"

// Urutan menu, dipakai untuk menentukan arah animasi: turun ke menu bawah = konten naik dari bawah, dan sebaliknya.
const ORDER = ["/admin/transaksi", "/admin/produk", "/admin/akun"]
function rank(pathname: string) {
  const section = ORDER.findIndex((p) => pathname.startsWith(p)) + 1
  const depth = pathname.split("/").filter(Boolean).length
  return section * 10 + depth
}
let lastRank: number | null = null

/** Transisi ringan saat pindah halaman admin, arahnya mengikuti posisi menu. */
export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const pathname = usePathname()
  const current = rank(pathname)
  const [direction] = useState(() => (lastRank === null || current >= lastRank ? 1 : -1))
  useEffect(() => {
    lastRank = current
  }, [current])

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 * direction }}
      animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

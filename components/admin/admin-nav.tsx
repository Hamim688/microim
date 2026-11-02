"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { Boxes, LayoutDashboard, ReceiptText, UserCog } from "lucide-react"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/transaksi", label: "Transaksi", icon: ReceiptText },
  { href: "/admin/produk", label: "Produk & Stok", icon: Boxes },
  { href: "/admin/akun", label: "Akun", icon: UserCog },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="admin-nav" aria-label="Menu admin">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            prefetch={true}
            className={active ? "is-active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {active ? (
              <motion.span
                layoutId="admin-nav-pill"
                className="admin-nav-pill"
                transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.8 }}
              />
            ) : null}
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

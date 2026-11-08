"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { Boxes, LayoutDashboard, ReceiptText, UserCog, type LucideIcon } from "lucide-react"

export type NavBadges = { pending: number; lowStock: number }

type Item = { href: string; label: string; icon: LucideIcon; badge?: keyof NavBadges; badgeTitle?: string }

const sections: { title: string; items: Item[] }[] = [
  { title: "Utama", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Data",
    items: [
      { href: "/admin/transaksi", label: "Transaksi", icon: ReceiptText, badge: "pending", badgeTitle: "transaksi belum dibayar" },
      { href: "/admin/produk", label: "Produk & Stok", icon: Boxes, badge: "lowStock", badgeTitle: "produk stok menipis" },
    ],
  },
  { title: "Pengaturan", items: [{ href: "/admin/akun", label: "Akun", icon: UserCog }] },
]

export const isActive = (href: string, pathname: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href))

export function AdminNav({ badges, onNavigate }: { badges: NavBadges; onNavigate?: (href: string) => void }) {
  const pathname = usePathname()
  return (
    <nav className="admin-nav" aria-label="Menu admin">
      {sections.map((section) => (
        <div key={section.title} className="admin-nav-section">
          <span className="admin-nav-title">{section.title}</span>
          {section.items.map(({ href, label, icon: Icon, badge, badgeTitle }) => {
            const active = isActive(href, pathname)
            const count = badge ? badges[badge] : 0
            return (
              <Link
                key={href}
                href={href}
                prefetch
                data-label={label}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
                onNavigate={() => {
                  if (pathname !== href) onNavigate?.(href)
                }}
              >
                {active ? (
                  <motion.span
                    layoutId="admin-nav-pill"
                    className="admin-nav-pill"
                    transition={{ type: "spring", stiffness: 480, damping: 38, mass: 0.7 }}
                  />
                ) : null}
                <span className="admin-nav-icon">
                  <Icon aria-hidden="true" />
                  {count > 0 ? <span className={`admin-nav-dot is-${badge}`} aria-hidden="true" /> : null}
                </span>
                <span className="admin-nav-label">{label}</span>
                {count > 0 ? (
                  <span className={`admin-nav-badge is-${badge}`} title={`${count} ${badgeTitle}`}>
                    {count > 99 ? "99+" : count}
                    <span className="sr-only"> {badgeTitle}</span>
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

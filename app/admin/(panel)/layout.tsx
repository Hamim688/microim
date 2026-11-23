import type { Metadata } from "next"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { getLowStockThreshold, goodsOnly } from "@/lib/admin/settings"
import { AdminShell, SIDEBAR_COOKIE } from "@/components/admin/admin-shell"
import "../admin.css"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Microim" },
  robots: { index: false, follow: false },
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Semua dijalankan bersamaan supaya tidak menunggu satu per satu ke database.
  const [admin, cookieStore, pending, lowStock, reviews] = await Promise.all([
    requireAdmin(),
    cookies(),
    db.order.count({ where: { status: "PENDING" } }).catch(() => 0),
    getLowStockThreshold()
      .then((threshold) => db.product.count({ where: { ...goodsOnly, stock: { lte: threshold } } }))
      .catch(() => 0),
    // Dibungkus Promise supaya error apa pun (mis. tabel ulasan belum ada) hanya membuat lencananya 0,
    // bukan merusak seluruh panel admin.
    Promise.resolve()
      .then(() => db.review.count({ where: { status: "PENDING" } }))
      .catch(() => 0),
  ])

  return (
    <AdminShell
      admin={{ name: admin.name, email: admin.email }}
      badges={{ pending, lowStock, reviews }}
      initialCollapsed={cookieStore.get(SIDEBAR_COOKIE)?.value === "collapsed"}
    >
      {children}
    </AdminShell>
  )
}

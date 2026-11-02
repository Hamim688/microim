import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth/session"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminAurora } from "@/components/admin/aurora"
import { logout } from "../actions"
import "../admin.css"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin Microim" },
  robots: { index: false, follow: false },
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="admin-shell">
      <AdminAurora />
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="admin-logo-ring"><Image src="/logo/logo-baru.png" alt="" width={36} height={36} className="rounded-xl" /></span>
          <span>Microim <small>Admin</small></span>
        </Link>
        <AdminNav />
        <div className="admin-sidebar-foot">
          <div className="admin-user" title={admin.email}>
            <span className="admin-avatar" aria-hidden="true">{(admin.name ?? admin.email).charAt(0).toUpperCase()}</span>
            <span><strong>{admin.name ?? "Admin"}</strong><small>{admin.email}</small></span>
          </div>
          <div className="admin-sidebar-links">
            <Link href="/" target="_blank">Lihat situs</Link>
            <form action={logout}>
              <button type="submit">Keluar</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}

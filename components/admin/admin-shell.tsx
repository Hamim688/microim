"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { usePathname } from "next/navigation"
import { ExternalLink, Globe, Loader2, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react"
import { logout } from "@/app/admin/actions"
import { AdminAurora } from "./aurora"
import { AdminNav, type NavBadges } from "./admin-nav"
import { ConfirmDialog } from "./confirm-dialog"

export const SIDEBAR_COOKIE = "microim_sidebar"

function LogoutButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn is-danger" disabled={pending}>
      {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <LogOut aria-hidden="true" />}
      {pending ? "Keluar…" : "Ya, keluar"}
    </button>
  )
}

export function AdminShell({
  admin,
  badges,
  initialCollapsed,
  children,
}: {
  admin: { name: string | null; email: string }
  badges: NavBadges
  initialCollapsed: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialog, setDialog] = useState<"logout" | "site" | null>(null)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)

  // Tutup laci menu (HP) dan hentikan bar progres setiap kali halaman berganti.
  const [seenPath, setSeenPath] = useState(pathname)
  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setDrawerOpen(false)
    setNavigatingTo(null)
  }

  // Simpan pilihan sidebar di cookie supaya tidak "berkedip" saat halaman dimuat ulang.
  useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE}=${collapsed ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`
  }, [collapsed])

  // Ctrl/⌘ + B mengecilkan/membesarkan sidebar, Esc menutup laci menu.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
        event.preventDefault()
        setCollapsed((value) => !value)
      } else if (event.key === "Escape") {
        setDrawerOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Kunci scroll halaman saat laci menu terbuka.
  useEffect(() => {
    document.documentElement.classList.toggle("admin-lock", drawerOpen)
    return () => document.documentElement.classList.remove("admin-lock")
  }, [drawerOpen])

  const name = admin.name ?? "Admin"
  const initial = (admin.name ?? admin.email).charAt(0).toUpperCase()
  const track = (href: string) => setNavigatingTo(href)

  return (
    <div className="admin-shell" data-sidebar={collapsed ? "collapsed" : "expanded"} data-drawer={drawerOpen ? "open" : undefined}>
      <AdminAurora />
      <div className="admin-progress" data-active={navigatingTo ? "" : undefined} aria-hidden="true" />

      <header className="admin-topbar">
        <button
          type="button"
          className="admin-icon-btn is-plain"
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu"
          aria-expanded={drawerOpen}
          aria-controls="admin-sidebar"
        >
          <Menu aria-hidden="true" />
        </button>
        <Link href="/admin" className="admin-brand is-compact">
          <Image src="/logo/logo-baru.png" alt="" width={30} height={30} className="rounded-lg" />
          <span>Microim <small>Admin</small></span>
        </Link>
        <span className="admin-topbar-spacer" aria-hidden="true" />
      </header>

      <div className="admin-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />

      <aside id="admin-sidebar" className="admin-sidebar" aria-label="Navigasi admin">
        <div className="admin-sidebar-head">
          <Link href="/admin" className="admin-brand" data-label="Dashboard">
            <span className="admin-logo-ring">
              <Image src="/logo/logo-baru.png" alt="" width={36} height={36} className="rounded-xl" />
            </span>
            <span className="admin-brand-text">Microim <small>Panel Admin</small></span>
          </Link>
          <button
            type="button"
            className="admin-collapse"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Perbesar sidebar" : "Kecilkan sidebar"}
            aria-pressed={collapsed}
            data-label={collapsed ? "Perbesar · Ctrl+B" : "Kecilkan · Ctrl+B"}
          >
            {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
          </button>
          <button type="button" className="admin-drawer-close admin-icon-btn is-plain" onClick={() => setDrawerOpen(false)} aria-label="Tutup menu">
            <X aria-hidden="true" />
          </button>
        </div>

        <AdminNav badges={badges} onNavigate={track} />

        <div className="admin-sidebar-foot">
          <div className="admin-user" data-label={admin.email}>
            <span className="admin-avatar" aria-hidden="true">{initial}</span>
            <span className="admin-user-text">
              <strong>{name}</strong>
              <small>{admin.email}</small>
            </span>
          </div>
          <div className="admin-sidebar-actions">
            <button type="button" data-label="Lihat situs" onClick={() => setDialog("site")}>
              <Globe aria-hidden="true" />
              <span className="admin-nav-label">Lihat situs</span>
            </button>
            <button type="button" className="is-danger" data-label="Keluar" onClick={() => setDialog("logout")}>
              <LogOut aria-hidden="true" />
              <span className="admin-nav-label">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-main">{children}</main>

      <ConfirmDialog
        open={dialog === "logout"}
        onClose={() => setDialog(null)}
        tone="danger"
        icon={<LogOut />}
        title="Keluar dari panel admin?"
        description="Kamu perlu masuk lagi dengan email dan password. Data yang sudah tersimpan tetap aman."
      >
        <button type="button" className="admin-btn is-ghost" onClick={() => setDialog(null)} autoFocus>
          Batal
        </button>
        <form action={logout}>
          <LogoutButton />
        </form>
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === "site"}
        onClose={() => setDialog(null)}
        icon={<Globe />}
        title="Buka situs Microim?"
        description="Pilih buka di tab baru supaya panel admin tetap terbuka di tab ini."
      >
        <Link href="/" className="admin-btn is-ghost" onClick={() => setDialog(null)}>
          Buka di tab ini
        </Link>
        <button
          type="button"
          className="admin-btn is-primary"
          autoFocus
          onClick={() => {
            window.open("/", "_blank", "noopener,noreferrer")
            setDialog(null)
          }}
        >
          <ExternalLink aria-hidden="true" /> Buka di tab baru
        </button>
      </ConfirmDialog>
    </div>
  )
}

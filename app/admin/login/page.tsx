import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getAdmin } from "@/lib/auth/session"
import { AdminAurora } from "@/components/admin/aurora"
import { LoginForm } from "./login-form"
import "../admin.css"

export const metadata: Metadata = { title: "Masuk Admin", robots: { index: false, follow: false } }

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin")

  return (
    <div className="admin-login">
      <AdminAurora />
      <div className="admin-login-card admin-rise">
        <div className="admin-login-brand">
          <span className="admin-logo-ring">
            <Image src="/logo/logo-baru.png" alt="" width={44} height={44} className="rounded-xl" priority />
          </span>
          <div>
            <strong>Microim</strong>
            <span>Panel Admin</span>
          </div>
        </div>
        <h1>Selamat datang kembali</h1>
        <p>Kelola stok, transaksi, dan ringkasan penjualan Microim.</p>
        <LoginForm />
      </div>
      <Link href="/" className="admin-login-back admin-rise" style={{ animationDelay: "160ms" }}>
        <ArrowLeft aria-hidden="true" /> Kembali ke situs
      </Link>
    </div>
  )
}

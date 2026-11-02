import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth/session"
import { PasswordForm } from "./password-form"

export const metadata: Metadata = { title: "Akun" }

export default async function AccountPage() {
  const admin = await requireAdmin()
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Akun</h1>
          <p>Masuk sebagai <strong>{admin.email}</strong></p>
        </div>
      </header>
      <section className="admin-card admin-narrow">
        <h2>Ganti password</h2>
        <PasswordForm />
      </section>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/lib/auth/session"
import { ReviewForm } from "@/components/admin/review-form"
import { createReview } from "../actions"

export const metadata: Metadata = { title: "Tambah Ulasan" }

export default async function NewReviewPage() {
  await requireAdmin()
  return (
    <div className="admin-page">
      <Link href="/admin/ulasan" className="admin-back"><ArrowLeft aria-hidden="true" /> Ulasan</Link>
      <header className="admin-page-head"><div><h1>Tambah ulasan</h1></div></header>
      <section className="admin-card">
        <ReviewForm action={createReview} />
      </section>
    </div>
  )
}

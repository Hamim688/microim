"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"
import type { ReviewStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"

export type ReviewFormState = { error?: string } | undefined

const ReviewSchema = z.object({
  name: z.string().trim().min(2, { error: "Nama minimal 2 karakter." }).max(60, { error: "Nama maksimal 60 karakter." }),
  detail: z.string().trim().max(60, { error: "Keterangan maksimal 60 karakter." }).optional(),
  rating: z.coerce.number({ error: "Pilih jumlah bintang." }).int().min(1, { error: "Pilih jumlah bintang." }).max(5),
  item: z.string().trim().max(80, { error: "Produk/jasa maksimal 80 karakter." }).optional(),
  comment: z.string().trim().min(10, { error: "Isi ulasan minimal 10 karakter." }).max(600, { error: "Isi ulasan maksimal 600 karakter." }),
})

/** Segarkan panel admin sekaligus Beranda (tempat ulasan nanti tampil). */
function refresh() {
  revalidatePath("/", "layout")
}

/** Ulasan yang dimasukkan admin, mis. dari chat WhatsApp pelanggan (dengan izin pelanggan). */
export async function createReview(_state: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  await requireAdmin()
  const parsed = ReviewSchema.safeParse({
    name: formData.get("name"),
    detail: formData.get("detail") || undefined,
    rating: formData.get("rating"),
    item: formData.get("item") || undefined,
    comment: formData.get("comment"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  const publish = formData.get("publish") === "on"
  await db.review.create({ data: { ...parsed.data, status: publish ? "PUBLISHED" : "PENDING", source: "admin" } })
  refresh()
  redirect("/admin/ulasan?added=1")
}

const STATUSES: ReviewStatus[] = ["PENDING", "PUBLISHED", "HIDDEN"]

export async function setReviewStatus(id: string, status: ReviewStatus) {
  await requireAdmin()
  if (!STATUSES.includes(status)) return
  await db.review.update({ where: { id }, data: { status } })
  refresh()
}

export async function deleteReview(id: string) {
  await requireAdmin()
  await db.review.delete({ where: { id } })
  refresh()
}

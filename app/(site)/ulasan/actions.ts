"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import * as z from "zod"
import { db } from "@/lib/db"

export type PublicReviewState = {
  ok?: boolean
  error?: string
  name?: string
} | undefined

const COOLDOWN_COOKIE = "mcm_rev_ts"
const COOLDOWN_MS = 60_000

const PublicReviewSchema = z.object({
  name: z.string().trim().min(2, { error: "Nama minimal 2 karakter." }).max(60, { error: "Nama maksimal 60 karakter." }),
  detail: z.string().trim().max(60, { error: "Keterangan maksimal 60 karakter." }).optional(),
  rating: z.coerce.number({ error: "Pilih jumlah bintang." }).int().min(1, { error: "Pilih jumlah bintang." }).max(5),
  item: z.string().trim().max(80, { error: "Produk/jasa maksimal 80 karakter." }).optional(),
  comment: z.string().trim().min(10, { error: "Ulasan minimal 10 karakter." }).max(600, { error: "Ulasan maksimal 600 karakter." }),
})

/**
 * Mengirim ulasan pelanggan dari formulir publik `/ulasan`.
 * Ulasan selalu masuk dengan status PENDING agar ditinjau admin terlebih dahulu sebelum tampil di Beranda.
 */
export async function submitPublicReview(_state: PublicReviewState, formData: FormData): Promise<PublicReviewState> {
  // Honeypot anti-bot: kolom tersembunyi tidak pernah diisi manusia; balas sukses palsu agar bot berhenti.
  const trap = String(formData.get("website") ?? "").trim()
  if (trap) return { ok: true, name: "Pelanggan" }

  const jar = await cookies()
  const last = Number(jar.get(COOLDOWN_COOKIE)?.value ?? 0)
  if (last && Date.now() - last < COOLDOWN_MS) {
    return { error: "Tunggu sebentar sebelum mengirim ulasan lagi." }
  }

  const parsed = PublicReviewSchema.safeParse({
    name: formData.get("name"),
    detail: formData.get("detail") || undefined,
    rating: formData.get("rating"),
    item: formData.get("item") || undefined,
    comment: formData.get("comment"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  await db.review.create({
    data: {
      ...parsed.data,
      status: "PENDING",
      source: "web",
    },
  })

  jar.set(COOLDOWN_COOKIE, String(Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 300,
  })

  revalidatePath("/admin")
  revalidatePath("/admin/ulasan")

  return { ok: true, name: parsed.data.name }
}

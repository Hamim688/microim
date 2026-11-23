// Ulasan pelanggan untuk situs publik: hanya yang sudah disetujui admin (status PUBLISHED).
import { cache } from "react"
import { db } from "@/lib/db"

export type PublicReview = { id: string; name: string; detail: string | null; rating: number; item: string | null; comment: string }
export type ReviewSummary = { reviews: PublicReview[]; average: number; count: number }

/** Maksimal kartu ulasan yang tampil di Beranda (rata-rata tetap dihitung dari semua ulasan yang tampil). */
const SHOWN = 12

export const getPublishedReviews = cache(async (): Promise<ReviewSummary> => {
  try {
    const [reviews, agg] = await Promise.all([
      db.review.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        take: SHOWN,
        select: { id: true, name: true, detail: true, rating: true, item: true, comment: true },
      }),
      db.review.aggregate({ where: { status: "PUBLISHED" }, _avg: { rating: true }, _count: { _all: true } }),
    ])
    return { reviews, average: agg._avg.rating ?? 0, count: agg._count._all }
  } catch (error) {
    // Bila database tidak bisa diakses, section ulasan cukup disembunyikan.
    console.error("getPublishedReviews:", error)
    return { reviews: [], average: 0, count: 0 }
  }
})

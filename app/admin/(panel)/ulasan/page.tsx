import type { Metadata } from "next"
import Link from "next/link"
import { MessageSquareQuote, Plus, Star } from "lucide-react"
import type { ReviewStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { ReviewActions } from "@/components/admin/review-actions"
import { StatusTabs } from "@/components/admin/status-tabs"
import { deleteReview, setReviewStatus } from "./actions"

export const metadata: Metadata = { title: "Ulasan" }

const TABS: { key: ReviewStatus | "SEMUA"; label: string }[] = [
  { key: "SEMUA", label: "Semua" },
  { key: "PENDING", label: "Menunggu" },
  { key: "PUBLISHED", label: "Tampil" },
  { key: "HIDDEN", label: "Disembunyikan" },
]
const STATUS_LABEL: Record<ReviewStatus, string> = { PENDING: "Menunggu", PUBLISHED: "Tampil", HIDDEN: "Disembunyikan" }

const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })

function Stars({ value }: { value: number }) {
  return (
    <span className="admin-stars" role="img" aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((n) => <Star key={n} aria-hidden="true" className={n <= value ? "is-on" : undefined} />)}
    </span>
  )
}

export default async function ReviewsAdminPage({ searchParams }: { searchParams: Promise<{ status?: string; added?: string }> }) {
  await requireAdmin()
  const sp = await searchParams
  const active = TABS.some((t) => t.key === sp.status) ? (sp.status as ReviewStatus | "SEMUA") : "SEMUA"

  const [reviews, grouped, published] = await Promise.all([
    db.review.findMany({ where: active === "SEMUA" ? {} : { status: active }, orderBy: { createdAt: "desc" } }),
    db.review.groupBy({ by: ["status"], _count: { _all: true } }),
    db.review.aggregate({ where: { status: "PUBLISHED" }, _avg: { rating: true }, _count: { _all: true } }),
  ])
  const counts = { SEMUA: 0, PENDING: 0, PUBLISHED: 0, HIDDEN: 0 } as Record<ReviewStatus | "SEMUA", number>
  for (const g of grouped) {
    counts[g.status] = g._count._all
    counts.SEMUA += g._count._all
  }
  const average = published._avg.rating ?? 0

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Ulasan pelanggan</h1>
          <div className="admin-head-meta">
            <span>{counts.SEMUA} ulasan</span>
            <span className="admin-dot-sep" aria-hidden="true" />
            <span>{counts.PUBLISHED} tampil di situs</span>
            {counts.PENDING ? (
              <Link href="/admin/ulasan?status=PENDING" className="admin-head-alert" scroll={false}>{counts.PENDING} menunggu persetujuan</Link>
            ) : null}
          </div>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/ulasan/baru" className="admin-btn is-primary"><Plus aria-hidden="true" /> Tambah ulasan</Link>
        </div>
      </header>
      {sp.added ? <p className="admin-alert is-success" role="status">Ulasan berhasil disimpan.</p> : null}

      <div className="admin-review-summary">
        <div>
          <strong>{published._count._all ? average.toLocaleString("id-ID", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : "—"}</strong>
          <Stars value={Math.round(average)} />
        </div>
        <p>
          {published._count._all
            ? `Rata-rata dari ${published._count._all} ulasan yang tampil di situs. Angka ini yang nanti ditampilkan di Beranda.`
            : "Belum ada ulasan yang tampil. Tambahkan ulasan pertama dari chat pelanggan (dengan izin mereka)."}
        </p>
      </div>

      <div className="admin-card is-table">
        <div className="admin-table-toolbar">
          <StatusTabs
            id="ulasan"
            label="Filter status ulasan"
            active={active}
            tabs={TABS.map((t) => ({ key: t.key, href: t.key === "SEMUA" ? "/admin/ulasan" : `/admin/ulasan?status=${t.key}`, label: t.label, count: counts[t.key] }))}
          />
        </div>

        {reviews.length === 0 ? (
          <div className="admin-empty admin-review-empty">
            <MessageSquareQuote aria-hidden="true" className="admin-empty-icon" />
            <p>{active === "SEMUA" ? "Belum ada ulasan." : `Tidak ada ulasan berstatus "${TABS.find((t) => t.key === active)?.label}".`}</p>
          </div>
        ) : (
          <ul className="admin-review-list admin-stagger">
            {reviews.map((r) => (
              <li key={r.id} className={`admin-review is-${r.status.toLowerCase()}`}>
                <div className="admin-review-head">
                  <span className="admin-review-avatar" aria-hidden="true">{r.name.trim().charAt(0).toUpperCase()}</span>
                  <div>
                    <strong>{r.name}</strong>
                    <small>{[r.detail, dateFmt.format(r.createdAt), r.source === "web" ? "dari formulir situs" : r.source === "contoh" ? "ulasan contoh" : "dimasukkan admin"].filter(Boolean).join(" · ")}</small>
                  </div>
                  {r.source === "contoh" ? <span className="admin-review-status is-sample" title="Data contoh, bukan ulasan pelanggan sungguhan">Contoh</span> : null}
                  <span className={`admin-review-status is-${r.status.toLowerCase()}`}>{STATUS_LABEL[r.status]}</span>
                </div>
                <Stars value={r.rating} />
                <p className="admin-review-text">{r.comment}</p>
                {r.item ? <p className="admin-review-item">Membeli: {r.item}</p> : null}
                <ReviewActions
                  name={r.name}
                  status={r.status}
                  setStatus={setReviewStatus.bind(null, r.id)}
                  remove={deleteReview.bind(null, r.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

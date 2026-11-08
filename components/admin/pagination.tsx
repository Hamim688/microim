import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

/** Daftar halaman ringkas: 1 … 4 5 6 … 12 */
function pageList(page: number, pages: number) {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages))
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | "gap")[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap")
    out.push(p)
  })
  return out
}

export function Pagination({
  page,
  pages,
  total,
  from,
  to,
  unit,
  href,
}: {
  page: number
  pages: number
  total: number
  from: number
  to: number
  unit: string
  href: (page: number) => string
}) {
  return (
    <nav className="admin-pagination" aria-label="Halaman">
      <span className="admin-pagination-info">
        {total ? `${from}–${to} dari ${total} ${unit}` : `0 ${unit}`}
      </span>
      {pages > 1 ? (
        <div className="admin-pagination-pages">
          {page > 1 ? (
            <Link href={href(page - 1)} className="admin-page-btn" aria-label="Halaman sebelumnya" scroll={false}><ChevronLeft aria-hidden="true" /></Link>
          ) : (
            <span className="admin-page-btn is-disabled" aria-hidden="true"><ChevronLeft /></span>
          )}
          {pageList(page, pages).map((p, i) =>
            p === "gap" ? (
              <span key={`gap-${i}`} className="admin-page-gap">…</span>
            ) : (
              <Link key={p} href={href(p)} className={`admin-page-btn${p === page ? " is-active" : ""}`} aria-current={p === page ? "page" : undefined} scroll={false}>
                {p}
              </Link>
            ),
          )}
          {page < pages ? (
            <Link href={href(page + 1)} className="admin-page-btn" aria-label="Halaman berikutnya" scroll={false}><ChevronRight aria-hidden="true" /></Link>
          ) : (
            <span className="admin-page-btn is-disabled" aria-hidden="true"><ChevronRight /></span>
          )}
        </div>
      ) : null}
    </nav>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowUp, ArrowUpDown, Coins, Download, PackageOpen, Pencil, Plus, TrendingUp, Wallet } from "lucide-react"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { rupiah } from "@/lib/admin/format"
import { SERVICE_CATEGORY_SLUG, stockStatusLabel, type StockStatus } from "@/lib/admin/settings"
import { stockReport } from "@/lib/admin/stock-report"
import { ThresholdForm } from "@/components/admin/threshold-form"
import { Pagination } from "@/components/admin/pagination"
import { ProductFilters } from "@/components/admin/product-filters"
import { RestockButton } from "@/components/admin/restock-button"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { ProductThumb } from "@/components/admin/product-thumb"
import { adjustStock, deleteProduct, setLowStockThreshold } from "./actions"

export const metadata: Metadata = { title: "Produk & Stok" }

const SORTS = {
  nama: "Produk",
  kategori: "Kategori",
  modal: "Modal",
  jual: "Harga jual",
  margin: "Margin",
  masuk: "Masuk",
  terjual: "Terjual",
  sisa: "Sisa",
} as const
type SortKey = keyof typeof SORTS
const STATUSES: StockStatus[] = ["habis", "menipis", "aman"]
const PER_PAGE = [10, 25, 50]

// Warna label kategori dipilih dari nama kategori supaya konsisten.
const TONES = ["gold", "blue", "green", "violet", "cyan", "rose", "orange", "slate"] as const
function tone(name: string) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return TONES[h % TONES.length]
}

const relative = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" })
function ago(date: Date) {
  const minutes = Math.round((date.getTime() - Date.now()) / 60_000)
  if (Math.abs(minutes) < 60) return relative.format(minutes, "minute")
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return relative.format(hours, "hour")
  return relative.format(Math.round(hours / 24), "day")
}

type SP = { q?: string; kategori?: string; status?: string; urut?: string; arah?: string; hal?: string; per?: string; deleted?: string }

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdmin()
  const sp = await searchParams
  const q = sp.q?.trim() ?? ""
  const kategori = sp.kategori ?? ""
  const status = STATUSES.includes(sp.status as StockStatus) ? (sp.status as StockStatus) : undefined
  const sort: SortKey = sp.urut && sp.urut in SORTS ? (sp.urut as SortKey) : "nama"
  const dir = sp.arah === "desc" ? "desc" : "asc"
  const perPage = PER_PAGE.includes(Number(sp.per)) ? Number(sp.per) : PER_PAGE[0]

  const [{ rows: all, threshold }, categories] = await Promise.all([
    stockReport(),
    db.category.findMany({ where: { slug: { not: SERVICE_CATEGORY_SLUG } }, orderBy: { name: "asc" }, select: { name: true, slug: true } }),
  ])

  // Ringkasan seluruh gudang (tidak terpengaruh filter).
  const counts = { habis: 0, menipis: 0, aman: 0 } as Record<StockStatus, number>
  for (const p of all) counts[p.status]++
  // Potensi omzet & laba hanya dihitung dari produk yang modalnya sudah diisi, supaya tidak menggelembung.
  const valued = all.filter((p) => p.modal > 0)
  const totalModal = valued.reduce((s, p) => s + p.sisa * p.modal, 0)
  const totalJual = valued.reduce((s, p) => s + p.sisa * p.jual, 0)
  const totalSisa = all.reduce((s, p) => s + p.sisa, 0)
  const avgMargin = totalJual > 0 ? Math.round(((totalJual - totalModal) / totalJual) * 100) : 0
  const lastUpdate = all.reduce<Date | null>((d, p) => (!d || p.updatedAt > d ? p.updatedAt : d), null)
  const missingCost = all.filter((p) => p.modal === 0).length
  const noCostAtAll = all.length > 0 && missingCost === all.length

  const filtered = all.filter(
    (p) => (!q || p.name.toLowerCase().includes(q.toLowerCase())) && (!kategori || p.kategoriSlug === kategori),
  )
  const filteredCounts = { habis: 0, menipis: 0, aman: 0 } as Record<StockStatus, number>
  for (const p of filtered) filteredCounts[p.status]++

  const rows = filtered
    .filter((p) => !status || p.status === status)
    .sort((a, b) => {
      const key = sort === "nama" ? "name" : sort
      const va = a[key as keyof typeof a]
      const vb = b[key as keyof typeof b]
      const cmp = typeof va === "string" ? va.localeCompare(String(vb), "id") : Number(va) - Number(vb)
      return (dir === "asc" ? cmp : -cmp) || a.name.localeCompare(b.name, "id")
    })

  const pages = Math.max(1, Math.ceil(rows.length / perPage))
  const page = Math.min(pages, Math.max(1, Number(sp.hal) || 1))
  const start = (page - 1) * perPage
  const pageRows = rows.slice(start, start + perPage)

  const href = (patch: Partial<Record<"status" | "urut" | "arah" | "hal", string | undefined>>) => {
    const params = new URLSearchParams()
    const next = {
      q,
      kategori,
      per: perPage === PER_PAGE[0] ? undefined : String(perPage),
      status,
      urut: sort === "nama" ? undefined : sort,
      arah: dir === "asc" ? undefined : dir,
      hal: undefined,
      ...patch,
    }
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v)
    const s = params.toString()
    return `/admin/produk${s ? `?${s}` : ""}`
  }
  const th = (k: SortKey, num?: boolean, col?: string) => {
    const active = sort === k
    const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown
    const nextDir = active ? (dir === "asc" ? "desc" : "asc") : k === "nama" || k === "kategori" ? "asc" : "desc"
    return (
      <th key={k} className={[num ? "is-num" : "", col ?? ""].join(" ").trim() || undefined} aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : undefined}>
        <Link href={href({ urut: k === "nama" ? undefined : k, arah: nextDir === "asc" ? undefined : "desc" })} className={`admin-sort${active ? " is-active" : ""}`} scroll={false}>
          {SORTS[k]} <Icon aria-hidden="true" />
        </Link>
      </th>
    )
  }
  const pct = (n: number) => (all.length ? (n / all.length) * 100 : 0)
  const alerts = counts.habis + counts.menipis

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Produk & Stok</h1>
          <div className="admin-head-meta">
            <span>{all.length} produk</span>
            <span className="admin-dot-sep" aria-hidden="true" />
            <span>{totalSisa.toLocaleString("id-ID")} pcs di gudang</span>
            {lastUpdate ? (
              <>
                <span className="admin-dot-sep" aria-hidden="true" />
                <span title={lastUpdate.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}>diperbarui {ago(lastUpdate)}</span>
              </>
            ) : null}
            {alerts ? (
              <Link href={href({ status: counts.habis ? "habis" : "menipis" })} className="admin-head-alert" scroll={false}>
                {counts.habis ? `${counts.habis} habis` : null}
                {counts.habis && counts.menipis ? " · " : null}
                {counts.menipis ? `${counts.menipis} menipis` : null}
              </Link>
            ) : (
              <span className="admin-head-ok">Semua stok aman</span>
            )}
          </div>
        </div>
        <div className="admin-head-actions">
          <a href="/admin/produk/ekspor" className="admin-btn is-ghost" download>
            <Download aria-hidden="true" /> Ekspor CSV
          </a>
          <Link href="/admin/produk/baru" className="admin-btn is-primary"><Plus aria-hidden="true" /> Tambah produk</Link>
        </div>
      </header>
      {sp.deleted ? <p className="admin-alert is-success" role="status">Produk berhasil dihapus.</p> : null}
      {missingCost ? (
        <p className="admin-alert is-warn" role="status">
          {missingCost} produk belum punya harga modal, jadi margin dan laba belum akurat. Isi lewat tombol edit di tiap produk.
        </p>
      ) : null}

      <div className="admin-inv-stats admin-stagger">
        <div className="admin-inv-stat">
          <i className="is-blue"><Wallet aria-hidden="true" /></i>
          <span>Modal tertanam</span>
          <strong>{rupiah(totalModal)}</strong>
          <small>nilai beli stok tersisa</small>
        </div>
        <div className="admin-inv-stat">
          <i className="is-gold"><Coins aria-hidden="true" /></i>
          <span>Potensi omzet</span>
          <strong>{rupiah(totalJual)}</strong>
          <small>{missingCost ? `${valued.length} produk bermodal` : "jika semua stok terjual"}</small>
        </div>
        <div className="admin-inv-stat">
          <i className={totalJual - totalModal < 0 ? "is-red" : "is-green"}><TrendingUp aria-hidden="true" /></i>
          <span>Potensi laba</span>
          {noCostAtAll ? (
            <>
              <strong className="admin-muted">—</strong>
              <small>isi harga modal dulu</small>
            </>
          ) : (
            <>
              <strong className={totalJual - totalModal < 0 ? "is-loss" : "is-gain"}>{rupiah(totalJual - totalModal)}</strong>
              <small>rata-rata margin {avgMargin}%</small>
            </>
          )}
        </div>
        <div className="admin-inv-stat">
          <i className="is-violet"><PackageOpen aria-hidden="true" /></i>
          <span>Kesehatan stok</span>
          <div className="admin-health" role="img" aria-label={`${counts.aman} aman, ${counts.menipis} menipis, ${counts.habis} habis`}>
            <span className="is-aman" style={{ width: `${pct(counts.aman)}%` }} />
            <span className="is-menipis" style={{ width: `${pct(counts.menipis)}%` }} />
            <span className="is-habis" style={{ width: `${pct(counts.habis)}%` }} />
          </div>
          <small className="admin-health-legend">
            <b className="is-aman">{counts.aman}</b> aman · <b className="is-menipis">{counts.menipis}</b> menipis · <b className="is-habis">{counts.habis}</b> habis
          </small>
        </div>
      </div>

      <div className="admin-card is-table">
        <div className="admin-table-toolbar">
          <div className="admin-status-tabs" role="tablist" aria-label="Filter status stok">
            <Link href={href({ status: undefined })} className={!status ? "is-active" : undefined} role="tab" aria-selected={!status} scroll={false}>
              Semua <b>{filtered.length}</b>
            </Link>
            {STATUSES.map((s) => (
              <Link key={s} href={href({ status: s })} className={`is-${s}${status === s ? " is-active" : ""}`} role="tab" aria-selected={status === s} scroll={false}>
                <i aria-hidden="true" /> {stockStatusLabel[s]} <b>{filteredCounts[s]}</b>
              </Link>
            ))}
          </div>
          <ThresholdForm action={setLowStockThreshold} value={threshold} />
        </div>
        <div className="admin-table-toolbar is-second">
          <ProductFilters categories={categories} perPageOptions={PER_PAGE} />
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table admin-stock-table">
            <thead>
              <tr>
                <th className="is-num col-no">No</th>
                {th("nama")}
                {th("kategori")}
                {th("modal", true, "col-modal")}
                {th("jual", true)}
                {th("margin", true)}
                {th("masuk", true, "col-flow")}
                {th("terjual", true, "col-flow")}
                {th("sisa", true)}
                <th>Status</th>
                <th className="is-action is-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="admin-stagger">
              {pageRows.map((p, i) => {
                const fill = p.masuk > 0 ? Math.min(100, Math.round((p.sisa / Math.max(p.masuk, p.sisa)) * 100)) : p.sisa > 0 ? 100 : 0
                return (
                  <tr key={p.id} className={`is-${p.status}`}>
                    <td className="is-num admin-muted col-no">{start + i + 1}</td>
                    <td>
                      <div className="admin-product-cell">
                        <ProductThumb src={p.imageUrl} name={p.name} meta={`${p.kategori} · ${rupiah(p.jual)} · stok ${p.sisa}`} />
                        <Link href={`/admin/produk/${p.id}`} className="admin-product-name">{p.name}</Link>
                      </div>
                    </td>
                    <td><span className={`admin-chip is-${tone(p.kategori)}`}>{p.kategori}</span></td>
                    <td className="is-num col-modal">{p.modal ? rupiah(p.modal) : <span className="admin-muted" title="Modal belum diisi">—</span>}</td>
                    <td className="is-num">
                      {rupiah(p.jual)}
                      {p.modal ? <small className="admin-cell-sub col-modal-alt">modal {rupiah(p.modal)}</small> : null}
                    </td>
                    <td className={`is-num ${p.margin < 0 ? "is-minus" : "is-plus"}`}>
                      {p.modal ? rupiah(p.margin) : <span className="admin-muted">—</span>}
                      {p.modal && p.jual > 0 ? <small className="admin-cell-sub">{p.marginPct}%</small> : null}
                    </td>
                    <td className="is-num col-flow">{p.masuk}</td>
                    <td className="is-num col-flow">{p.terjual}</td>
                    <td className="is-num">
                      <div className="admin-sisa">
                        <strong>{p.sisa}</strong>
                        <span className={`admin-sisa-bar is-${p.status}`} aria-hidden="true"><span style={{ width: `${fill}%` }} /></span>
                      </div>
                      <small className="admin-cell-sub col-flow-alt">masuk {p.masuk} · terjual {p.terjual}</small>
                      {p.koreksi !== 0 ? <small className="admin-cell-sub" title="Selisih dari koreksi stok manual">koreksi {p.koreksi > 0 ? `+${p.koreksi}` : p.koreksi}</small> : null}
                    </td>
                    <td><span className={`admin-status is-${p.status}`}>{stockStatusLabel[p.status]}</span></td>
                    <td className="is-action">
                      <div className="admin-row-actions">
                        <RestockButton action={adjustStock.bind(null, p.id)} name={p.name} stock={p.sisa} />
                        <Link href={`/admin/produk/${p.id}`} className="admin-row-btn is-edit" data-tip="Edit" aria-label={`Edit ${p.name}`}>
                          <Pencil aria-hidden="true" />
                        </Link>
                        <DeleteProductButton action={deleteProduct.bind(null, p.id)} name={p.name} soldCount={p.soldCount} />
                      </div>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="admin-empty">
                    <PackageOpen aria-hidden="true" className="admin-empty-icon" />
                    {q || kategori || status ? "Tidak ada produk yang cocok dengan filter ini." : "Belum ada produk."}
                    {q || kategori || status ? <Link href="/admin/produk" className="admin-link">Reset filter</Link> : null}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pages={pages}
          total={rows.length}
          from={rows.length ? start + 1 : 0}
          to={start + pageRows.length}
          unit="produk"
          href={(p) => href({ hal: p > 1 ? String(p) : undefined })}
        />
      </div>
    </div>
  )
}

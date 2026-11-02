import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { LOW_STOCK, rupiah } from "@/lib/admin/format"

export const metadata: Metadata = { title: "Produk & Stok" }

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; kategori?: string; deleted?: string }> }) {
  await requireAdmin()
  const { q = "", kategori = "", deleted } = await searchParams
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: {
        ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
        ...(kategori ? { category: { slug: kategori } } : {}),
      },
      include: { category: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true } }),
  ])
  const stockValue = products.reduce((sum, p) => sum + Number(p.price) * p.stock, 0)
  const lowCount = products.filter((p) => p.stock <= LOW_STOCK).length

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Produk & Stok</h1>
          <p>{products.length} produk · nilai stok {rupiah(stockValue)}{lowCount ? ` · ${lowCount} stok menipis` : ""}</p>
        </div>
        <Link href="/admin/produk/baru" className="admin-btn is-primary"><Plus aria-hidden="true" /> Tambah produk</Link>
      </header>
      {deleted ? <p className="admin-alert is-success" role="status">Produk berhasil dihapus.</p> : null}

      <form className="admin-toolbar" role="search">
        <label className="admin-search">
          <Search aria-hidden="true" />
          <input name="q" defaultValue={q} placeholder="Cari nama produk…" aria-label="Cari produk" />
        </label>
        <select name="kategori" defaultValue={kategori} aria-label="Filter kategori">
          <option value="">Semua kategori</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <button type="submit" className="admin-btn">Terapkan</button>
      </form>

      <div className="admin-card is-flush">
        <table className="admin-table">
          <thead>
            <tr><th>Produk</th><th>Kategori</th><th className="is-num">Harga</th><th className="is-num">Stok</th><th aria-label="Aksi" /></tr>
          </thead>
          <tbody className="admin-stagger">
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="admin-product-cell">
                    {p.imageUrl ? <Image src={p.imageUrl} alt="" width={40} height={40} /> : <span className="admin-thumb-empty" />}
                    <Link href={`/admin/produk/${p.id}`}>{p.name}</Link>
                  </div>
                </td>
                <td>{p.category.name}</td>
                <td className="is-num">{rupiah(p.price)}</td>
                <td className="is-num"><span className={`admin-stock${p.stock <= LOW_STOCK ? " is-low" : ""}`}>{p.stock}</span></td>
                <td className="is-action"><Link href={`/admin/produk/${p.id}`} className="admin-link">Kelola</Link></td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr><td colSpan={5} className="admin-empty">{q || kategori ? "Tidak ada produk yang cocok." : "Belum ada produk. Tambahkan produk pertama atau jalankan seed."}</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

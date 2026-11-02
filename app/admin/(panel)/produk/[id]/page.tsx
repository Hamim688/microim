import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { categoryNames, productImages } from "@/lib/admin/catalog"
import { LOW_STOCK, formatDateTime, movementLabel, rupiah } from "@/lib/admin/format"
import { ProductForm } from "@/components/admin/product-form"
import { StockForm } from "@/components/admin/stock-form"
import { adjustStock, deleteProduct, updateProduct } from "../actions"

export const metadata: Metadata = { title: "Kelola Produk" }

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const { saved, error } = await searchParams
  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      stockMovements: { orderBy: { createdAt: "desc" }, take: 30, include: { order: { select: { id: true, orderNumber: true } } } },
      _count: { select: { orderItems: true } },
    },
  })
  if (!product) notFound()
  const [categories, images] = await Promise.all([categoryNames(), productImages()])

  return (
    <div className="admin-page">
      <Link href="/admin/produk" className="admin-back"><ArrowLeft aria-hidden="true" /> Produk & Stok</Link>
      <header className="admin-page-head">
        <div>
          <h1>{product.name}</h1>
          <p>{product.category.name} · {rupiah(product.price)} · stok <span className={`admin-stock${product.stock <= LOW_STOCK ? " is-low" : ""}`}>{product.stock}</span></p>
        </div>
      </header>
      {saved ? <p className="admin-alert is-success" role="status">Produk tersimpan.</p> : null}
      {error === "terjual" ? (
        <p className="admin-alert is-error" role="alert">Produk ini sudah pernah terjual sehingga tidak bisa dihapus (riwayat transaksi harus tetap utuh). Jika tidak dijual lagi, koreksi stoknya menjadi 0.</p>
      ) : null}

      <div className="admin-columns">
        <section className="admin-card">
          <h2>Data produk</h2>
          <ProductForm
            action={updateProduct.bind(null, product.id)}
            categories={categories}
            images={images}
            initial={{
              name: product.name,
              category: product.category.name,
              price: Number(product.price),
              imageUrl: product.imageUrl ?? "",
              description: product.description,
            }}
            submitLabel="Simpan perubahan"
          />
        </section>
        <section className="admin-card">
          <h2>Ubah stok</h2>
          <StockForm action={adjustStock.bind(null, product.id)} current={product.stock} />
        </section>
      </div>

      <section className="admin-card is-flush">
        <h2 className="admin-card-title">Riwayat stok</h2>
        <table className="admin-table">
          <thead><tr><th>Waktu</th><th>Jenis</th><th className="is-num">Perubahan</th><th className="is-num">Stok</th><th>Keterangan</th></tr></thead>
          <tbody>
            {product.stockMovements.map((m) => (
              <tr key={m.id}>
                <td>{formatDateTime(m.createdAt)}</td>
                <td>{movementLabel[m.type]}</td>
                <td className={`is-num ${m.change > 0 ? "is-plus" : "is-minus"}`}>{m.change > 0 ? `+${m.change}` : m.change}</td>
                <td className="is-num">{m.stockAfter}</td>
                <td>
                  {m.order ? <Link href={`/admin/transaksi/${m.order.id}`} className="admin-link">{m.order.orderNumber}</Link> : null}
                  {m.order && m.note ? " · " : null}
                  {m.note}
                </td>
              </tr>
            ))}
            {product.stockMovements.length === 0 ? <tr><td colSpan={5} className="admin-empty">Belum ada riwayat stok.</td></tr> : null}
          </tbody>
        </table>
      </section>

      <details className="admin-danger">
        <summary><Trash2 aria-hidden="true" /> Hapus produk</summary>
        {product._count.orderItems > 0 ? (
          <p>Produk ini sudah muncul di {product._count.orderItems} transaksi, jadi tidak bisa dihapus. Koreksi stoknya menjadi 0 bila tidak dijual lagi.</p>
        ) : (
          <form action={deleteProduct.bind(null, product.id)}>
            <p>Produk dan seluruh riwayat stoknya akan dihapus permanen.</p>
            <button type="submit" className="admin-btn is-danger">Ya, hapus {product.name}</button>
          </form>
        )}
      </details>
    </div>
  )
}

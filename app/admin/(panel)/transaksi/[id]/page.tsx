import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import type { OrderStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { formatDateTime, orderStatusLabel, paymentLabel, rupiah } from "@/lib/admin/format"
import { StatusBadge } from "@/components/admin/status-badge"
import { deleteOrder, setOrderStatus } from "../actions"

export const metadata: Metadata = { title: "Detail Transaksi" }

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const { saved, error } = await searchParams
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { id: true, name: true } } } } },
  })
  if (!order) notFound()
  const qty = order.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="admin-page">
      <Link href="/admin/transaksi" className="admin-back"><ArrowLeft aria-hidden="true" /> Transaksi</Link>
      <header className="admin-page-head">
        <div>
          <h1>{order.customerName} <StatusBadge status={order.status} /></h1>
          <p>{order.orderNumber} · {formatDateTime(order.createdAt)}</p>
        </div>
        <Link href={`/admin/transaksi/${order.id}/edit`} className="admin-btn"><Pencil aria-hidden="true" /> Edit</Link>
      </header>
      {saved ? <p className="admin-alert is-success" role="status">Transaksi tersimpan.</p> : null}
      {error ? <p className="admin-alert is-error" role="alert">{error}</p> : null}

      <div className="admin-columns is-wide-left">
        <section className="admin-card is-flush">
          <h2 className="admin-card-title">Komponen ({order.items.length} jenis · {qty} barang)</h2>
          <table className="admin-table">
            <thead><tr><th>Komponen</th><th className="is-num">Jumlah</th><th className="is-num">Harga</th><th className="is-num">Subtotal</th></tr></thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.id}>
                  <td><Link href={`/admin/produk/${i.product.id}`} className="admin-link">{i.product.name}</Link></td>
                  <td className="is-num">{i.quantity}</td>
                  <td className="is-num">{rupiah(i.price)}</td>
                  <td className="is-num">{rupiah(Number(i.price) * i.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={3}>Total</td><td className="is-num">{rupiah(order.totalAmount)}</td></tr></tfoot>
          </table>
        </section>

        <div className="admin-stack">
          <section className="admin-card">
            <h2>Info</h2>
            <dl className="admin-dl">
              <dt>Pembeli</dt><dd>{order.customerName}</dd>
              <dt>Kontak</dt><dd>{order.customerContact || "—"}</dd>
              <dt>Pembayaran</dt><dd>{paymentLabel[order.paymentMethod]}</dd>
              <dt>Catatan</dt><dd>{order.note || "—"}</dd>
            </dl>
          </section>
          <section className="admin-card">
            <h2>Ubah status</h2>
            <form action={setOrderStatus.bind(null, order.id)} className="admin-status-buttons">
              {(Object.keys(orderStatusLabel) as OrderStatus[]).map((s) => (
                <button key={s} type="submit" name="status" value={s} className={`admin-btn${s === order.status ? " is-current" : " is-ghost"}`} disabled={s === order.status}>
                  {orderStatusLabel[s]}
                </button>
              ))}
            </form>
            <p className="admin-muted">Status Batal mengembalikan stok; membatalkan status Batal akan mengurangi stok lagi.</p>
          </section>
        </div>
      </div>

      <details className="admin-danger">
        <summary><Trash2 aria-hidden="true" /> Hapus transaksi</summary>
        <form action={deleteOrder.bind(null, order.id)}>
          <p>Transaksi dihapus permanen{order.status !== "CANCELLED" ? " dan stok komponennya dikembalikan" : ""}. Untuk pesanan yang tidak jadi, lebih baik ubah status ke Batal agar tetap tercatat.</p>
          <button type="submit" className="admin-btn is-danger">Ya, hapus {order.orderNumber}</button>
        </form>
      </details>
    </div>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Ban, Check, CheckCircle2, Clock3, Package, PackageCheck, Truck, Wrench } from "lucide-react"
import type { OrderStatus } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { formatDateTime, orderStatusLabel, orderStatusTone, paymentLabel, rupiah } from "@/lib/admin/format"
import { itemName } from "@/lib/admin/order-items"
import { OrderDetailActions } from "@/components/admin/order-detail-actions"
import { deleteOrder, setOrderStatus } from "../actions"

export const metadata: Metadata = { title: "Detail Transaksi" }

const FLOW: { status: OrderStatus; icon: typeof Clock3 }[] = [
  { status: "PENDING", icon: Clock3 },
  { status: "PAID", icon: CheckCircle2 },
  { status: "SHIPPED", icon: Truck },
  { status: "DELIVERED", icon: PackageCheck },
]

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

  const comps = order.items.filter((i) => i.itemType === "COMPONENT")
  const servs = order.items.filter((i) => i.itemType === "SERVICE")
  const sum = (list: typeof order.items) => list.reduce((s, i) => s + Number(i.price) * i.quantity, 0)
  const profit = order.items.reduce((s, i) => s + i.quantity * (Number(i.price) - Number(i.costPrice)), 0)
  const qty = order.items.reduce((s, i) => s + i.quantity, 0)
  const cancelled = order.status === "CANCELLED"
  const stepIndex = FLOW.findIndex((f) => f.status === order.status)
  const changeStatus = setOrderStatus.bind(null, order.id)

  const nota = [
    "*Nota Microim*",
    `No: ${order.orderNumber}`,
    `Tanggal: ${formatDateTime(order.createdAt)}`,
    `Pembeli: ${order.customerName}`,
    "",
    ...order.items.map((i, n) => `${n + 1}. ${itemName(i)} x${i.quantity} @${rupiah(i.price)} = ${rupiah(Number(i.price) * i.quantity)}`),
    "",
    `*Total: ${rupiah(order.totalAmount)}*`,
    `Status: ${orderStatusLabel[order.status]} (${paymentLabel[order.paymentMethod]})`,
    "",
    "Terima kasih sudah belanja di Microim 🙏",
  ].join("\n")

  return (
    <div className="admin-page">
      <Link href="/admin/transaksi" className="admin-back"><ArrowLeft aria-hidden="true" /> Transaksi</Link>
      <header className="admin-page-head">
        <div>
          <h1>{order.customerName} <span className={`admin-badge is-${orderStatusTone[order.status]}`}>{orderStatusLabel[order.status]}</span></h1>
          <div className="admin-head-meta">
            <span>{order.orderNumber}</span>
            <span className="admin-dot-sep" aria-hidden="true" />
            <span>{formatDateTime(order.createdAt)}</span>
            <span className="admin-dot-sep" aria-hidden="true" />
            <span>{paymentLabel[order.paymentMethod]}</span>
          </div>
        </div>
        <OrderDetailActions
          id={order.id}
          number={order.orderNumber}
          customer={order.customerName}
          contact={order.customerContact}
          nota={nota}
          cancelled={cancelled}
          remove={deleteOrder.bind(null, order.id)}
        />
      </header>
      {saved ? <p className="admin-alert is-success" role="status">Transaksi tersimpan.</p> : null}
      {error ? <p className="admin-alert is-error" role="alert">{error}</p> : null}

      <section className="admin-card admin-flow-card">
        <form action={changeStatus} className="admin-flow" aria-label="Ubah status transaksi">
          {FLOW.map(({ status, icon: Icon }, i) => {
            const done = !cancelled && i < stepIndex
            const current = !cancelled && i === stepIndex
            return (
              <button
                key={status}
                type="submit"
                name="status"
                value={status}
                disabled={current}
                className={`admin-flow-step${done ? " is-done" : ""}${current ? " is-current" : ""}`}
                aria-current={current ? "step" : undefined}
              >
                <span className="admin-flow-dot">{done ? <Check aria-hidden="true" /> : <Icon aria-hidden="true" />}</span>
                <span>{orderStatusLabel[status]}</span>
              </button>
            )
          })}
          <button type="submit" name="status" value="CANCELLED" disabled={cancelled} className={`admin-flow-cancel${cancelled ? " is-current" : ""}`}>
            <Ban aria-hidden="true" /> {cancelled ? "Dibatalkan" : "Batalkan"}
          </button>
        </form>
        <p className="admin-muted">
          {cancelled
            ? "Transaksi batal: stok komponen sudah dikembalikan. Pilih status lain untuk mengaktifkan lagi (stok akan dikurangi)."
            : "Klik tahap untuk mengubah status. Membatalkan transaksi akan mengembalikan stok komponen."}
        </p>
      </section>

      <div className="admin-columns is-wide-left">
        <section className="admin-card is-flush">
          <h2 className="admin-card-title">
            Item pesanan <small>{order.items.length} item · {qty} pcs</small>
          </h2>
          <table className="admin-table">
            <thead>
              <tr><th>Item</th><th className="is-num">Jumlah</th><th className="is-num">Harga</th><th className="is-num">Subtotal</th></tr>
            </thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <div className="admin-item-name">
                      <span className={`admin-type-icon is-${i.itemType === "COMPONENT" ? "component" : "service"}`} aria-hidden="true">
                        {i.itemType === "COMPONENT" ? <Package /> : <Wrench />}
                      </span>
                      {i.product ? (
                        <Link href={`/admin/produk/${i.product.id}`} className="admin-product-name">{itemName(i)}</Link>
                      ) : (
                        <span className="admin-product-name">{itemName(i)}</span>
                      )}
                      <span className={`admin-type is-${i.itemType === "COMPONENT" ? "component" : "service"}`}>{i.itemType === "COMPONENT" ? "Komponen" : "Jasa"}</span>
                    </div>
                  </td>
                  <td className="is-num">{i.quantity}</td>
                  <td className="is-num">{rupiah(i.price)}</td>
                  <td className="is-num">{rupiah(Number(i.price) * i.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="admin-stack">
          <section className="admin-card">
            <h2>Ringkasan</h2>
            <dl className="admin-of-totals">
              <div><dt>Komponen ({comps.length})</dt><dd>{rupiah(sum(comps))}</dd></div>
              <div><dt>Jasa ({servs.length})</dt><dd>{rupiah(sum(servs))}</dd></div>
              <div className="is-total"><dt>Total</dt><dd>{rupiah(order.totalAmount)}</dd></div>
              {!cancelled ? (
                <div className={`is-profit${profit < 0 ? " is-loss" : ""}`}><dt>Laba kotor</dt><dd>{rupiah(profit)}</dd></div>
              ) : null}
            </dl>
          </section>
          <section className="admin-card">
            <h2>Info pembeli</h2>
            <dl className="admin-dl">
              <dt>Nama</dt><dd>{order.customerName}</dd>
              <dt>Kontak</dt><dd>{order.customerContact || "—"}</dd>
              <dt>Catatan</dt><dd>{order.note || "—"}</dd>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}

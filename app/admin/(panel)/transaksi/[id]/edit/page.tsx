import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/session"
import { toDateInputWIB } from "@/lib/admin/format"
import { orderProductOptions } from "@/lib/admin/order-options"
import { OrderForm } from "@/components/admin/order-form"
import { updateOrder } from "../../actions"

export const metadata: Metadata = { title: "Edit Transaksi" }

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const [order, products] = await Promise.all([db.order.findUnique({ where: { id }, include: { items: true } }), orderProductOptions()])
  if (!order) notFound()
  const reserved: Record<string, number> = {}
  if (order.status !== "CANCELLED") for (const i of order.items) reserved[i.productId] = (reserved[i.productId] ?? 0) + i.quantity

  return (
    <div className="admin-page">
      <Link href={`/admin/transaksi/${order.id}`} className="admin-back"><ArrowLeft aria-hidden="true" /> {order.orderNumber}</Link>
      <header className="admin-page-head"><div><h1>Edit transaksi</h1><p>Perubahan jumlah komponen otomatis menyesuaikan stok.</p></div></header>
      <section className="admin-card">
        <OrderForm
          action={updateOrder.bind(null, order.id)}
          products={products}
          reservedStock={reserved}
          submitLabel="Simpan perubahan"
          initial={{
            customerName: order.customerName,
            customerContact: order.customerContact ?? "",
            date: toDateInputWIB(order.createdAt),
            paymentMethod: order.paymentMethod,
            status: order.status,
            note: order.note ?? "",
            items: order.items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: Number(i.price) })),
          }}
        />
      </section>
    </div>
  )
}

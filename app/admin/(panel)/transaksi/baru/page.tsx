import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/lib/auth/session"
import { toDateInputWIB } from "@/lib/admin/format"
import { orderProductOptions } from "@/lib/admin/order-options"
import { OrderForm } from "@/components/admin/order-form"
import { createOrder } from "../actions"

export const metadata: Metadata = { title: "Catat Transaksi" }

export default async function NewOrderPage() {
  await requireAdmin()
  const products = await orderProductOptions()
  return (
    <div className="admin-page">
      <Link href="/admin/transaksi" className="admin-back"><ArrowLeft aria-hidden="true" /> Transaksi</Link>
      <header className="admin-page-head">
        <div>
          <h1>Catat transaksi</h1>
          <p>Satu transaksi untuk satu pembeli, berisi semua komponen yang dia beli. Stok otomatis berkurang.</p>
        </div>
      </header>
      <section className="admin-card">
        <OrderForm
          action={createOrder}
          products={products}
          submitLabel="Simpan transaksi"
          initial={{ customerName: "", customerContact: "", date: toDateInputWIB(), paymentMethod: "CASH", status: "PAID", note: "", items: [] }}
        />
      </section>
    </div>
  )
}

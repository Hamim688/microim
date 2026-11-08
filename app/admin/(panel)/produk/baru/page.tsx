import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/lib/auth/session"
import { categoryNames } from "@/lib/admin/catalog"
import { ProductForm } from "@/components/admin/product-form"
import { createProduct } from "../actions"

export const metadata: Metadata = { title: "Tambah Produk" }

export default async function NewProductPage() {
  await requireAdmin()
  const categories = await categoryNames()
  return (
    <div className="admin-page">
      <Link href="/admin/produk" className="admin-back"><ArrowLeft aria-hidden="true" /> Produk & Stok</Link>
      <header className="admin-page-head"><div><h1>Tambah produk</h1></div></header>
      <section className="admin-card">
        <ProductForm action={createProduct} categories={categories} showStock submitLabel="Simpan produk" />
      </section>
    </div>
  )
}

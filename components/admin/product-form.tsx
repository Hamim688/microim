"use client"

import { useActionState, useState } from "react"
import { Save } from "lucide-react"
import type { ProductFormState } from "@/app/admin/(panel)/produk/actions"
import { ImageUpload } from "./image-upload"

const rupiahFmt = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })

type Action = (state: ProductFormState, formData: FormData) => Promise<ProductFormState>

export type ProductFormValues = {
  name: string
  category: string
  price: number
  costPrice: number
  imageUrl: string
  description: string
}

export function ProductForm({
  action,
  categories,
  initial,
  showStock,
  submitLabel,
}: {
  action: Action
  categories: string[]
  initial?: ProductFormValues
  showStock?: boolean
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, undefined)
  const [price, setPrice] = useState(initial ? String(initial.price) : "")
  const [cost, setCost] = useState(initial ? String(initial.costPrice) : "")
  const p = Number(price) || 0
  const c = Number(cost) || 0
  const margin = p - c
  const percent = p > 0 ? Math.round((margin / p) * 100) : 0
  return (
    <form action={formAction} className="admin-form admin-grid-2">
      <div className="is-wide">
        <ImageUpload key={initial?.imageUrl || "kosong"} initialUrl={initial?.imageUrl} />
      </div>
      <label className="admin-field is-wide">
        <span>Nama produk</span>
        <input name="name" defaultValue={initial?.name} required minLength={2} maxLength={120} />
      </label>
      <label className="admin-field">
        <span>Kategori</span>
        <input name="category" list="category-options" defaultValue={initial?.category} required placeholder="mis. Sensor" />
        <datalist id="category-options">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      </label>
      <label className="admin-field">
        <span>Modal / pcs (Rp)</span>
        <input name="costPrice" type="number" inputMode="numeric" min={0} step={1} value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0" />
      </label>
      <label className="admin-field">
        <span>Harga jual / pcs (Rp)</span>
        <input name="price" type="number" inputMode="numeric" min={0} step={1} value={price} onChange={(e) => setPrice(e.target.value)} required />
      </label>
      <div className={`admin-margin-preview${margin < 0 ? " is-loss" : ""}`} aria-live="polite">
        <span>Margin per pcs</span>
        <strong>{rupiahFmt.format(margin)}</strong>
        <small>{p > 0 ? `${percent}% dari harga jual` : "isi harga jual"}</small>
      </div>
      {showStock ? (
        <label className="admin-field">
          <span>Stok awal</span>
          <input name="stock" type="number" inputMode="numeric" min={0} step={1} defaultValue={0} />
        </label>
      ) : null}
      <label className="admin-field is-wide">
        <span>Deskripsi (opsional)</span>
        <textarea name="description" rows={3} defaultValue={initial?.description} maxLength={2000} />
      </label>
      <div className="is-wide admin-form-foot">
        {state?.error ? <p className="admin-alert is-error" role="alert">{state.error}</p> : null}
        {state?.success ? <p className="admin-alert is-success" role="status">{state.success}</p> : null}
        <button type="submit" className="admin-btn is-primary" disabled={pending}>
          <Save aria-hidden="true" /> {pending ? "Menyimpan…" : submitLabel}
        </button>
      </div>
    </form>
  )
}

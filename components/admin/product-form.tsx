"use client"

import { useActionState } from "react"
import { Save } from "lucide-react"
import type { ProductFormState } from "@/app/admin/(panel)/produk/actions"

type Action = (state: ProductFormState, formData: FormData) => Promise<ProductFormState>

export type ProductFormValues = {
  name: string
  category: string
  price: number
  imageUrl: string
  description: string
}

export function ProductForm({
  action,
  categories,
  images,
  initial,
  showStock,
  submitLabel,
}: {
  action: Action
  categories: string[]
  images: string[]
  initial?: ProductFormValues
  showStock?: boolean
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, undefined)
  return (
    <form action={formAction} className="admin-form admin-grid-2">
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
        <span>Harga jual (Rp)</span>
        <input name="price" type="number" inputMode="numeric" min={0} step={1} defaultValue={initial?.price} required />
      </label>
      {showStock ? (
        <label className="admin-field">
          <span>Stok awal</span>
          <input name="stock" type="number" inputMode="numeric" min={0} step={1} defaultValue={0} />
        </label>
      ) : null}
      <label className={`admin-field${showStock ? "" : " is-wide"}`}>
        <span>Foto (path gambar)</span>
        <input name="imageUrl" list="image-options" defaultValue={initial?.imageUrl} placeholder="/images/product-…" />
        <datalist id="image-options">{images.map((src) => <option key={src} value={src} />)}</datalist>
      </label>
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

"use client"

import { useActionState, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import type { ProductFormState } from "@/app/admin/(panel)/produk/actions"

type Action = (state: ProductFormState, formData: FormData) => Promise<ProductFormState>

/** Atur batas stok "menipis" langsung dari halaman Produk & Stok. */
export function ThresholdForm({ action, value }: { action: Action; value: number }) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, undefined)
  const [draft, setDraft] = useState(String(value))
  const dirty = draft !== String(value)
  return (
    <form action={formAction} className="admin-threshold" title={state?.error ?? state?.success ?? undefined}>
      <label htmlFor="threshold">Menipis jika stok ≤</label>
      <input id="threshold" name="threshold" type="number" min={0} max={1000} step={1} inputMode="numeric" value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button type="submit" className="admin-icon-btn is-plain" disabled={pending || !dirty} aria-label="Simpan batas stok menipis">
        {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <Check aria-hidden="true" />}
      </button>
      {state?.error ? <span className="admin-hint is-error" role="alert">{state.error}</span> : null}
    </form>
  )
}

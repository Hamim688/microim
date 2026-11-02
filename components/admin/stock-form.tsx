"use client"

import { useActionState, useState } from "react"
import type { ProductFormState } from "@/app/admin/(panel)/produk/actions"

type Action = (state: ProductFormState, formData: FormData) => Promise<ProductFormState>

export function StockForm({ action, current }: { action: Action; current: number }) {
  const [mode, setMode] = useState<"restock" | "set">("restock")
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, undefined)
  return (
    <form action={formAction} className="admin-form">
      <div className="admin-segment" role="radiogroup" aria-label="Jenis perubahan stok">
        <label className={mode === "restock" ? "is-active" : undefined}>
          <input type="radio" name="mode" value="restock" checked={mode === "restock"} onChange={() => setMode("restock")} />
          Tambah stok
        </label>
        <label className={mode === "set" ? "is-active" : undefined}>
          <input type="radio" name="mode" value="set" checked={mode === "set"} onChange={() => setMode("set")} />
          Koreksi jumlah
        </label>
      </div>
      <label className="admin-field">
        <span>{mode === "restock" ? "Jumlah yang masuk" : `Jumlah stok sebenarnya (sekarang ${current})`}</span>
        <input key={mode} name="amount" type="number" inputMode="numeric" min={mode === "restock" ? 1 : 0} step={1} required />
      </label>
      <label className="admin-field">
        <span>Catatan (opsional)</span>
        <input name="note" maxLength={200} placeholder={mode === "restock" ? "mis. Beli dari supplier X" : "mis. Hasil hitung ulang"} />
      </label>
      {state?.error ? <p className="admin-alert is-error" role="alert">{state.error}</p> : null}
      {state?.success ? <p className="admin-alert is-success" role="status">{state.success}</p> : null}
      <button type="submit" className="admin-btn is-primary" disabled={pending}>{pending ? "Menyimpan…" : "Simpan stok"}</button>
    </form>
  )
}

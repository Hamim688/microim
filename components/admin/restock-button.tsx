"use client"

import { useActionState, useId, useState } from "react"
import { Loader2, Minus, PackagePlus, Plus } from "lucide-react"
import type { ProductFormState } from "@/app/admin/(panel)/produk/actions"
import { AdminDialog } from "./dialog"

type Action = (state: ProductFormState, formData: FormData) => Promise<ProductFormState>

/** Tombol "+ stok" di tiap baris tabel: tambah stok tanpa pindah halaman. */
export function RestockButton({ action, name, stock }: { action: Action; name: string; stock: number }) {
  const inputId = useId()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(async (prev, fd) => {
    const result = await action(prev, fd)
    if (result?.success) {
      setOpen(false)
      setAmount("")
    }
    return result
  }, undefined)

  const n = Math.max(0, Math.trunc(Number(amount) || 0))
  const close = () => {
    setOpen(false)
    setAmount("")
  }

  return (
    <>
      <button type="button" className="admin-row-btn is-stock" data-tip="Tambah stok" onClick={() => setOpen(true)} aria-label={`Tambah stok ${name}`}>
        <PackagePlus aria-hidden="true" />
      </button>
      <AdminDialog
        open={open}
        onClose={close}
        tone="green"
        icon={<PackagePlus />}
        title="Tambah stok"
        subtitle={name}
        as="form"
        formAction={formAction}
        footer={
          <>
            <button type="button" className="admin-btn is-ghost" onClick={close}>Batal</button>
            <button type="submit" className="admin-btn is-primary" disabled={pending || n < 1}>
              {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <PackagePlus aria-hidden="true" />}
              {n > 0 ? `Tambah ${n} pcs` : "Tambah stok"}
            </button>
          </>
        }
      >
        <input type="hidden" name="mode" value="restock" />
        <div className="admin-restock-flow" aria-live="polite">
          <div>
            <span>Stok sekarang</span>
            <strong>{stock}</strong>
          </div>
          <span className="admin-restock-arrow" aria-hidden="true">→</span>
          <div className={n > 0 ? "is-next" : undefined}>
            <span>Setelah ditambah</span>
            <strong>{stock + n}</strong>
          </div>
        </div>

        <label className="admin-restock-label" htmlFor={inputId}>Jumlah barang masuk</label>
        <div className="admin-stepper">
          <button type="button" onClick={() => setAmount(String(Math.max(0, n - 1)))} disabled={n < 1} aria-label="Kurangi 1">
            <Minus aria-hidden="true" />
          </button>
          <input
            id={inputId}
            name="amount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            required
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
          <button type="button" onClick={() => setAmount(String(n + 1))} aria-label="Tambah 1">
            <Plus aria-hidden="true" />
          </button>
        </div>
        <div className="admin-chips">
          {[5, 10, 20, 50].map((q) => (
            <button key={q} type="button" onClick={() => setAmount(String(n + q))}>+{q}</button>
          ))}
        </div>
        <label className="admin-restock-label" htmlFor={`${inputId}-note`}>Catatan <small>(opsional)</small></label>
        <input id={`${inputId}-note`} name="note" maxLength={200} placeholder="mis. Beli di toko X" className="admin-modal-input" />
        {state?.error ? <p className="admin-alert is-error" role="alert">{state.error}</p> : null}
      </AdminDialog>
    </>
  )
}

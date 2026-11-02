"use client"

import { useActionState, useMemo, useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import type { OrderFormState } from "@/app/admin/(panel)/transaksi/actions"

type Action = (state: OrderFormState, formData: FormData) => Promise<OrderFormState>

export type OrderProductOption = { id: string; name: string; category: string; price: number; stock: number }
export type OrderFormValues = {
  customerName: string
  customerContact: string
  date: string
  paymentMethod: string
  status: string
  note: string
  items: { productId: string; quantity: number; price: number }[]
}

type Row = { key: number; productId: string; quantity: string; price: string }

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })

let nextKey = 1
const newRow = (r?: Partial<Row>): Row => ({ key: nextKey++, productId: "", quantity: "1", price: "", ...r })

export function OrderForm({
  action,
  products,
  initial,
  submitLabel,
  reservedStock,
}: {
  action: Action
  products: OrderProductOption[]
  initial: OrderFormValues
  submitLabel: string
  /** Saat edit: jumlah yang sudah dipakai transaksi ini, supaya batas stok dihitung benar. */
  reservedStock?: Record<string, number>
}) {
  const [state, formAction, pending] = useActionState<OrderFormState, FormData>(action, undefined)
  const [rows, setRows] = useState<Row[]>(() =>
    initial.items.length
      ? initial.items.map((i) => newRow({ productId: i.productId, quantity: String(i.quantity), price: String(i.price) }))
      : [newRow()],
  )
  const [status, setStatus] = useState(initial.status)

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
  const grouped = useMemo(() => {
    const groups = new Map<string, OrderProductOption[]>()
    for (const p of products) groups.set(p.category, [...(groups.get(p.category) ?? []), p])
    return [...groups]
  }, [products])

  const update = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))

  const items = rows
    .filter((r) => r.productId)
    .map((r) => ({ productId: r.productId, quantity: Math.max(0, Math.trunc(Number(r.quantity) || 0)), price: Math.max(0, Math.trunc(Number(r.price) || 0)) }))
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0)
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)

  // Total kebutuhan per produk (bisa muncul di lebih dari satu baris).
  const needed = new Map<string, number>()
  for (const i of items) needed.set(i.productId, (needed.get(i.productId) ?? 0) + i.quantity)
  const available = (id: string) => (byId.get(id)?.stock ?? 0) + (reservedStock?.[id] ?? 0)

  return (
    <form action={formAction} className="admin-form">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <div className="admin-grid-2">
        <label className="admin-field">
          <span>Nama pembeli</span>
          <input name="customerName" defaultValue={initial.customerName} required maxLength={100} placeholder="mis. Budi (TRK 3A)" />
        </label>
        <label className="admin-field">
          <span>Kontak (opsional)</span>
          <input name="customerContact" defaultValue={initial.customerContact} maxLength={100} placeholder="No. WA / Instagram" />
        </label>
        <label className="admin-field">
          <span>Tanggal</span>
          <input name="date" type="date" defaultValue={initial.date} required />
        </label>
        <label className="admin-field">
          <span>Pembayaran</span>
          <select name="paymentMethod" defaultValue={initial.paymentMethod}>
            <option value="CASH">Tunai</option>
            <option value="TRANSFER">Transfer</option>
            <option value="QRIS">QRIS</option>
            <option value="OTHER">Lainnya</option>
          </select>
        </label>
        <label className="admin-field">
          <span>Status</span>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">Belum Bayar</option>
            <option value="PAID">Lunas</option>
            <option value="SHIPPED">Dikirim</option>
            <option value="DELIVERED">Selesai</option>
            <option value="CANCELLED">Batal (stok tidak berkurang)</option>
          </select>
        </label>
        <label className="admin-field">
          <span>Catatan (opsional)</span>
          <input name="note" defaultValue={initial.note} maxLength={1000} placeholder="mis. Ambil di kampus hari Jumat" />
        </label>
      </div>

      <fieldset className="admin-items">
        <legend>Komponen yang dibeli</legend>
        <div className="admin-items-head" aria-hidden="true">
          <span>Produk</span><span>Jumlah</span><span>Harga satuan</span><span>Subtotal</span><span />
        </div>
        {rows.map((row, index) => {
          const product = byId.get(row.productId)
          const qty = Math.trunc(Number(row.quantity) || 0)
          const over = product && status !== "CANCELLED" && (needed.get(row.productId) ?? 0) > available(row.productId)
          return (
            <div className="admin-item-row" key={row.key}>
              <label className="admin-field">
                <span className="sr-only">Produk baris {index + 1}</span>
                <select
                  value={row.productId}
                  onChange={(e) => {
                    const p = byId.get(e.target.value)
                    update(row.key, { productId: e.target.value, price: p ? String(p.price) : row.price })
                  }}
                >
                  <option value="">Pilih produk…</option>
                  {grouped.map(([category, list]) => (
                    <optgroup key={category} label={category}>
                      {list.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (stok {available(p.id)})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {over ? <small className="admin-hint is-error">Stok tersedia hanya {available(row.productId)}</small> : null}
              </label>
              <label className="admin-field">
                <span className="sr-only">Jumlah baris {index + 1}</span>
                <input type="number" inputMode="numeric" min={1} step={1} value={row.quantity} onChange={(e) => update(row.key, { quantity: e.target.value })} />
              </label>
              <label className="admin-field">
                <span className="sr-only">Harga satuan baris {index + 1}</span>
                <input type="number" inputMode="numeric" min={0} step={1} value={row.price} onChange={(e) => update(row.key, { price: e.target.value })} />
              </label>
              <output className="admin-item-subtotal">{product ? rupiah.format(qty * (Number(row.price) || 0)) : "—"}</output>
              <button
                type="button"
                className="admin-icon-btn"
                aria-label={`Hapus baris ${index + 1}`}
                onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== row.key) : [newRow()]))}
              >
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          )
        })}
        <button type="button" className="admin-btn is-ghost" onClick={() => setRows((rs) => [...rs, newRow()])}>
          <Plus aria-hidden="true" /> Tambah komponen
        </button>
      </fieldset>

      <div className="admin-form-foot is-split">
        <div className="admin-total">
          <span>{totalQty} barang · {items.length} jenis</span>
          <strong>{rupiah.format(total)}</strong>
        </div>
        <div className="admin-form-actions">
          {state?.error ? <p className="admin-alert is-error" role="alert">{state.error}</p> : null}
          <button type="submit" className="admin-btn is-primary" disabled={pending || items.length === 0}>
            <Save aria-hidden="true" /> {pending ? "Menyimpan…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}

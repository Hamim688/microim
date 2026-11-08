"use client"

import { useActionState, useId, useMemo, useState } from "react"
import { Banknote, CreditCard, Loader2, Minus, Package, Plus, QrCode, Save, Trash2, Wallet, Wrench } from "lucide-react"
import type { OrderFormState } from "@/app/admin/(panel)/transaksi/actions"
import type { OrderProductOption, ServiceSuggestion } from "@/lib/admin/order-options"
import { Combobox } from "./combobox"
import { Select } from "./select"

type Action = (state: OrderFormState, formData: FormData) => Promise<OrderFormState>
type ItemType = "COMPONENT" | "SERVICE"

export type OrderFormValues = {
  customerName: string
  customerContact: string
  date: string
  paymentMethod: string
  status: string
  note: string
  items: { type: ItemType; productId: string | null; name: string | null; quantity: number; price: number }[]
}

type Row = { key: number; type: ItemType; productId: string; name: string; quantity: string; price: string }

const rp = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
let nextKey = 1
const newRow = (r?: Partial<Row>): Row => ({ key: nextKey++, type: "COMPONENT", productId: "", name: "", quantity: "1", price: "", ...r })

const PAYMENTS = [
  { value: "CASH", label: "Tunai", icon: Banknote },
  { value: "TRANSFER", label: "Transfer", icon: CreditCard },
  { value: "QRIS", label: "QRIS", icon: QrCode },
  { value: "OTHER", label: "Lainnya", icon: Wallet },
]
const STATUSES = [
  { value: "PENDING", label: "Belum bayar" },
  { value: "PAID", label: "Lunas" },
  { value: "SHIPPED", label: "Dikirim" },
  { value: "DELIVERED", label: "Selesai" },
  { value: "CANCELLED", label: "Batal", hint: "stok tidak berkurang" },
]

export function OrderForm({
  action,
  products,
  services,
  initial,
  submitLabel,
  reservedStock,
}: {
  action: Action
  products: OrderProductOption[]
  services: ServiceSuggestion[]
  initial: OrderFormValues
  submitLabel: string
  /** Saat edit: jumlah yang sudah dipakai transaksi ini, supaya batas stok dihitung benar. */
  reservedStock?: Record<string, number>
}) {
  const id = useId()
  const [state, formAction, pending] = useActionState<OrderFormState, FormData>(action, undefined)
  const [rows, setRows] = useState<Row[]>(() =>
    initial.items.length
      ? initial.items.map((i) => newRow({ type: i.type, productId: i.productId ?? "", name: i.name ?? "", quantity: String(i.quantity), price: String(i.price) }))
      : [newRow()],
  )
  const [status, setStatus] = useState(initial.status)
  const [payment, setPayment] = useState(initial.paymentMethod)
  const [tried, setTried] = useState(false)
  // Isian dibuat terkontrol supaya tidak terhapus saat React mereset form setelah simpan gagal.
  const [customerName, setCustomerName] = useState(initial.customerName)
  const [contact, setContact] = useState(initial.customerContact)
  const [note, setNote] = useState(initial.note)
  const [date, setDate] = useState(initial.date)

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
  const available = (pid: string) => (byId.get(pid)?.stock ?? 0) + (reservedStock?.[pid] ?? 0)
  const serviceByName = useMemo(() => new Map(services.map((s) => [s.name.toLowerCase(), s])), [services])

  const update = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  const num = (v: string) => Math.max(0, Math.trunc(Number(v) || 0))

  const valid = rows.filter((r) => (r.type === "COMPONENT" ? r.productId : r.name.trim().length >= 2))
  const items = valid.map((r) =>
    r.type === "COMPONENT"
      ? { type: r.type, productId: r.productId, quantity: num(r.quantity), price: num(r.price) }
      : { type: r.type, name: r.name.trim(), quantity: num(r.quantity), price: num(r.price) },
  )
  const needed = new Map<string, number>()
  for (const r of valid) if (r.type === "COMPONENT") needed.set(r.productId, (needed.get(r.productId) ?? 0) + num(r.quantity))

  const compTotal = valid.filter((r) => r.type === "COMPONENT").reduce((s, r) => s + num(r.quantity) * num(r.price), 0)
  const servTotal = valid.filter((r) => r.type === "SERVICE").reduce((s, r) => s + num(r.quantity) * num(r.price), 0)
  const total = compTotal + servTotal
  const profit = valid.reduce((s, r) => {
    const cost = r.type === "COMPONENT" ? (byId.get(r.productId)?.cost ?? 0) : 0
    return s + num(r.quantity) * (num(r.price) - cost)
  }, 0)
  const missingCost = valid.some((r) => r.type === "COMPONENT" && !(byId.get(r.productId)?.cost ?? 0))
  const qtyTotal = valid.reduce((s, r) => s + num(r.quantity), 0)
  const overStock = status !== "CANCELLED" && [...needed].some(([pid, n]) => n > available(pid))

  const productOptions = products.map((p) => {
    const a = available(p.id)
    return {
      value: p.id,
      label: p.name,
      group: p.category,
      hint: a > 0 ? `stok ${a}` : "habis",
      tone: a <= 0 ? ("out" as const) : a <= 2 ? ("low" as const) : ("ok" as const),
      disabled: a <= 0,
    }
  })

  return (
    <form action={formAction} className="admin-order-form" onSubmit={() => setTried(true)}>
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="paymentMethod" value={payment} />

      <div className="admin-of-main">
        <section className="admin-card admin-of-section">
          <h2>Pembeli</h2>
          <div className="admin-grid-2">
            <label className="admin-field">
              <span>Nama pembeli</span>
              <input name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required maxLength={100} placeholder="mis. Budi (TRK 3A)" />
            </label>
            <label className="admin-field">
              <span>Kontak <small>(opsional)</small></span>
              <input name="customerContact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={100} placeholder="No. WA atau Instagram" />
            </label>
          </div>
        </section>

        <section className="admin-card admin-of-section">
          <h2>
            Item pesanan
            <small>{valid.length ? `${valid.length} item · ${qtyTotal} pcs` : "belum ada"}</small>
          </h2>
          <datalist id={`${id}-services`}>{services.map((s) => <option key={s.name} value={s.name} />)}</datalist>

          <div className="admin-of-rows">
            {rows.map((row, index) => {
              const product = byId.get(row.productId)
              const qty = num(row.quantity)
              const sub = qty * num(row.price)
              const over = row.type === "COMPONENT" && product && status !== "CANCELLED" && (needed.get(row.productId) ?? 0) > available(row.productId)
              const missing = tried && (row.type === "COMPONENT" ? !row.productId : row.name.trim().length < 2)
              return (
                <div key={row.key} className={`admin-of-row is-${row.type === "COMPONENT" ? "component" : "service"}`}>
                  <div className="admin-of-type" role="radiogroup" aria-label={`Jenis item ${index + 1}`}>
                    {(["COMPONENT", "SERVICE"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={row.type === t}
                        className={row.type === t ? "is-active" : undefined}
                        onClick={() => row.type !== t && update(row.key, { type: t, productId: "", name: "", price: "" })}
                      >
                        {t === "COMPONENT" ? <Package aria-hidden="true" /> : <Wrench aria-hidden="true" />}
                        {t === "COMPONENT" ? "Komponen" : "Jasa"}
                      </button>
                    ))}
                  </div>

                  <div className="admin-of-what">
                    {row.type === "COMPONENT" ? (
                      <Combobox
                        label={`Komponen baris ${index + 1}`}
                        placeholder="Cari komponen…"
                        value={row.productId}
                        options={productOptions.map((o) => (o.value === row.productId ? { ...o, disabled: false } : o))}
                        invalid={missing}
                        onChange={(v) => update(row.key, { productId: v, price: String(byId.get(v)?.price ?? "") })}
                      />
                    ) : (
                      <input
                        className={`admin-of-input${missing ? " is-invalid" : ""}`}
                        list={`${id}-services`}
                        value={row.name}
                        maxLength={120}
                        placeholder="Nama jasa, mis. Pembuatan program ESP32"
                        aria-label={`Nama jasa baris ${index + 1}`}
                        onChange={(e) => {
                          const name = e.target.value
                          const hit = serviceByName.get(name.trim().toLowerCase())
                          update(row.key, { name, ...(hit && !row.price ? { price: String(hit.price) } : {}) })
                        }}
                      />
                    )}
                    {over ? <small className="admin-hint is-error">Stok tersedia hanya {available(row.productId)}</small> : null}
                    {row.type === "SERVICE" ? <small className="admin-hint">Jasa tidak mengurangi stok.</small> : null}
                  </div>

                  <div className="admin-of-qty">
                    <button type="button" onClick={() => update(row.key, { quantity: String(Math.max(1, qty - 1)) })} disabled={qty <= 1} aria-label="Kurangi jumlah">
                      <Minus aria-hidden="true" />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      value={row.quantity}
                      onChange={(e) => update(row.key, { quantity: e.target.value })}
                      aria-label={`Jumlah baris ${index + 1}`}
                    />
                    <button type="button" onClick={() => update(row.key, { quantity: String(qty + 1) })} aria-label="Tambah jumlah">
                      <Plus aria-hidden="true" />
                    </button>
                  </div>

                  <label className="admin-of-price">
                    <span>Rp</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={500}
                      value={row.price}
                      placeholder="0"
                      onChange={(e) => update(row.key, { price: e.target.value })}
                      aria-label={`Harga satuan baris ${index + 1}`}
                    />
                  </label>

                  <output className="admin-of-sub">{sub ? rp.format(sub) : "—"}</output>

                  <button
                    type="button"
                    className="admin-of-remove"
                    aria-label={`Hapus baris ${index + 1}`}
                    onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== row.key) : [newRow()]))}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="admin-of-add">
            <button type="button" onClick={() => setRows((rs) => [...rs, newRow()])}>
              <Package aria-hidden="true" /> Tambah komponen
            </button>
            <button type="button" onClick={() => setRows((rs) => [...rs, newRow({ type: "SERVICE" })])}>
              <Wrench aria-hidden="true" /> Tambah jasa
            </button>
          </div>
        </section>

        <section className="admin-card admin-of-section">
          <h2>Catatan <small>opsional</small></h2>
          <textarea name="note" className="admin-of-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={2} placeholder="mis. Ambil di kampus hari Jumat" />
        </section>
      </div>

      <aside className="admin-of-side">
        <section className="admin-card admin-of-summary">
          <label className="admin-field">
            <span>Tanggal</span>
            <input name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>

          <div className="admin-field">
            <span>Pembayaran</span>
            <div className="admin-pay" role="radiogroup" aria-label="Metode pembayaran">
              {PAYMENTS.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" role="radio" aria-checked={payment === value} className={payment === value ? "is-active" : undefined} onClick={() => setPayment(value)}>
                  <Icon aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-field">
            <span>Status</span>
            <Select label="Status transaksi" className={`is-status is-${status.toLowerCase()}`} value={status} onChange={setStatus} options={STATUSES} />
          </div>

          <dl className="admin-of-totals">
            <div><dt>Komponen</dt><dd>{rp.format(compTotal)}</dd></div>
            <div><dt>Jasa</dt><dd>{rp.format(servTotal)}</dd></div>
            <div className="is-total"><dt>Total</dt><dd>{rp.format(total)}</dd></div>
            <div className={`is-profit${profit < 0 ? " is-loss" : ""}`}>
              <dt>Perkiraan laba{missingCost ? "*" : ""}</dt>
              <dd>{rp.format(profit)}</dd>
            </div>
          </dl>
          {missingCost ? <p className="admin-hint">* Ada komponen tanpa harga modal, laba belum akurat.</p> : null}
          {overStock ? <p className="admin-alert is-error" role="alert">Ada komponen yang melebihi stok.</p> : null}
          {state?.error ? <p className="admin-alert is-error" role="alert">{state.error}</p> : null}

          <button type="submit" className="admin-btn is-primary is-block" disabled={pending || items.length === 0 || overStock}>
            {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <Save aria-hidden="true" />}
            {pending ? "Menyimpan…" : submitLabel}
          </button>
        </section>
      </aside>
    </form>
  )
}

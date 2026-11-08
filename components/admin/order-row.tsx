"use client"

import { useState } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { CheckCircle2, ChevronDown, Eye, Loader2, Package, Pencil, Trash2, Wrench } from "lucide-react"
import { ConfirmDialog } from "./confirm-dialog"

export type OrderRowData = {
  id: string
  number: string
  customer: string
  contact: string | null
  date: string
  payment: string
  status: string
  statusLabel: string
  statusTone: string
  total: string
  profit: string | null
  note: string | null
  items: { key: string; type: "COMPONENT" | "SERVICE"; name: string; qty: number; price: string; sub: string }[]
}

function PaidButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-row-btn is-paid" data-tip="Tandai lunas" aria-label="Tandai lunas" disabled={pending}>
      {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <CheckCircle2 aria-hidden="true" />}
    </button>
  )
}
function DeleteSubmit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn is-danger" disabled={pending}>
      {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <Trash2 aria-hidden="true" />}
      {pending ? "Menghapus…" : "Ya, hapus"}
    </button>
  )
}

/** Satu baris = satu pembeli. Klik untuk melihat semua item yang dibeli. */
export function OrderRow({
  order,
  markPaid,
  remove,
}: {
  order: OrderRowData
  markPaid: (formData: FormData) => Promise<void>
  remove: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const comps = order.items.filter((i) => i.type === "COMPONENT").length
  const servs = order.items.length - comps
  const qty = order.items.reduce((s, i) => s + i.qty, 0)
  const preview = order.items.slice(0, 3).map((i) => i.name).join(", ") + (order.items.length > 3 ? ` +${order.items.length - 3} lagi` : "")

  return (
    <div className={`admin-orow${open ? " is-open" : ""}${order.status === "CANCELLED" ? " is-cancelled" : ""}`}>
      <div
        className="admin-orow-main"
        onClick={(e) => {
          // Klik di mana pun pada baris membuka rincian, kecuali di tombol aksi.
          if ((e.target as HTMLElement).closest("a, button, form")) return
          setOpen((v) => !v)
        }}
      >
        <div className="admin-orow-cell is-buyer">
          <span className="admin-orow-avatar" aria-hidden="true">{order.customer.charAt(0).toUpperCase()}</span>
          <span className="admin-orow-who">
            <strong>{order.customer}</strong>
            <small>{order.number} · {order.payment}</small>
          </span>
        </div>
        <div className="admin-orow-cell is-date">{order.date}</div>
        <div className="admin-orow-cell admin-orow-items">
          <span>{preview}</span>
          <small>
            {comps ? <><Package aria-hidden="true" /> {comps} komponen</> : null}
            {comps && servs ? " · " : null}
            {servs ? <><Wrench aria-hidden="true" /> {servs} jasa</> : null}
            {" · "}{qty} pcs
          </small>
        </div>
        <div className="admin-orow-cell is-status">
          <span className={`admin-badge is-${order.statusTone}`}>{order.statusLabel}</span>
        </div>
        <div className="admin-orow-cell admin-orow-total">
          <strong>{order.total}</strong>
          {order.profit ? <small>laba {order.profit}</small> : null}
        </div>
        <div className="admin-orow-cell is-actions">
          <div className="admin-row-actions">
            {order.status === "PENDING" ? (
              <form action={markPaid}>
                <input type="hidden" name="status" value="PAID" />
                <input type="hidden" name="stay" value="1" />
                <PaidButton />
              </form>
            ) : null}
            <Link href={`/admin/transaksi/${order.id}`} className="admin-row-btn is-view" data-tip="Detail" aria-label={`Detail transaksi ${order.customer}`}>
              <Eye aria-hidden="true" />
            </Link>
            <Link href={`/admin/transaksi/${order.id}/edit`} className="admin-row-btn is-edit" data-tip="Edit" aria-label={`Edit transaksi ${order.customer}`}>
              <Pencil aria-hidden="true" />
            </Link>
            <button type="button" className="admin-row-btn is-danger" data-tip="Hapus" aria-label={`Hapus transaksi ${order.customer}`} onClick={() => setConfirm(true)}>
              <Trash2 aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="admin-orow-expand"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`order-${order.id}`}
            aria-label={open ? "Tutup rincian" : "Lihat rincian item"}
          >
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="admin-orow-body" id={`order-${order.id}`} aria-hidden={!open}>
        <div className="admin-orow-inner">
          <table className="admin-table is-compact">
            <thead>
              <tr><th>Item</th><th>Jenis</th><th className="is-num">Jumlah</th><th className="is-num">Harga</th><th className="is-num">Subtotal</th></tr>
            </thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.key}>
                  <td>{i.name}</td>
                  <td><span className={`admin-type is-${i.type === "COMPONENT" ? "component" : "service"}`}>{i.type === "COMPONENT" ? "Komponen" : "Jasa"}</span></td>
                  <td className="is-num">{i.qty}</td>
                  <td className="is-num">{i.price}</td>
                  <td className="is-num">{i.sub}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={4}>Total</td><td className="is-num">{order.total}</td></tr></tfoot>
          </table>
          {order.contact || order.note ? (
            <p className="admin-orow-note">
              {order.contact ? <>Kontak: <strong>{order.contact}</strong></> : null}
              {order.contact && order.note ? " · " : null}
              {order.note ? <>Catatan: {order.note}</> : null}
            </p>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        tone="danger"
        icon={<Trash2 />}
        title={`Hapus transaksi ${order.customer}?`}
        description={`${order.number} akan dihapus permanen${order.status !== "CANCELLED" ? " dan stok komponennya dikembalikan" : ""}. Kalau pesanan cuma tidak jadi, lebih baik ubah statusnya ke Batal supaya tetap tercatat.`}
      >
        <button type="button" className="admin-btn is-ghost" onClick={() => setConfirm(false)} autoFocus>Batal</button>
        <form action={remove}><DeleteSubmit /></form>
      </ConfirmDialog>
    </div>
  )
}

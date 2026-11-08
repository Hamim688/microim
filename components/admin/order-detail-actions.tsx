"use client"

import { useState } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { Check, Copy, Loader2, MessageCircle, Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "./confirm-dialog"

function DeleteSubmit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn is-danger" disabled={pending}>
      {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <Trash2 aria-hidden="true" />}
      {pending ? "Menghapus…" : "Ya, hapus"}
    </button>
  )
}

/** No. WA Indonesia → format wa.me (08xx → 628xx). Kontak selain nomor (mis. Instagram) diabaikan. */
function waNumber(contact: string | null) {
  if (!contact) return null
  const digits = contact.replace(/[^\d+]/g, "")
  if (!/^(\+?62|0)8\d{7,12}$/.test(digits)) return null
  return digits.replace(/^\+/, "").replace(/^0/, "62")
}

export function OrderDetailActions({
  id,
  number,
  customer,
  contact,
  nota,
  cancelled,
  remove,
}: {
  id: string
  number: string
  customer: string
  contact: string | null
  nota: string
  cancelled: boolean
  remove: () => Promise<void>
}) {
  const [copied, setCopied] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const wa = waNumber(contact)

  return (
    <div className="admin-head-actions">
      <button
        type="button"
        className="admin-btn is-ghost"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(nota)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          } catch {}
        }}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied ? "Tersalin" : "Salin nota"}
      </button>
      {wa ? (
        <a className="admin-btn is-ghost is-wa" href={`https://wa.me/${wa}?text=${encodeURIComponent(nota)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" /> Kirim WA
        </a>
      ) : null}
      <Link href={`/admin/transaksi/${id}/edit`} className="admin-btn"><Pencil aria-hidden="true" /> Edit</Link>
      <button type="button" className="admin-btn is-ghost is-danger-text" onClick={() => setConfirm(true)} aria-label="Hapus transaksi">
        <Trash2 aria-hidden="true" />
      </button>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        tone="danger"
        icon={<Trash2 />}
        title={`Hapus transaksi ${customer}?`}
        description={`${number} akan dihapus permanen${cancelled ? "" : " dan stok komponennya dikembalikan"}. Kalau pesanan cuma tidak jadi, lebih baik ubah statusnya ke Batal supaya tetap tercatat.`}
      >
        <button type="button" className="admin-btn is-ghost" onClick={() => setConfirm(false)} autoFocus>Batal</button>
        <form action={remove}><DeleteSubmit /></form>
      </ConfirmDialog>
    </div>
  )
}

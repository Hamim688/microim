"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Loader2, Trash2 } from "lucide-react"
import { ConfirmDialog } from "./confirm-dialog"

function SubmitDelete() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn is-danger" disabled={pending}>
      {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <Trash2 aria-hidden="true" />}
      {pending ? "Menghapus…" : "Ya, hapus"}
    </button>
  )
}

/** Tombol hapus di tabel + pop-up konfirmasi. Produk yang sudah ada di transaksi tidak bisa dihapus. */
export function DeleteProductButton({ action, name, soldCount }: { action: () => Promise<void>; name: string; soldCount: number }) {
  const [open, setOpen] = useState(false)
  const locked = soldCount > 0
  return (
    <>
      <button
        type="button"
        className={`admin-row-btn is-danger${locked ? " is-locked" : ""}`}
        data-tip={locked ? "Terkunci: ada di transaksi" : "Hapus"}
        onClick={() => setOpen(true)}
        aria-label={`Hapus ${name}`}
      >
        <Trash2 aria-hidden="true" />
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        tone="danger"
        icon={<Trash2 />}
        title={locked ? "Produk tidak bisa dihapus" : `Hapus ${name}?`}
        description={
          locked
            ? `${name} sudah tercatat di ${soldCount} transaksi, jadi harus tetap ada supaya riwayat penjualan utuh. Kalau tidak dijual lagi, koreksi stoknya jadi 0.`
            : "Produk beserta seluruh riwayat stoknya akan dihapus permanen dan tidak bisa dikembalikan."
        }
      >
        {locked ? (
          <button type="button" className="admin-btn is-ghost" onClick={() => setOpen(false)} autoFocus>
            Mengerti
          </button>
        ) : (
          <>
            <button type="button" className="admin-btn is-ghost" onClick={() => setOpen(false)} autoFocus>
              Batal
            </button>
            <form action={action}>
              <SubmitDelete />
            </form>
          </>
        )}
      </ConfirmDialog>
    </>
  )
}

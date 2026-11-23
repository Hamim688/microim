"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react"
import type { ReviewStatus } from "@prisma/client"
import { ConfirmDialog } from "./confirm-dialog"

function Pending({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <>{children}</>
}

function SubmitDelete() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn is-danger" disabled={pending}>
      {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <Trash2 aria-hidden="true" />}
      {pending ? "Menghapus…" : "Ya, hapus"}
    </button>
  )
}

/** Tombol di kartu ulasan: tampilkan / sembunyikan, dan hapus (dengan konfirmasi). */
export function ReviewActions({
  name,
  status,
  setStatus,
  remove,
}: {
  name: string
  status: ReviewStatus
  setStatus: (status: ReviewStatus) => Promise<void>
  remove: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const published = status === "PUBLISHED"
  return (
    <div className="admin-review-actions">
      <form action={() => setStatus(published ? "HIDDEN" : "PUBLISHED")}>
        <button type="submit" className={`admin-btn ${published ? "is-ghost" : "is-primary"}`}>
          <Pending>{published ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</Pending>
          {published ? "Sembunyikan" : "Tampilkan"}
        </button>
      </form>
      <button type="button" className="admin-row-btn is-danger" data-tip="Hapus" onClick={() => setOpen(true)} aria-label={`Hapus ulasan ${name}`}>
        <Trash2 aria-hidden="true" />
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        tone="danger"
        icon={<Trash2 />}
        title={`Hapus ulasan ${name}?`}
        description="Ulasan akan dihapus permanen. Kalau hanya tidak ingin dipajang, pilih Sembunyikan saja."
      >
        <button type="button" className="admin-btn is-ghost" onClick={() => setOpen(false)} autoFocus>
          Batal
        </button>
        <form action={remove}>
          <SubmitDelete />
        </form>
      </ConfirmDialog>
    </div>
  )
}

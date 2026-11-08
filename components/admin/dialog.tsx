"use client"

import { useEffect, useId, useRef, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

const noop = () => () => {}
/** true hanya di browser setelah hidrasi (aman untuk portal, tanpa beda HTML server/klien). */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false)
}

/** Tempat portal: di dalam .admin-shell agar variabel warna tema tetap berlaku, tapi di luar tabel/kartu. */
export function portalTarget() {
  return (document.querySelector(".admin-shell") ?? document.body) as HTMLElement
}

/**
 * Dasar semua pop-up admin: <dialog> bawaan browser (fokus terkunci, Esc menutup) yang dirender lewat portal,
 * jadi posisinya selalu di tengah layar dan tidak ikut gaya sel tabel.
 */
export function AdminDialog({
  open,
  onClose,
  tone = "gold",
  icon,
  title,
  subtitle,
  children,
  footer,
  as = "div",
  formAction,
  size = "sm",
}: {
  open: boolean
  onClose: () => void
  tone?: "gold" | "danger" | "green"
  icon: React.ReactNode
  title: string
  subtitle?: React.ReactNode
  children?: React.ReactNode
  footer: React.ReactNode
  as?: "div" | "form"
  formAction?: (formData: FormData) => void
  size?: "sm" | "md"
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  const mounted = useMounted()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open, mounted])

  if (!mounted) return null

  const inner = (
    <>
      <header className="admin-dialog-head">
        <span className="admin-dialog-icon" aria-hidden="true">{icon}</span>
        <div className="admin-dialog-titles">
          <h2 id={`${id}-title`}>{title}</h2>
          {subtitle ? <p id={`${id}-desc`}>{subtitle}</p> : null}
        </div>
        <button type="button" className="admin-dialog-x" onClick={onClose} aria-label="Tutup">
          <X aria-hidden="true" />
        </button>
      </header>
      {children ? <div className="admin-dialog-body">{children}</div> : null}
      <footer className="admin-dialog-foot">{footer}</footer>
    </>
  )

  return createPortal(
    <dialog
      ref={ref}
      className={`admin-modal is-${tone} is-${size}`}
      aria-labelledby={`${id}-title`}
      aria-describedby={subtitle ? `${id}-desc` : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {as === "form" ? (
        <form action={formAction} className="admin-modal-card">{inner}</form>
      ) : (
        <div className="admin-modal-card">{inner}</div>
      )}
    </dialog>,
    portalTarget(),
  )
}

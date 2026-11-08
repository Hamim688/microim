"use client"

import { AdminDialog } from "./dialog"

/** Pop-up konfirmasi sederhana (keluar, lihat situs, hapus). */
export function ConfirmDialog({
  open,
  onClose,
  tone = "gold",
  icon,
  title,
  description,
  children,
}: {
  open: boolean
  onClose: () => void
  tone?: "gold" | "danger"
  icon: React.ReactNode
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) {
  return <AdminDialog open={open} onClose={onClose} tone={tone} icon={icon} title={title} subtitle={description} footer={children} />
}

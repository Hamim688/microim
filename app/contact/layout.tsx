import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontak",
  description: "Ajukan proyek atau tanyakan komponen ke Microim. Pengajuan langsung terkirim lewat WhatsApp.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { ReactNode } from "react"
import { BackLink } from "@/components/layout/back-link"

/**
 * Kepala halaman tersendiri (/contact, /services, /products): tautan "Kembali", judul besar dua baris (baris kedua
 * emas), dan satu kalimat pengantar. Tanpa label kecil di atas judul.
 * `backTo`: tujuan "Kembali" bila halaman dibuka langsung (section terkait di Beranda).
 * `aside`: gambar pengisi sisi kanan (hanya tampil di layar lebar).
 */
export function SubpageHead({ id, backTo, title, accent, aside, children }: { id: string; backTo: string; title: string; accent: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <header className={`subpage-head${aside ? " has-aside" : ""}`}>
      <div>
        <BackLink fallback={backTo} className="subpage-back" />
        <h1 id={id}>{title} <span>{accent}</span></h1>
        <p>{children}</p>
      </div>
      {aside ? <div className="subpage-aside" aria-hidden="true">{aside}</div> : null}
    </header>
  )
}

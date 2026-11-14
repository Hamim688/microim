import type { ReactNode } from "react"
import { BackLink } from "@/components/layout/back-link"

/** `backTo`: tujuan tautan "Kembali" bila halaman dibuka langsung (biasanya section terkait di Beranda). */
export function PageHero({ kicker, title, children, backTo = "/" }: { kicker: string; title: ReactNode; children?: ReactNode; backTo?: string }) {
  return (
    <section className="page-hero">
      <div className="site-container">
        <BackLink fallback={backTo} className="page-hero-back" />
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        {children ? <p>{children}</p> : null}
      </div>
    </section>
  )
}

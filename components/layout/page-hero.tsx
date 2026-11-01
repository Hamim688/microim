import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

export function PageHero({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="site-container">
        <Link href="/" className="page-hero-back"><ArrowLeft aria-hidden="true" /> Kembali ke Beranda</Link>
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        {children ? <p>{children}</p> : null}
      </div>
    </section>
  )
}

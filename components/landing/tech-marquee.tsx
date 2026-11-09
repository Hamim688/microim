import type { CSSProperties } from "react"
import { siteConfig } from "@/lib/site"

// Kecepatan pita konstan berapa pun jumlah isinya (detik per item).
const SECONDS_PER_ITEM = 3.4
// Tagline disisipkan setiap sekian produk sebagai "jangkar" pita.
const TAGLINE_EVERY = 8

type MarqueeItem = { label: string; tagline?: boolean }

function buildItems(names: string[]): MarqueeItem[] {
  const items: MarqueeItem[] = []
  names.forEach((name, index) => {
    if (index % TAGLINE_EVERY === 0) items.push({ label: siteConfig.tagline, tagline: true })
    items.push({ label: name })
  })
  return items
}

export function TechMarquee({ names }: { names: string[] }) {
  const items = buildItems(names)
  if (items.length === 0) return null
  const row = [...items, ...items]
  const style = { "--marquee-duration": `${items.length * SECONDS_PER_ITEM}s` } as CSSProperties

  return (
    <div className="tech-marquee-wrap">
      <div className="tech-marquee" aria-label={`${siteConfig.tagline} Produk yang tersedia di Microim`}>
        <ul className="tech-marquee-track" style={style}>
          {row.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className={item.tagline ? "is-tagline" : undefined}
              aria-hidden={index >= items.length}
            >
              {item.tagline ? null : <i />}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

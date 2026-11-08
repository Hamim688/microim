export const CATEGORICAL = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#9085e9"]
export const OTHER = "#64748b"

const full = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
const num = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 })

export const rp = (n: number) => full.format(n)
export const count = (n: number) => num.format(n)

/** Rupiah ringkas untuk sumbu grafik: Rp 1,2 jt / Rp 350 rb. */
export function rpShort(n: number) {
  const a = Math.abs(n)
  if (a >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`
  if (a >= 1_000_000) return `Rp ${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`
  if (a >= 1_000) return `Rp ${(n / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`
  return `Rp ${num.format(n)}`
}

export const pct = (n: number) => `${n.toLocaleString("id-ID", { maximumFractionDigits: n < 10 ? 1 : 0 })}%`

/** Batas atas sumbu yang "bulat" + 4 garis bantu. */
export function niceTicks(max: number, steps = 4) {
  if (max <= 0) return { top: steps, ticks: Array.from({ length: steps + 1 }, (_, i) => i) }
  const raw = max / steps
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag
  const top = step * steps
  return { top, ticks: Array.from({ length: steps + 1 }, (_, i) => i * step) }
}

const dayFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "UTC" })
const dayLong = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
const monFmt = new Intl.DateTimeFormat("id-ID", { month: "short", year: "2-digit", timeZone: "UTC" })
const monLong = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" })
export function bucketLabel(key: string, long = false) {
  if (key.length === 7) {
    const d = new Date(`${key}-01T00:00:00Z`)
    return long ? monLong.format(d) : monFmt.format(d)
  }
  const d = new Date(`${key}T00:00:00Z`)
  return long ? dayLong.format(d) : dayFmt.format(d)
}

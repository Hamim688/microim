import { startOfDayWIB, startOfMonthWIB, toDateInputWIB } from "@/lib/admin/format"

const DAY = 86_400_000
const WIB = 7 * 3_600_000

export type PeriodKey = "7h" | "30h" | "bulan" | "tahun" | "semua"
export const PERIOD_LABEL: Record<PeriodKey, string> = { "7h": "7 hari", "30h": "30 hari", bulan: "Bulan ini", tahun: "Tahun ini", semua: "Semua" }

export type Period = {
  key: PeriodKey | "custom"
  label: string
  /** Kalimat pembanding, mis. "vs 7 hari sebelumnya". */
  compareLabel: string | null
  from: Date | null
  to: Date
  prevFrom: Date | null
  prevTo: Date | null
  bucket: "day" | "month"
  month?: string
}

const monthName = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" })
export const monthLabel = (ym: string) => monthName.format(new Date(`${ym}-15T00:00:00+07:00`))

/** Awal bulan WIB dari "YYYY-MM" + geser n bulan. */
function monthStart(ym: string, shift = 0) {
  const [y, m] = ym.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1 + shift, 1) - WIB)
}

/**
 * Menerjemahkan pilihan periode di URL menjadi rentang tanggal + periode pembanding yang sama panjang.
 * `earliest` = tanggal transaksi pertama (dipakai untuk "Semua").
 */
export function resolvePeriod(key: string | undefined, month: string | undefined, earliest: Date | null): Period {
  const now = new Date()
  const today = startOfDayWIB(now)
  const tomorrow = new Date(today.getTime() + DAY)

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const from = monthStart(month)
    const to = monthStart(month, 1)
    return { key: "custom", label: monthLabel(month), compareLabel: "vs bulan sebelumnya", from, to, prevFrom: monthStart(month, -1), prevTo: from, bucket: "day", month }
  }
  switch (key) {
    case "7h":
    case "30h": {
      const days = key === "7h" ? 7 : 30
      const from = new Date(tomorrow.getTime() - days * DAY)
      return { key, label: `${days} hari terakhir`, compareLabel: `vs ${days} hari sebelumnya`, from, to: tomorrow, prevFrom: new Date(from.getTime() - days * DAY), prevTo: from, bucket: "day" }
    }
    case "tahun": {
      const y = Number(toDateInputWIB(now).slice(0, 4))
      const from = new Date(Date.UTC(y, 0, 1) - WIB)
      const span = tomorrow.getTime() - from.getTime()
      const prevFrom = new Date(Date.UTC(y - 1, 0, 1) - WIB)
      return { key, label: `Tahun ${y}`, compareLabel: `vs periode sama ${y - 1}`, from, to: tomorrow, prevFrom, prevTo: new Date(prevFrom.getTime() + span), bucket: "month" }
    }
    case "semua":
    case undefined:
    case "": {
      const from = earliest ? startOfDayWIB(earliest) : today
      const bucket = tomorrow.getTime() - from.getTime() > 62 * DAY ? "month" : "day"
      return { key: "semua", label: "Semua waktu", compareLabel: null, from: null, to: tomorrow, prevFrom: null, prevTo: null, bucket }
    }
    default: {
      // "bulan" = bulan berjalan
      const from = startOfMonthWIB(now)
      const span = tomorrow.getTime() - from.getTime()
      const prevFrom = monthStart(toDateInputWIB(now).slice(0, 7), -1)
      return { key: "bulan", label: "Bulan ini", compareLabel: "vs periode sama bulan lalu", from, to: tomorrow, prevFrom, prevTo: new Date(prevFrom.getTime() + span), bucket: "day" }
    }
  }
}

/** Daftar label sumbu (hari atau bulan) untuk periode, supaya tanggal tanpa penjualan tetap tampil sebagai 0. */
export function bucketKeys(period: Period, earliest: Date | null) {
  const start = period.from ?? (earliest ? startOfDayWIB(earliest) : startOfDayWIB())
  const keys: string[] = []
  if (period.bucket === "day") {
    const end = period.month ? period.to : period.to
    for (let t = start.getTime(); t < end.getTime(); t += DAY) keys.push(toDateInputWIB(new Date(t)))
  } else {
    let ym = toDateInputWIB(start).slice(0, 7)
    const last = toDateInputWIB(new Date(period.to.getTime() - 1)).slice(0, 7)
    while (ym <= last) {
      keys.push(ym)
      const d = monthStart(ym, 1)
      ym = toDateInputWIB(d).slice(0, 7)
    }
  }
  return keys
}

export const bucketOf = (date: Date, bucket: "day" | "month") => (bucket === "day" ? toDateInputWIB(date) : toDateInputWIB(date).slice(0, 7))

/** Persentase perubahan; null bila tidak ada pembanding. */
export function change(current: number, previous: number | null) {
  if (previous === null) return null
  if (previous === 0) return current === 0 ? 0 : null
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10
}

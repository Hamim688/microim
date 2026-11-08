import { pct } from "./format"

type Row = { name: string; value: number; share: number; sub?: string }

/** Daftar peringkat dengan batang horizontal (satu warna; panjang = nilai relatif terhadap peringkat 1). */
export function BarList({ rows, format, tone = "gold", empty }: { rows: Row[]; format: (n: number) => string; tone?: "gold" | "green" | "blue" | "violet"; empty: string }) {
  if (!rows.length) return <p className="admin-muted">{empty}</p>
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <ol className={`admin-barlist is-${tone}`}>
      {rows.map((r, i) => (
        <li key={`${r.name}-${i}`} title={`${r.name}: ${format(r.value)} (${pct(r.share)})`}>
          <span className="admin-barlist-rank">{i + 1}</span>
          <div className="admin-barlist-main">
            <div className="admin-barlist-label">
              <span>{r.name}</span>
              <span className="admin-barlist-value">
                {format(r.value)} <b>{pct(r.share)}</b>
              </span>
            </div>
            <div className="admin-barlist-track" aria-hidden="true">
              <span style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, animationDelay: `${i * 60}ms` }} />
            </div>
            {r.sub ? <small>{r.sub}</small> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Batang 100% bertumpuk (mis. Komponen vs Jasa, metode bayar) + legenda berpersentase. */
export function ShareBar({ parts, format, colors }: { parts: { name: string; value: number; share: number }[]; format: (n: number) => string; colors: string[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0)
  if (!total) return <p className="admin-muted">Belum ada data.</p>
  return (
    <div className="admin-sharebar">
      <div className="admin-sharebar-track" role="img" aria-label={parts.map((p) => `${p.name} ${pct(p.share)}`).join(", ")}>
        {parts.filter((p) => p.value > 0).map((p) => (
          <span key={p.name} style={{ width: `${p.share}%`, background: colors[parts.indexOf(p) % colors.length] }} title={`${p.name}: ${format(p.value)} (${pct(p.share)})`} />
        ))}
      </div>
      <ul className="admin-legend is-inline">
        {parts.map((p, i) => (
          <li key={p.name}>
            <i style={{ background: colors[i % colors.length] }} aria-hidden="true" />
            <span>{p.name}</span>
            <b>{pct(p.share)}</b>
            <small>{format(p.value)}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

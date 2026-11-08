"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search, X } from "lucide-react"
import { Select, type SelectOption } from "./select"

/** Pencarian langsung + dropdown filter yang langsung mengubah URL (dipakai halaman Transaksi). */
export function ListFilters({
  placeholder,
  selects,
}: {
  placeholder: string
  selects: { param: string; label: string; options: SelectOption[]; defaultValue: string; className?: string }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    next.delete("hal")
    const s = next.toString()
    startTransition(() => router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false }))
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="admin-filters" role="search">
      <label className="admin-search">
        {pending ? <Loader2 aria-hidden="true" className="admin-spin" /> : <Search aria-hidden="true" />}
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value
            setQuery(value)
            clearTimeout(timer.current)
            timer.current = setTimeout(() => update({ q: value.trim() || null }), 300)
          }}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        {query ? (
          <button type="button" className="admin-search-clear" aria-label="Hapus pencarian" onClick={() => { setQuery(""); update({ q: null }) }}>
            <X aria-hidden="true" />
          </button>
        ) : null}
      </label>
      {selects.map((s) => (
        <Select
          key={s.param}
          label={s.label}
          className={s.className}
          value={params.get(s.param) ?? s.defaultValue}
          onChange={(v) => update({ [s.param]: v === s.defaultValue ? null : v })}
          options={s.options}
        />
      ))}
    </div>
  )
}

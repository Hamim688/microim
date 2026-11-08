"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search, X } from "lucide-react"
import { Select } from "./select"

/** Pencarian langsung (tanpa tombol), filter kategori, dan jumlah baris per halaman. */
export function ProductFilters({ categories, perPageOptions }: { categories: { name: string; slug: string }[]; perPageOptions: number[] }) {
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
          placeholder="Cari nama produk…"
          aria-label="Cari produk"
        />
        {query ? (
          <button
            type="button"
            className="admin-search-clear"
            aria-label="Hapus pencarian"
            onClick={() => {
              setQuery("")
              update({ q: null })
            }}
          >
            <X aria-hidden="true" />
          </button>
        ) : null}
      </label>
      <Select
        label="Kategori"
        className="is-category"
        value={params.get("kategori") ?? ""}
        onChange={(v) => update({ kategori: v || null })}
        options={[{ value: "", label: "Semua kategori" }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
      />
      <Select
        label="Baris per halaman"
        className="is-per"
        value={params.get("per") ?? String(perPageOptions[0])}
        onChange={(v) => update({ per: v === String(perPageOptions[0]) ? null : v })}
        options={perPageOptions.map((n) => ({ value: String(n), label: `${n} / halaman` }))}
      />
    </div>
  )
}

"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"

export type ComboOption = { value: string; label: string; group?: string; hint?: string; tone?: "ok" | "low" | "out"; disabled?: boolean }

/** Kolom pilih yang bisa diketik untuk mencari (dipakai untuk memilih komponen di form transaksi). */
export function Combobox({
  value,
  options,
  onChange,
  placeholder = "Cari…",
  label,
  invalid,
}: {
  value: string
  options: ComboOption[]
  onChange: (value: string) => void
  placeholder?: string
  label: string
  invalid?: boolean
}) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? options.filter((o) => `${o.label} ${o.group ?? ""}`.toLowerCase().includes(q)) : options
  }, [options, query])

  function place() {
    const t = inputRef.current?.parentElement
    const p = popRef.current
    if (!t || !p) return
    const r = t.getBoundingClientRect()
    const width = Math.max(r.width, 280)
    const height = Math.min(p.scrollHeight, 340)
    const up = window.innerHeight - r.bottom < height + 16 && r.top > window.innerHeight - r.bottom
    p.style.minWidth = `${width}px`
    p.style.maxWidth = `${Math.max(width, 360)}px`
    p.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - width - 8))}px`
    p.style.top = up ? `${r.top - height - 6}px` : `${r.bottom + 6}px`
    p.dataset.side = up ? "top" : "bottom"
  }

  function openList() {
    if (open) return
    setQuery("")
    const start = Math.max(0, options.findIndex((o) => o.value === value))
    setActive(start)
    popRef.current?.showPopover()
    setOpen(true)
    requestAnimationFrame(place)
  }
  function closeList() {
    popRef.current?.hidePopover()
    setOpen(false)
    setQuery("")
  }
  function choose(o: ComboOption | undefined) {
    if (!o || o.disabled) return
    onChange(o.value)
    closeList()
    inputRef.current?.blur()
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (popRef.current?.contains(t) || inputRef.current?.parentElement?.contains(t)) return
      closeList()
    }
    const onScroll = (e: Event) => {
      if (popRef.current?.contains(e.target as Node)) return
      place()
    }
    document.addEventListener("pointerdown", onDown)
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("resize", place)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", place)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      place()
      document.getElementById(`${id}-o-${active}`)?.scrollIntoView({ block: "nearest" })
    }
  }, [active, open, id, filtered.length])

  const move = (dir: 1 | -1) => {
    if (!filtered.length) return
    let i = active
    for (let n = 0; n < filtered.length; n++) {
      i = (i + dir + filtered.length) % filtered.length
      if (!filtered[i].disabled) break
    }
    setActive(i)
  }

  return (
    <div className={`admin-combo${open ? " is-open" : ""}${invalid ? " is-invalid" : ""}`}>
      <Search aria-hidden="true" className="admin-combo-icon" />
      <input
        ref={inputRef}
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[active] ? `${id}-o-${active}` : undefined}
        value={open ? query : (selected?.label ?? "")}
        placeholder={open && selected ? selected.label : placeholder}
        onFocus={openList}
        onClick={openList}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          if (!open) openList()
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            if (!open) openList()
            else move(1)
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            move(-1)
          } else if (e.key === "Enter") {
            if (open) {
              e.preventDefault()
              choose(filtered[active])
            }
          } else if (e.key === "Escape") {
            if (open) {
              e.preventDefault()
              closeList()
            }
          } else if (e.key === "Tab") {
            closeList()
          }
        }}
      />
      <ChevronDown aria-hidden="true" className="admin-combo-caret" />
      <div ref={popRef} id={`${id}-list`} popover="manual" role="listbox" aria-label={label} className="admin-select-pop admin-combo-pop">
        {filtered.length === 0 ? <div className="admin-combo-empty">Tidak ada yang cocok dengan “{query}”.</div> : null}
        {filtered.map((o, i) => {
          const header = o.group && o.group !== filtered[i - 1]?.group ? o.group : null
          return (
            <div key={o.value}>
              {header ? <div className="admin-combo-group">{header}</div> : null}
              <div
                id={`${id}-o-${i}`}
                role="option"
                aria-selected={o.value === value}
                aria-disabled={o.disabled || undefined}
                className={`admin-select-opt${i === active ? " is-active" : ""}${o.value === value ? " is-selected" : ""}${o.disabled ? " is-disabled" : ""}`}
                onMouseEnter={() => !o.disabled && setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
              >
                <span>{o.label}</span>
                {o.hint ? <small className={o.tone ? `is-${o.tone}` : undefined}>{o.hint}</small> : null}
                <Check aria-hidden="true" className="admin-select-check" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

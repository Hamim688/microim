"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

export type SelectOption = { value: string; label: string; hint?: string }

/**
 * Dropdown buatan sendiri (menu bawaan browser tidak bisa diberi gaya).
 * Memakai atribut `popover` sehingga menu tampil di lapisan paling atas dan tidak terpotong kartu/tabel.
 * Keyboard: ↑ ↓ Home End untuk pindah, Enter/Spasi memilih, Esc menutup, ketik huruf untuk lompat.
 */
export function Select({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  label: string
  className?: string
}) {
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const typed = useRef({ text: "", at: 0 })
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value))
  const selected = options[selectedIndex]

  function place() {
    const t = triggerRef.current
    const p = popRef.current
    if (!t || !p) return
    const r = t.getBoundingClientRect()
    const width = Math.max(r.width, 200)
    const spaceBelow = window.innerHeight - r.bottom
    const height = Math.min(p.scrollHeight, 320)
    const up = spaceBelow < height + 16 && r.top > spaceBelow
    p.style.minWidth = `${width}px`
    p.style.left = `${Math.min(r.left, window.innerWidth - width - 8)}px`
    p.style.top = up ? `${r.top - height - 6}px` : `${r.bottom + 6}px`
    p.dataset.side = up ? "top" : "bottom"
  }

  function show() {
    const p = popRef.current
    if (!p) return
    setActive(selectedIndex)
    p.showPopover()
    place()
    p.focus()
  }
  function hide(focusTrigger = true) {
    popRef.current?.hidePopover()
    if (focusTrigger) triggerRef.current?.focus()
  }
  function choose(index: number) {
    const option = options[index]
    if (option && option.value !== value) onChange(option.value)
    hide()
  }

  useEffect(() => {
    if (!open) return
    // Scroll di dalam daftar pilihan dibiarkan; scroll halaman cukup menggeser posisi menu.
    const onScroll = (event: Event) => {
      if (popRef.current?.contains(event.target as Node)) return
      const r = triggerRef.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > window.innerHeight) hide(false)
      else place()
    }
    const onResize = () => place()
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, true)
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" })
  }, [active, open, id])

  return (
    <div className={`admin-select${open ? " is-open" : ""}${className ? ` ${className}` : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        className="admin-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onClick={() => (open ? hide() : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault()
            show()
          }
        }}
      >
        <span>{selected?.label}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      <div
        ref={popRef}
        id={`${id}-list`}
        popover="auto"
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-activedescendant={`${id}-opt-${active}`}
        className="admin-select-pop"
        onToggle={(e) => setOpen((e as unknown as ToggleEvent).newState === "open")}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setActive((i) => Math.min(options.length - 1, i + 1))
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActive((i) => Math.max(0, i - 1))
          } else if (e.key === "Home") {
            e.preventDefault()
            setActive(0)
          } else if (e.key === "End") {
            e.preventDefault()
            setActive(options.length - 1)
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            choose(active)
          } else if (e.key === "Escape") {
            e.preventDefault()
            hide()
          } else if (e.key === "Tab") {
            hide(false)
          } else if (e.key.length === 1) {
            const now = Date.now()
            typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : "") + e.key.toLowerCase(), at: now }
            const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text))
            if (hit >= 0) setActive(hit)
          }
        }}
      >
        {options.map((o, i) => (
          <div
            key={o.value}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={o.value === value}
            className={`admin-select-opt${i === active ? " is-active" : ""}${o.value === value ? " is-selected" : ""}`}
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(i)}
          >
            <span>{o.label}</span>
            {o.hint ? <small>{o.hint}</small> : null}
            <Check aria-hidden="true" className="admin-select-check" />
          </div>
        ))}
      </div>
    </div>
  )
}

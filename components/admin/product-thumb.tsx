"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Maximize2, X } from "lucide-react"
import { portalTarget, useMounted } from "./dialog"

/** Foto kecil di tabel; diklik → foto tampil besar (lightbox). */
export function ProductThumb({ src, name, meta }: { src: string | null; name: string; meta?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const mounted = useMounted()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    else if (!open && d.open) d.close()
  }, [open, mounted])

  if (!src) return <span className="admin-thumb-empty" aria-hidden="true">{name.charAt(0)}</span>

  return (
    <>
      <button type="button" className="admin-thumb-btn" onClick={() => setOpen(true)} aria-label={`Lihat foto ${name}`}>
        <Image src={src} alt="" width={40} height={40} />
        <span className="admin-thumb-zoom" aria-hidden="true"><Maximize2 /></span>
      </button>
      {mounted ? createPortal(<dialog
        ref={ref}
        className="admin-lightbox"
        aria-label={`Foto ${name}`}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        {open ? (
          <figure>
            <Image src={src} alt={name} width={800} height={800} sizes="(max-width: 640px) 92vw, 560px" />
            <figcaption>
              <strong>{name}</strong>
              {meta ? <span>{meta}</span> : null}
            </figcaption>
            <button type="button" className="admin-lightbox-close" onClick={() => setOpen(false)} aria-label="Tutup" autoFocus>
              <X aria-hidden="true" />
            </button>
          </figure>
        ) : null}
      </dialog>, portalTarget()) : null}
    </>
  )
}

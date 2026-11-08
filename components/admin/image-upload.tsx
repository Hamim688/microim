"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, Loader2, RefreshCw, Trash2, Undo2 } from "lucide-react"

const SIZE = 800 // hasil akhir: persegi 800×800, sama seperti foto katalog lainnya
const MAX_INPUT = 15 * 1024 * 1024

/** Potong tengah jadi persegi, kecilkan ke 800px, lalu simpan sebagai WebP (fallback JPEG). */
async function compress(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const out = Math.min(SIZE, side)
  const canvas = document.createElement("canvas")
  canvas.width = out
  canvas.height = out
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas tidak tersedia")
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, out, out)
  bitmap.close()
  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85))
  const webp = await toBlob("image/webp")
  const blob = webp && webp.type === "image/webp" ? webp : await toBlob("image/jpeg")
  if (!blob) throw new Error("Gagal memproses gambar")
  const ext = blob.type === "image/webp" ? "webp" : "jpg"
  return new File([blob], `produk.${ext}`, { type: blob.type })
}

const kb = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)

/** Unggah foto produk: klik, seret-lepas, atau tempel (Ctrl+V). */
export function ImageUpload({ initialUrl }: { initialUrl?: string | null }) {
  const fileRef = useRef<HTMLInputElement>(null) // input tersembunyi yang ikut terkirim bersama form
  const pickRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialUrl || null)
  const [info, setInfo] = useState<string | null>(null)
  const [removed, setRemoved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const objectUrl = useRef<string | null>(null)
  const pending = useRef<File | null>(null)

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
  }, [])

  // React mengosongkan isian form setelah aksi selesai. Bila simpan gagal (mis. nama kosong),
  // pasang lagi foto yang sudah dipilih supaya tidak perlu memilih ulang.
  useEffect(() => {
    const input = fileRef.current
    const form = input?.form
    if (!input || !form) return
    const restore = () =>
      setTimeout(() => {
        if (!pending.current) return
        const dt = new DataTransfer()
        dt.items.add(pending.current)
        input.files = dt.files
      })
    form.addEventListener("reset", restore)
    return () => form.removeEventListener("reset", restore)
  }, [])

  async function take(file: File | undefined) {
    if (!file) return
    setError(null)
    if (!file.type.startsWith("image/")) return setError("File harus berupa gambar (JPG, PNG, atau WebP).")
    if (file.size > MAX_INPUT) return setError("Gambar terlalu besar (maksimal 15 MB).")
    setBusy(true)
    try {
      const small = await compress(file)
      const dt = new DataTransfer()
      dt.items.add(small)
      if (fileRef.current) fileRef.current.files = dt.files
      pending.current = small
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
      objectUrl.current = URL.createObjectURL(small)
      setPreview(objectUrl.current)
      setInfo(`${kb(file.size)} → ${kb(small.size)} · 800×800`)
      setRemoved(false)
    } catch {
      setError("Gambar tidak bisa dibaca. Coba file lain.")
    } finally {
      setBusy(false)
    }
  }

  function clearFile() {
    pending.current = null
    if (fileRef.current) fileRef.current.value = ""
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    objectUrl.current = null
    setInfo(null)
  }

  const isNew = Boolean(info)

  return (
    <div className="admin-upload">
      <input ref={fileRef} type="file" name="image" accept="image/*" hidden tabIndex={-1} />
      <input ref={pickRef} type="file" accept="image/*" hidden tabIndex={-1} onChange={(e) => { void take(e.target.files?.[0]); e.target.value = "" }} />
      {removed ? <input type="hidden" name="removeImage" value="1" /> : null}

      <div
        className={`admin-upload-drop${drag ? " is-drag" : ""}${preview ? " has-image" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={preview ? "Ganti foto produk" : "Unggah foto produk"}
        onClick={() => pickRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            pickRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          void take(e.dataTransfer.files?.[0])
        }}
        onPaste={(e) => void take(e.clipboardData.files?.[0])}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- pratinjau blob lokal
          <img src={preview} alt="Pratinjau foto produk" />
        ) : (
          <div className="admin-upload-empty">
            <ImagePlus aria-hidden="true" />
            <strong>Klik, seret, atau tempel foto</strong>
            <span>JPG, PNG, WebP · otomatis dipotong persegi & dikompres</span>
          </div>
        )}
        {busy ? (
          <div className="admin-upload-busy"><Loader2 aria-hidden="true" className="admin-spin" /> Memproses…</div>
        ) : null}
      </div>

      <div className="admin-upload-side">
        <strong>Foto produk</strong>
        <p>{isNew ? `Foto baru siap diunggah (${info}).` : preview ? "Foto saat ini. Klik foto untuk mengganti." : removed ? "Foto akan dihapus saat disimpan." : "Belum ada foto."}</p>
        <div className="admin-upload-actions">
          <button type="button" className="admin-btn is-ghost" onClick={() => pickRef.current?.click()} disabled={busy}>
            {preview ? <RefreshCw aria-hidden="true" /> : <ImagePlus aria-hidden="true" />} {preview ? "Ganti" : "Pilih foto"}
          </button>
          {isNew && initialUrl ? (
            <button type="button" className="admin-btn is-ghost" onClick={() => { clearFile(); setPreview(initialUrl) }}>
              <Undo2 aria-hidden="true" /> Batalkan
            </button>
          ) : null}
          {preview ? (
            <button
              type="button"
              className="admin-btn is-ghost is-danger-text"
              onClick={() => {
                clearFile()
                setPreview(null)
                setRemoved(Boolean(initialUrl))
              }}
            >
              <Trash2 aria-hidden="true" /> Hapus
            </button>
          ) : null}
        </div>
        {error ? <p className="admin-hint is-error" role="alert">{error}</p> : null}
      </div>
    </div>
  )
}

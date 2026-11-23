"use client"

import { useActionState, useState } from "react"
import { Save, Star } from "lucide-react"
import type { ReviewFormState } from "@/app/admin/(panel)/ulasan/actions"

type Action = (state: ReviewFormState, formData: FormData) => Promise<ReviewFormState>

const LABELS = ["", "Buruk", "Kurang", "Cukup", "Bagus", "Sangat bagus"]

/** Formulir admin untuk memasukkan ulasan pelanggan (mis. dari chat WhatsApp, dengan izin pelanggan). */
export function ReviewForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(action, undefined)
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const shown = hover || rating
  return (
    <form action={formAction} className="admin-form admin-grid-2">
      <label className="admin-field">
        <span>Nama pelanggan</span>
        <input name="name" required minLength={2} maxLength={60} placeholder="mis. Dimas atau D. Pratama" />
      </label>
      <label className="admin-field">
        <span>Keterangan (opsional)</span>
        <input name="detail" maxLength={60} placeholder="mis. Teknik Elektro 2023" />
      </label>

      <fieldset className="admin-field is-wide admin-stars-field">
        <legend>Rating</legend>
        <div className="admin-stars-input" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={n <= shown ? "is-on" : undefined} onMouseEnter={() => setHover(n)}>
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} />
              <Star aria-hidden="true" />
              <span className="sr-only">{n} bintang</span>
            </label>
          ))}
          <b aria-hidden="true">{LABELS[shown]}</b>
        </div>
      </fieldset>

      <label className="admin-field is-wide">
        <span>Produk / jasa yang dibeli (opsional)</span>
        <input name="item" maxLength={80} placeholder="mis. Servo SG90, atau Jasa rakit line follower" />
      </label>
      <label className="admin-field is-wide">
        <span>Isi ulasan</span>
        <textarea name="comment" rows={4} required minLength={10} maxLength={600} placeholder="Tulis persis seperti yang disampaikan pelanggan." />
      </label>

      <label className="admin-check is-wide">
        <input type="checkbox" name="publish" defaultChecked />
        <span className="admin-check-box" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
        </span>
        <span>Langsung tampilkan di situs</span>
      </label>
      <p className="admin-hint is-wide">Pastikan pelanggan sudah mengizinkan ulasannya dipajang. Pakai nama panggilan atau inisial kalau mereka tidak mau nama lengkapnya tampil.</p>

      <div className="is-wide admin-form-foot">
        {state?.error ? <p className="admin-alert is-error" role="alert">{state.error}</p> : null}
        <button type="submit" className="admin-btn is-primary" disabled={pending}>
          <Save aria-hidden="true" /> {pending ? "Menyimpan…" : "Simpan ulasan"}
        </button>
      </div>
    </form>
  )
}

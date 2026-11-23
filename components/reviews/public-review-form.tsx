"use client"

import { useActionState, useState } from "react"
import { Check, Send, Star } from "lucide-react"
import { BackLink } from "@/components/layout/back-link"
import type { PublicReviewState } from "@/app/(site)/ulasan/actions"

type Action = (state: PublicReviewState, formData: FormData) => Promise<PublicReviewState>

const RATING_LABELS = ["", "Buruk", "Kurang", "Cukup", "Bagus", "Sangat bagus"]

/**
 * Formulir ulasan publik dengan pemilih bintang interaktif dan pratinjau kartu ulasan secara langsung.
 */
export function PublicReviewForm({ action }: { action: Action }) {
  const [formKey, setFormKey] = useState(0)
  return <ReviewFormInner key={formKey} action={action} onReset={() => setFormKey((k) => k + 1)} />
}

function ReviewFormInner({ action, onReset }: { action: Action; onReset: () => void }) {
  const [state, formAction, pending] = useActionState<PublicReviewState, FormData>(action, undefined)
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState("")
  const [detail, setDetail] = useState("")
  const [item, setItem] = useState("")
  const [comment, setComment] = useState("")

  const shown = hover || rating
  const previewName = name.trim() || "Nama kamu"
  const previewComment = comment.trim() || "Ceritakan pengalamanmu belanja komponen atau pakai jasa rakit di Microim..."

  return (
    <div className="inq-layout">
      {state?.ok ? (
        <div className="inq-done" role="status">
          <span className="inq-done-mark" aria-hidden="true"><Check /></span>
          <h2>Terima kasih, {state.name}!</h2>
          <p>
            Ulasanmu sudah kami terima dan masuk ke antrean tinjauan tim Microim. Setelah disetujui, ulasanmu akan langsung tampil di halaman utama.
          </p>
          <div className="inq-done-actions">
            <BackLink fallback="/#ulasan" className="button-primary" label="Kembali" />
            <button type="button" className="button-secondary" onClick={onReset}>
              Kirim Ulasan Lain
            </button>
          </div>
        </div>
      ) : (
        <form action={formAction} className="inq-form">
          {/* Kolom jebakan anti-bot; disembunyikan dari pengguna asli */}
          <input className="rv-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="inq-row">
            <div className="inq-field">
              <label htmlFor="rev-name">Nama / Panggilan</label>
              <input
                id="rev-name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={60}
                autoComplete="name"
                placeholder="Contoh: Dimas atau D. Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="inq-field">
              <label htmlFor="rev-detail">Asal / Keterangan <span className="inq-optional">opsional</span></label>
              <input
                id="rev-detail"
                name="detail"
                type="text"
                maxLength={60}
                placeholder="Contoh: Teknik Elektro 2023"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
          </div>

          <fieldset className="inq-field">
            <legend>Penilaian</legend>
            <div className="rv-stars-input" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className={n <= shown ? "is-on" : undefined} onMouseEnter={() => setHover(n)}>
                  <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} />
                  <Star aria-hidden="true" />
                  <span className="sr-only">{n} bintang</span>
                </label>
              ))}
              <b aria-hidden="true">{RATING_LABELS[shown]}</b>
            </div>
          </fieldset>

          <div className="inq-field">
            <label htmlFor="rev-item">Komponen / Jasa yang dibeli <span className="inq-optional">opsional</span></label>
            <input
              id="rev-item"
              name="item"
              type="text"
              maxLength={80}
              placeholder="Contoh: ESP32 DevKit + Sensor Ultrasonik, atau Jasa rakit line follower"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>

          <div className="inq-field">
            <label htmlFor="rev-comment">Ulasanmu</label>
            <textarea
              id="rev-comment"
              name="comment"
              rows={3}
              required
              minLength={10}
              maxLength={600}
              placeholder="Bagaimana pengalamanmu? Misal kecepatan pengiriman, kualitas modul, atau hasil rakitan/kodenya."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {state?.error ? (
            <p className="rv-form-error" role="alert">{state.error}</p>
          ) : null}

          <div className="inq-submit">
            <button type="submit" className="button-primary" disabled={pending}>
              <Send aria-hidden="true" />{pending ? "Mengirim..." : "Kirim Ulasan"}
            </button>
            <p className="inq-note">Ulasan akan ditinjau tim sebelum ditampilkan di Beranda.</p>
          </div>
        </form>
      )}

      <aside className="inq-side" aria-label="Pratinjau kartu ulasan">
        <div className="inq-preview-bar">
          <span className="inq-preview-dot" aria-hidden="true" />
          <span>Pratinjau tampilan di Beranda</span>
        </div>

        <article className="rv-card rv-preview-card">
          <span className="rv-stars" role="img" aria-label={`${rating} dari 5 bintang`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} aria-hidden="true" className={n <= rating ? "is-on" : undefined} />
            ))}
          </span>
          <blockquote>{previewComment}</blockquote>
          <footer>
            <span className="rv-avatar" aria-hidden="true">{previewName.charAt(0).toUpperCase()}</span>
            <span className="rv-who">
              <strong>{previewName}</strong>
              {detail.trim() ? <small>{detail.trim()}</small> : null}
            </span>
          </footer>
          {item.trim() ? <p className="rv-item">{item.trim()}</p> : null}
        </article>
      </aside>
    </div>
  )
}

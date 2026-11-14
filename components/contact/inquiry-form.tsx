"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Image from "next/image"
import { Check, Send } from "lucide-react"
import { siteContact, whatsappLink } from "@/lib/site"

const projectTypes = [
  "Tugas Praktikum",
  "Tugas Akhir / Skripsi",
  "Rakit Perangkat IoT",
  "Pemrograman Mikrokontroler",
  "Robot / Mobil Kit",
  "Permintaan Komponen",
  "Lainnya",
]

const emptyForm = { name: "", email: "", whatsapp: "", projectType: projectTypes[0], budget: "", timeline: "", description: "" }
type FormState = typeof emptyForm

const GREETING = "Halo Microim, saya ingin mengajukan proyek."

/** Baris pesan dalam urutan tampil. Baris opsional yang kosong tidak ikut dikirim. */
function messageRows(form: FormState) {
  return [
    { label: "Nama", value: form.name.trim(), optional: false },
    { label: "WhatsApp", value: form.whatsapp.trim(), optional: false },
    { label: "Email", value: form.email.trim(), optional: true },
    { label: "Jenis kebutuhan", value: form.projectType, optional: false },
    { label: "Estimasi anggaran", value: form.budget.trim(), optional: true },
    { label: "Target selesai", value: form.timeline.trim(), optional: true },
    { label: "Kebutuhan", value: form.description.trim(), optional: false },
  ].filter((row) => !row.optional || row.value)
}

function buildMessage(form: FormState) {
  const rows = messageRows(form)
  const details = rows.filter((row) => row.label !== "Kebutuhan").map((row) => `${row.label}: ${row.value}`)
  return [GREETING, "", ...details, "", `Kebutuhan: ${form.description.trim()}`].join("\n")
}

/**
 * Formulir pengajuan: menyusun pesan rapi lalu membukanya di WhatsApp Microim. Di sebelahnya ada pratinjau pesan
 * yang ikut terisi selagi formulir diketik, supaya pengisi tahu persis apa yang akan terkirim. `children` (rincian
 * kontak) ditampilkan di bawah pratinjau.
 */
export function InquiryForm({ children }: { children?: ReactNode }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const set = (key: keyof FormState) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    window.open(whatsappLink(buildMessage(form)), "_blank", "noopener,noreferrer")
    setSubmitted(true)
  }

  return (
    <div className="inq-layout">
      {submitted ? (
        <div className="inq-done" role="status">
          <span className="inq-done-mark" aria-hidden="true"><Check /></span>
          <h2>Lanjutkan di WhatsApp</h2>
          <p>
            Pesan pengajuanmu sudah disiapkan di WhatsApp. Tekan kirim di sana agar tim Microim menerimanya. Jika WhatsApp tidak terbuka, hubungi kami langsung di {siteContact.whatsappDisplay}.
          </p>
          <div className="inq-done-actions">
            <a className="button-primary" href={whatsappLink(buildMessage(form))} target="_blank" rel="noopener noreferrer">
              <Send aria-hidden="true" />Buka WhatsApp Lagi
            </a>
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setForm(emptyForm)
                setSubmitted(false)
              }}
            >
              Isi Pengajuan Lain
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="inq-form">
          <div className="inq-row">
            <div className="inq-field">
              <label htmlFor="inq-name">Nama lengkap</label>
              <input id="inq-name" type="text" required minLength={2} autoComplete="name" placeholder="Contoh: Budi Pratama" value={form.name} onChange={set("name")} />
            </div>
            <div className="inq-field">
              <label htmlFor="inq-wa">Nomor WhatsApp</label>
              <input id="inq-wa" type="tel" required inputMode="tel" pattern="[0-9+ \-]{9,16}" title="Nomor WhatsApp 9–16 digit" autoComplete="tel" placeholder="Contoh: 081234567890" value={form.whatsapp} onChange={set("whatsapp")} />
            </div>
          </div>

          <fieldset className="inq-field inq-types">
            <legend>Jenis kebutuhan</legend>
            <div className="inq-chips">
              {projectTypes.map((type) => (
                <label key={type} className="inq-chip">
                  <input type="radio" name="inq-type" value={type} checked={form.projectType === type} onChange={set("projectType")} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="inq-field">
            <label htmlFor="inq-desc">Ceritakan kebutuhanmu</label>
            <textarea
              id="inq-desc"
              rows={5}
              required
              minLength={10}
              placeholder="Contoh: robot line follower pakai Arduino Uno, 2 motor DC, sensor garis 5 channel. Butuh dirakit + kodenya."
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <div className="inq-row">
            <div className="inq-field">
              <label htmlFor="inq-timeline">Target selesai <span>(opsional)</span></label>
              <input id="inq-timeline" type="text" placeholder="Contoh: sebelum praktikum minggu depan" value={form.timeline} onChange={set("timeline")} />
            </div>
            <div className="inq-field">
              <label htmlFor="inq-budget">Estimasi anggaran <span>(opsional)</span></label>
              <input id="inq-budget" type="text" placeholder="Contoh: Rp 150.000 – Rp 500.000" value={form.budget} onChange={set("budget")} />
            </div>
          </div>

          <div className="inq-field">
            <label htmlFor="inq-email">Email <span>(opsional)</span></label>
            <input id="inq-email" type="email" autoComplete="email" placeholder="Contoh: budi@gmail.com" value={form.email} onChange={set("email")} />
          </div>

          <div className="inq-submit">
            <button type="submit" className="button-primary">
              <Send aria-hidden="true" />Kirim lewat WhatsApp
            </button>
            <p>Formulir ini tidak menyimpan datamu. Pesan baru terkirim setelah kamu menekan kirim di WhatsApp.</p>
          </div>
        </form>
      )}

      <aside className="inq-side">
        <div className="kontak-chat inq-preview" aria-label="Pratinjau pesan WhatsApp">
          <div className="kontak-chat-top">
            <Image src="/logo/logo-baru.png" alt="" width={40} height={40} />
            <p><strong>Microim</strong><span>Pratinjau pesan yang akan terbuka di WhatsApp</span></p>
          </div>
          <div className="inq-bubble">
            <p>{GREETING}</p>
            <dl>
              {messageRows(form).map((row) => (
                <div key={row.label} className={row.label === "Kebutuhan" ? "is-long" : undefined}>
                  <dt>{row.label}</dt>
                  <dd className={row.value ? undefined : "is-empty"}>{row.value || "belum diisi"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {children}
      </aside>
    </div>
  )
}

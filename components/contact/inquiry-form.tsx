"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Send } from "lucide-react"
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

const fieldClass =
  "w-full px-4 py-2.5 rounded-[4px] bg-[#071426] border border-[#173359] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#FFC928] focus-visible:ring-2 focus-visible:ring-[#FFC928]/30"
const labelClass = "block text-xs font-semibold text-slate-300 mb-2"

const emptyForm = { name: "", email: "", whatsapp: "", projectType: projectTypes[0], budget: "", timeline: "", description: "" }

/** Formulir pengajuan: menyusun pesan rapi lalu membukanya di WhatsApp Microim. */
export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const set = (key: keyof typeof emptyForm) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const message = [
      "Halo Microim, saya ingin mengajukan proyek.",
      "",
      `Nama: ${form.name.trim()}`,
      `WhatsApp: ${form.whatsapp.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      `Jenis kebutuhan: ${form.projectType}`,
      form.budget.trim() ? `Estimasi anggaran: ${form.budget.trim()}` : null,
      form.timeline.trim() ? `Target selesai: ${form.timeline.trim()}` : null,
      "",
      `Kebutuhan: ${form.description.trim()}`,
    ]
      .filter((line) => line !== null)
      .join("\n")
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer")
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-[6px] bg-[#0c213d] border border-[#173359] p-5 sm:p-8 text-center py-12 space-y-4" role="status">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-white">Lanjutkan di WhatsApp</h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto">
          Pesan pengajuanmu sudah disiapkan di WhatsApp. Tekan kirim di sana agar tim Microim menerimanya. Jika WhatsApp tidak terbuka, hubungi kami langsung di {siteContact.whatsappDisplay}.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm)
            setSubmitted(false)
          }}
          className="button-secondary mx-auto"
        >
          Kirim Pengajuan Lain
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[6px] bg-[#0c213d] border border-[#173359] p-5 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="inq-name" className={labelClass}>Nama Lengkap *</label>
          <input id="inq-name" type="text" required minLength={2} autoComplete="name" placeholder="Contoh: Budi Pratama" value={form.name} onChange={set("name")} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="inq-wa" className={labelClass}>Nomor WhatsApp *</label>
          <input id="inq-wa" type="tel" required inputMode="tel" pattern="[0-9+ \-]{9,16}" title="Nomor WhatsApp 9–16 digit" autoComplete="tel" placeholder="Contoh: 081234567890" value={form.whatsapp} onChange={set("whatsapp")} className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="inq-email" className={labelClass}>Email <span className="font-normal text-slate-500">(opsional)</span></label>
          <input id="inq-email" type="email" autoComplete="email" placeholder="Contoh: budi@gmail.com" value={form.email} onChange={set("email")} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="inq-type" className={labelClass}>Jenis Kebutuhan *</label>
          <select id="inq-type" value={form.projectType} onChange={set("projectType")} className={fieldClass}>
            {projectTypes.map((type) => (
              <option key={type} value={type} className="bg-[#0c213d] text-white">{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="inq-budget" className={labelClass}>Estimasi Anggaran</label>
          <input id="inq-budget" type="text" placeholder="Contoh: Rp 150.000 – Rp 500.000" value={form.budget} onChange={set("budget")} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="inq-timeline" className={labelClass}>Target Selesai</label>
          <input id="inq-timeline" type="text" placeholder="Contoh: sebelum praktikum minggu depan" value={form.timeline} onChange={set("timeline")} className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="inq-desc" className={labelClass}>Ceritakan Kebutuhanmu *</label>
        <textarea
          id="inq-desc"
          rows={5}
          required
          minLength={10}
          placeholder="Contoh: robot line follower pakai Arduino Uno, 2 motor DC, sensor garis 5 channel. Butuh dirakit + kodenya."
          value={form.description}
          onChange={set("description")}
          className={fieldClass}
        />
      </div>

      <button type="submit" className="button-primary w-full justify-center">
        <Send className="w-4 h-4" aria-hidden="true" />
        Kirim lewat WhatsApp
      </button>
    </form>
  )
}

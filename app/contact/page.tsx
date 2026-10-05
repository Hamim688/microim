"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, CheckCircle2, MessageSquare, Mail, MapPin } from "lucide-react"

const projectTypes = [
  "Pengembangan IoT",
  "Rancang Purwarupa Perangkat Keras",
  "Pemrograman Sistem Tertanam",
  "Aplikasi Seluler",
  "Sistem Otomasi",
  "Proyek Kustom",
  "Permintaan Komponen",
  "Lainnya",
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    projectType: "Pengembangan IoT",
    budget: "",
    timeline: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated submission for the design system phase
    setSubmitted(true)
  }

  return (
    <div className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#FFC928] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <Badge variant="gold">Pengajuan Proyek &amp; Konsultasi</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Mulai Diskusikan Solusi Teknologi Anda
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Ceritakan spesifikasi kebutuhan proyek IoT, perancangan perangkat keras, atau sistem tertanam Anda. Tim rekayasa MikroIm akan menelaah dan memberikan konsultasi teknis awal.
          </p>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c213d] border border-[#173359] space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Hubungi Kami</h4>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="w-4 h-4 text-[#FFC928]" />
              <span>contact@mikroim.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <MessageSquare className="w-4 h-4 text-[#FFC928]" />
              <span>WhatsApp: +62 812-3456-7890</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-[#FFC928] shrink-0 mt-0.5" />
              <span>Laboratorium Rekayasa IoT MikroIm, Indonesia</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#0c213d] border border-[#173359] p-5 sm:p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Pengajuan Terkirim!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Terima kasih, tim rekayasa MikroIm telah menerima informasi kebutuhan proyek Anda dan akan segera menghubungi melalui WhatsApp atau surel.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="secondary" size="sm">
                  Kirim Pengajuan Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Pratama"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm focus:outline-none focus:border-[#FFC928]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Surel Bisnis / Pribadi *</label>
                    <input
                      type="email"
                      required
                      placeholder="Contoh: budi@perusahaan.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm focus:outline-none focus:border-[#FFC928]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Nomor WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm focus:outline-none focus:border-[#FFC928]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Jenis Proyek *</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm focus:outline-none focus:border-[#FFC928]"
                    >
                      {projectTypes.map((pt) => (
                        <option key={pt} value={pt} className="bg-[#0c213d] text-white">
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Estimasi Anggaran</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rp 5.000.000–Rp 15.000.000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm focus:outline-none focus:border-[#FFC928]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Target Waktu Pengerjaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1 bulan / Triwulan III 2026"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm focus:outline-none focus:border-[#FFC928]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Deskripsi Kebutuhan &amp; Spesifikasi *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Jelaskan gambaran umum sistem, masukan sensor yang diinginkan, aktuator, atau platform pemantauan..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-[#173359] text-white text-sm focus:outline-none focus:border-[#FFC928]"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Kirim Pengajuan Proyek
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

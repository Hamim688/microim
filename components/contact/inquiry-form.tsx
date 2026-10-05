"use client"

import React, { useState } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="rounded-2xl bg-[#0c213d] border border-[#173359] p-8">
      {submitted ? (
        <div className="text-center py-8 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h4 className="text-xl font-bold text-white">Inquiry Diterima</h4>
          <p className="text-sm text-slate-300">Kami akan merespons dalam 1x24 jam.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
            <input
              required
              className="w-full px-3 py-2 rounded-lg bg-[#071426] border border-[#173359] text-white text-sm"
              placeholder="Nama Anda"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email / WhatsApp</label>
            <input
              required
              className="w-full px-3 py-2 rounded-lg bg-[#071426] border border-[#173359] text-white text-sm"
              placeholder="Kontak Anda"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ringkasan Kebutuhan</label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-[#071426] border border-[#173359] text-white text-sm"
              placeholder="Deskripsi singkat..."
            />
          </div>
          <Button type="submit" className="w-full flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Kirim Kebutuhan
          </Button>
        </form>
      )}
    </div>
  )
}

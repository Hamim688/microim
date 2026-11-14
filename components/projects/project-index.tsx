"use client"

import { useState } from "react"
import { ArrowUpRight, MessageCircle, X } from "lucide-react"
import { Segmented } from "@/components/layout/segmented"
import type { ProjectIdea } from "@/lib/projects"
import { ProjectDrawing } from "@/components/landing/project-drawings"
import { whatsappLink } from "@/lib/site"

const CATEGORIES = ["Semua", "Robotika", "IoT"] as const
const LEVELS = ["Semua", "Pemula", "Menengah", "Lanjut"] as const

/**
 * Indeks ide proyek: disaring per bidang dan tingkat kesulitan. Tiap ide adalah satu baris (judul, penjelasan,
 * gambar teknik, komponen yang dibutuhkan, tautan konsultasi WhatsApp), dipisah garis putus-putus cetak biru seperti section Proyek di Beranda.
 */
export function ProjectIndex({ projects }: { projects: ProjectIdea[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Semua")
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Semua")
  const visible = projects.filter((p) => (category === "Semua" || p.category === category) && (level === "Semua" || p.level === level))

  const filtering = category !== "Semua" || level !== "Semua"
  const reset = () => {
    setCategory("Semua")
    setLevel("Semua")
  }

  return (
    <>
      {/* Kapsul kaca melayang: bidang (pil emas), tingkat (pil putih), dan jumlah hasil yang muncul saat menyaring.
          Jumlah seluruh ide sengaja tidak disebut. */}
      <div className="island-wrap is-start">
        <div className="glass-island">
          <span className="island-label" aria-hidden="true">Bidang</span>
          <Segmented id="pidx-bidang" label="Saring bidang proyek" options={CATEGORIES} value={category} onChange={setCategory} />
          <i className="island-sep" aria-hidden="true" />
          <span className="island-label" aria-hidden="true">Tingkat</span>
          <Segmented id="pidx-tingkat" label="Saring tingkat kesulitan" options={LEVELS} value={level} onChange={setLevel} tone="soft" />
          <div className={`island-extra${filtering ? " is-open" : ""}`}>
            <div inert={!filtering}>
              <p aria-live="polite">{filtering ? `${visible.length} cocok` : ""}</p>
              <button type="button" onClick={reset} aria-label="Hapus saringan"><X aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="cat-empty">
          <p>Belum ada ide proyek untuk gabungan saringan ini. Punya ide sendiri? Ceritakan saja, kami bantu susun komponennya.</p>
          <div>
            <button type="button" className="button-secondary" onClick={reset}>Tampilkan Semua</button>
            <a className="button-primary" href={whatsappLink("Halo Microim, saya punya ide proyek dan ingin konsultasi.")} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />Ceritakan via WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <ol className="proj-list pidx-list">
          {visible.map((project) => (
            // Kunci menyertakan saringan aktif supaya baris muncul lagi dengan animasi tiap saringan berubah.
            <li key={`${category}-${level}-${project.slug}`}>
              <article className="pidx-row">
                <div className="proj-figure"><ProjectDrawing slug={project.slug} /></div>
                <div className="proj-main">
                  <p className="proj-cat">{project.category} · {project.level}</p>
                  <h2>{project.title}</h2>
                  <p className="proj-desc">{project.desc}</p>
                </div>
                <div className="proj-side">
                  <p className="proj-bom-title">Komponen yang dibutuhkan</p>
                  <ul className="proj-bom">
                    {project.parts.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <a
                    className="proj-ask"
                    href={whatsappLink(`Halo Microim, saya tertarik dengan ide proyek: ${project.title}. Bisa dibantu komponen atau perakitannya?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Konsultasikan proyek ini<span className="sr-only">: {project.title}, lewat WhatsApp</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}

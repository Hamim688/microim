import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/landing/landing-motion"
import { RevealFlag } from "@/components/landing/reveal-flag"
import { ProjectDrawing } from "@/components/landing/project-drawings"
import { exampleProjects } from "@/lib/projects"
import { whatsappLink } from "@/lib/site"

/**
 * Proyek (Beranda): lembar cetak biru. Tiap contoh proyek adalah satu baris berisi gambar teknik (tergambar saat
 * masuk layar), penjelasan, dan daftar komponennya. Tepi atas section berlubang setengah lingkaran berlapis emas,
 * seperti tepi modul ESP32.
 */
export function ProjectShowcase() {
  return (
    <section className="proj-section" id="projects" aria-labelledby="projects-heading">
      <div className="site-container">
        <ScrollReveal className="proj-head">
          <h2 id="projects-heading">Contoh Proyek yang Bisa Kami Rakitkan</h2>
          <div>
            <p>Semuanya dirakit dari komponen di katalog Microim. Tugasmu punya spesifikasi berbeda? Tinggal konsultasikan.</p>
            <Link className="proj-all" href="/projects">Lihat halaman proyek <ArrowRight aria-hidden="true" /></Link>
          </div>
        </ScrollReveal>

        <ol className="proj-list">
          {exampleProjects.map((project) => (
            <li key={project.slug}>
              <RevealFlag className="proj-row" amount={0.35}>
                <div className="proj-figure"><ProjectDrawing slug={project.slug} /></div>
                <div className="proj-main">
                  <p className="proj-cat">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="proj-desc">{project.desc}</p>
                </div>
                <div className="proj-side">
                  <p className="proj-bom-title">Komponen utama</p>
                  <ul className="proj-bom">
                    {project.tech.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <a
                    className="proj-ask"
                    href={whatsappLink(`Halo Microim, saya ingin konsultasi proyek serupa: ${project.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Konsultasikan proyek serupa<span className="sr-only"> {project.title} lewat WhatsApp</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </RevealFlag>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

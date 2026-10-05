import Link from "next/link"
import { ArrowUpRight, Bot, House, Radio, SlidersHorizontal } from "lucide-react"

const projectAreas = [
  { category: "IOT / OTOMASI", title: "Sistem Rumah Cerdas", description: "Sensor dan kendali terhubung untuk memantau serta mengatur berbagai perangkat rumah.", icon: House, code: "[IOT.01]" },
  { category: "ROBOTIKA / KENDALI", title: "Lengan Robot & Otomasi", description: "Kendali sistem tertanam dan integrasi sensor untuk perangkat robotik dan otomasi.", icon: Bot, code: "[RBT.02]" },
  { category: "PERANGKAT / TELEMETRI", title: "Perangkat Pemantau IoT", description: "Konsep perangkat yang mengirim data pengukuran lapangan ke sistem pemantauan terhubung.", icon: Radio, code: "[MON.03]" },
  { category: "SISTEM TERTANAM", title: "Pengendali Industri", description: "Rancangan sistem tertanam untuk kebutuhan kendali, pengukuran, dan komunikasi perangkat.", icon: SlidersHorizontal, code: "[SYS.04]" },
]

export function ProjectShowcase() {
  return (
    <section className="projects-section" id="projects">
      <div className="site-container">
        <div className="edge-heading projects-heading">
          <div><span className="section-kicker">REKAYASA TERAPAN</span><h2>Teknologi untuk Dampak Nyata</h2><p>Gagasan teknologi yang membawa perangkat keras dan perangkat lunak terhubung ke kehidupan sehari-hari.</p></div>
          <Link className="text-link" href="/projects">JELAJAHI BIDANG PROYEK <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="projects-grid">
          {projectAreas.map(({ category, title, description, icon: Icon, code }) => (
            <article className="project-card" key={code}>
              <div className="project-card-top"><span className="project-category"><i /> {category}</span><span className="section-code">{code}</span></div>
              <div className="project-visual"><div className="project-orbit" aria-hidden="true" /><Icon aria-hidden="true" /></div>
              <h3>{title}</h3><p>{description}</p>
              <div className="project-card-bottom"><span>FOKUS REKAYASA</span><Link href="/projects" aria-label={`Jelajahi ${title}`}><ArrowUpRight aria-hidden="true" /></Link></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

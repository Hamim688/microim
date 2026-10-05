import Link from "next/link"
import { ArrowUpRight, Bot, House, Radio, SlidersHorizontal } from "lucide-react"

const projectAreas = [
  { category: "IOT / AUTOMATION", title: "Smart Home System", description: "Connected sensors and controls for monitoring and managing home systems.", icon: House, code: "[IOT.01]" },
  { category: "ROBOTICS / CONTROL", title: "Robot Arm & Automation", description: "Embedded control and sensor integration for robotic and automated equipment.", icon: Bot, code: "[RBT.02]" },
  { category: "DEVICE / TELEMETRY", title: "IoT Monitoring Device", description: "A device concept that brings field measurements into a connected monitoring workflow.", icon: Radio, code: "[MON.03]" },
  { category: "EMBEDDED / SYSTEMS", title: "Industrial Controller", description: "Embedded system design for control, measurement, and device communication needs.", icon: SlidersHorizontal, code: "[SYS.04]" },
]

export function ProjectShowcase() {
  return (
    <section className="projects-section" id="projects">
      <div className="site-container">
        <div className="edge-heading projects-heading">
          <div><span className="section-kicker">PRACTICAL ENGINEERING</span><h2>Engineered for Real-World Impact</h2><p>Technology directions that bring connected hardware and software into everyday use.</p></div>
          <Link className="text-link" href="/projects">EXPLORE PROJECT AREAS <ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="projects-grid">
          {projectAreas.map(({ category, title, description, icon: Icon, code }) => (
            <article className="project-card" key={code}>
              <div className="project-card-top"><span className="project-category"><i /> {category}</span><span className="section-code">{code}</span></div>
              <div className="project-visual"><div className="project-orbit" aria-hidden="true" /><Icon aria-hidden="true" /></div>
              <h3>{title}</h3><p>{description}</p>
              <div className="project-card-bottom"><span>ENGINEERING FOCUS</span><Link href="/projects" aria-label={`Explore ${title}`}><ArrowUpRight aria-hidden="true" /></Link></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

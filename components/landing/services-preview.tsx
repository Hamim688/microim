import Link from "next/link"
import { ArrowRight, CircuitBoard, Code2, Smartphone } from "lucide-react"

const services = [
  { code: "HW.IOT.01", icon: CircuitBoard, title: "Hardware & IoT Development", body: "Perancangan prototipe hardware dan sistem IoT, dari pemilihan sensor hingga integrasi perangkat dan konektivitas." },
  { code: "FW.EMB.02", icon: Code2, title: "Embedded Programming", body: "Pengembangan firmware untuk mikrokontroler dan embedded system yang menghubungkan perangkat keras dengan kebutuhan aplikasi." },
  { code: "APP.MOB.03", icon: Smartphone, title: "Mobile Application Development", body: "Pembuatan aplikasi mobile untuk mengendalikan perangkat, membaca data, dan berinteraksi dengan sistem IoT." },
]

export function ServicesPreview() {
  return (
    <section className="services-section" id="services-core">
      <div className="site-container">
        <div className="section-heading centered-heading">
          <span className="section-kicker">CORE CAPABILITIES</span>
          <h2>Our Technology Solutions</h2>
          <p>End-to-end engineering excellence from silicon to cloud.</p>
        </div>
        <div className="services-grid">
          {services.map(({ code, icon: Icon, title, body }) => (
            <article className="service-card" key={code}>
              <div className="service-icon"><Icon aria-hidden="true" /></div>
              <span className="service-code">{code}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="service-card-bottom"><span>ENGINEERING SERVICE</span><Link href="/services" aria-label={`Explore ${title}`}><ArrowRight aria-hidden="true" /></Link></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

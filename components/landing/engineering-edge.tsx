import { AppWindow, CircuitBoard, Cpu, RadioTower } from "lucide-react"

const layers = [
  { icon: CircuitBoard, label: "Perangkat Keras", detail: "Sensor · Sirkuit · Purwarupa" },
  { icon: Cpu, label: "Sistem Tertanam", detail: "Mikrokontroler · Perangkat Lunak Tertanam" },
  { icon: RadioTower, label: "Konektivitas", detail: "Wi-Fi · BLE · Protokol IoT" },
  { icon: AppWindow, label: "Aplikasi", detail: "Seluler · Pemantauan · Kendali" },
]

export function EngineeringEdge() {
  return (
    <section className="edge-section">
      <div className="site-container">
        <div className="edge-heading">
          <div><span className="section-kicker">REKAYASA MENYELURUH</span><h2>Keunggulan Rekayasa MikroIm</h2><p>Perangkat keras dan perangkat lunak dirancang sebagai bagian yang saling terhubung dalam satu sistem teknologi.</p></div>
          <span className="section-code">[SISTEM / INTEGRASI]</span>
        </div>
        <div className="edge-capabilities">
          {layers.map(({ icon: Icon, label, detail }) => <div className="capability-card" key={label}><span className="capability-icon"><Icon aria-hidden="true" /></span><div><h3>{label}</h3><p>{detail}</p></div></div>)}
        </div>
        <div className="architecture-panel">
          <div className="architecture-title"><div><span className="section-kicker">BERPIKIR SECARA SISTEM</span><h3>Alur Rekayasa yang Terhubung</h3></div><span className="section-code">IDE → PENERAPAN</span></div>
          <div className="architecture-flow" aria-label="Alur rekayasa: perangkat keras, sistem tertanam, konektivitas, dan aplikasi">
            {layers.map(({ icon: Icon, label }, index) => <div className="architecture-step" key={label}><span className="architecture-node"><Icon aria-hidden="true" /></span><span>{label}</span>{index < layers.length - 1 && <i className="architecture-connector" aria-hidden="true" />}</div>)}
          </div>
          <p className="architecture-note">Setiap bagian dirancang dengan mempertimbangkan perangkat, penggunanya, dan lingkungan pemakaian.</p>
        </div>
      </div>
    </section>
  )
}

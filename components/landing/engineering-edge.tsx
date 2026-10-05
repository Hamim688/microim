import { AppWindow, CircuitBoard, Cpu, RadioTower } from "lucide-react"

const layers = [
  { icon: CircuitBoard, label: "Hardware", detail: "Sensors · Circuits · Prototypes" },
  { icon: Cpu, label: "Embedded", detail: "Microcontrollers · Firmware" },
  { icon: RadioTower, label: "Connectivity", detail: "Wi-Fi · BLE · IoT protocols" },
  { icon: AppWindow, label: "Applications", detail: "Mobile · Monitoring · Control" },
]

export function EngineeringEdge() {
  return (
    <section className="edge-section">
      <div className="site-container">
        <div className="edge-heading">
          <div><span className="section-kicker">ENGINEERING FROM END TO END</span><h2>Why MikroIm Engineering Edge</h2><p>Hardware and software are designed as connected parts of one technology system.</p></div>
          <span className="section-code">[SYSTEMS / INTEGRATION]</span>
        </div>
        <div className="edge-capabilities">
          {layers.map(({ icon: Icon, label, detail }) => <div className="capability-card" key={label}><span className="capability-icon"><Icon aria-hidden="true" /></span><div><h3>{label}</h3><p>{detail}</p></div></div>)}
        </div>
        <div className="architecture-panel">
          <div className="architecture-title"><div><span className="section-kicker">SYSTEMS THINKING</span><h3>One Connected Engineering Workflow</h3></div><span className="section-code">IDEA → IMPLEMENTATION</span></div>
          <div className="architecture-flow" aria-label="Engineering workflow: hardware, embedded systems, connectivity, and applications">
            {layers.map(({ icon: Icon, label }, index) => <div className="architecture-step" key={label}><span className="architecture-node"><Icon aria-hidden="true" /></span><span>{label}</span>{index < layers.length - 1 && <i className="architecture-connector" aria-hidden="true" />}</div>)}
          </div>
          <p className="architecture-note">Each layer is considered in relation to the device, its users, and the environment where it will be used.</p>
        </div>
      </div>
    </section>
  )
}

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Cpu, ShoppingBag, Search, Filter } from "lucide-react"

const categories = [
  "Semua",
  "Microcontrollers",
  "Sensors",
  "Actuators",
  "Motors",
  "Connectivity",
  "Accessories",
  "Kits",
]

const sampleProducts = [
  { name: "ESP32 Development Board NodeMCU 38-Pin", cat: "Microcontrollers", price: "Rp 68.000", stock: 45 },
  { name: "ESP8266 NodeMCU V3 Lolin", cat: "Microcontrollers", price: "Rp 42.000", stock: 30 },
  { name: "HC-SR04 Ultrasonic Distance Sensor", cat: "Sensors", price: "Rp 16.500", stock: 120 },
  { name: "HC-SR501 PIR Motion Sensor", cat: "Sensors", price: "Rp 19.500", stock: 80 },
  { name: "SG90 Micro Servo Motor 9g", cat: "Actuators", price: "Rp 18.000", stock: 65 },
  { name: "DC Gear Motor with Wheel 3-6V", cat: "Motors", price: "Rp 22.000", stock: 50 },
  { name: "1 Channel 5V Relay Module Optocoupler", cat: "Accessories", price: "Rp 12.000", stock: 95 },
  { name: "Jumper Wire Breadboard 20cm (Male-Female)", cat: "Accessories", price: "Rp 14.000", stock: 200 },
]

export default function ProductsPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#FFC928] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="space-y-4 max-w-3xl mb-12">
        <Badge variant="gold">Katalog Komponen IoT</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Komponen Elektronika &amp; Mikrokontroler
        </h1>
        <p className="text-lg text-slate-300">
          Modul hardware berkualitas tinggi yang diuji langsung di laboratorium MikroIm.
        </p>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#173359]">
        {categories.map((c, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              i === 0
                ? "bg-[#FFC928] text-[#071426] font-semibold"
                : "bg-[#0c213d] text-slate-300 hover:bg-[#132b4d] border border-[#173359]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProducts.map((p, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#0c213d] border border-[#173359] p-5 flex flex-col justify-between hover:border-[#FFC928]/50 transition-all group"
          >
            <div>
              <div className="h-36 rounded-xl bg-[#071426] border border-[#173359] flex items-center justify-center p-4 mb-4">
                <Cpu className="w-10 h-10 text-[#FFC928] group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">{p.cat}</span>
              <h3 className="font-semibold text-white text-sm mt-1 mb-2 line-clamp-2">{p.name}</h3>
            </div>
            <div className="pt-4 border-t border-[#173359] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Stok: {p.stock}</span>
                <span className="text-sm font-bold text-[#FFC928]">{p.price}</span>
              </div>
              <Button size="sm" variant="outline">
                <ShoppingBag className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

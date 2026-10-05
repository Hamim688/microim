import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { LandingMotion, PageEntrance, ScrollReveal } from "@/components/landing/landing-motion"

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
  { name: "ESP32 Development Board NodeMCU 38-Pin", cat: "Microcontrollers", price: "Rp 68.000", stock: 45, image: "/images/product-esp32.jpg" },
  { name: "ESP8266 NodeMCU V3 Lolin", cat: "Microcontrollers", price: "Rp 42.000", stock: 30, image: "/images/product-esp8266.webp" },
  { name: "HC-SR04 Ultrasonic Distance Sensor", cat: "Sensors", price: "Rp 16.500", stock: 120, image: "/images/product-ultrasonic.jpg" },
  { name: "HC-SR501 PIR Motion Sensor", cat: "Sensors", price: "Rp 19.500", stock: 80, image: "/images/product-pir.webp" },
  { name: "SG90 Micro Servo Motor 9g", cat: "Actuators", price: "Rp 18.000", stock: 65, image: "/images/product-sg90.jpg" },
  { name: "DC Gear Motor with Wheel 3-6V", cat: "Motors", price: "Rp 22.000", stock: 50, image: "/images/product-gear-motor.webp" },
  { name: "1 Channel 5V Relay Module Optocoupler", cat: "Accessories", price: "Rp 12.000", stock: 95, image: "/images/product-relay.webp" },
  { name: "Jumper Wire Breadboard 20cm (Male-Female)", cat: "Accessories", price: "Rp 14.000", stock: 200, image: "/images/product-jumper-wires.webp" },
]

export default function ProductsPage() {
  return (
    <LandingMotion>
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageEntrance>
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
        </PageEntrance>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((p, idx) => (
            <ScrollReveal key={p.name} delay={idx * 0.055}>
              <article className="product-catalog-card rounded-2xl bg-[#0c213d] border border-[#173359] p-5 flex h-full flex-col justify-between hover:border-[#FFC928]/50 transition-all group">
                <div>
                  <div className="product-catalog-image relative h-44 rounded-xl bg-[#071426] border border-[#173359] overflow-hidden mb-4">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#94A3B8]">{p.cat}</span>
                  <h3 className="font-semibold text-white text-sm mt-1 mb-2 line-clamp-2">{p.name}</h3>
                </div>
                <div className="pt-4 border-t border-[#173359] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Stok: {p.stock}</span>
                    <span className="text-sm font-bold text-[#FFC928]">{p.price}</span>
                  </div>
                  <Link href="/contact" aria-label={`Pesan ${p.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#FFC928]/60 text-[#FFC928] transition-colors hover:bg-[#FFC928]/10">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </LandingMotion>
  )
}

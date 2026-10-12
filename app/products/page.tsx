import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LandingMotion, PageEntrance } from "@/components/landing/landing-motion"
import { ProductCatalog, type CatalogProduct } from "@/components/products/product-catalog"

const sampleProducts: CatalogProduct[] = [
  { name: "Papan Pengembangan ESP32 NodeMCU 38 Pin", cat: "Mikrokontroler", price: "Rp 100.000", stock: 45, image: "/images/product-esp32.jpg" },
  { name: "ESP8266 NodeMCU V3 Lolin", cat: "Mikrokontroler", price: "Rp 42.000", stock: 30, image: "/images/product-esp8266.webp" },
  { name: "Sensor Jarak Ultrasonik HC-SR04", cat: "Sensor", price: "Rp 16.500", stock: 120, image: "/images/product-ultrasonic.jpg" },
  { name: "Sensor Gerak PIR HC-SR501", cat: "Sensor", price: "Rp 19.500", stock: 80, image: "/images/product-pir.webp" },
  { name: "Motor Servo Mikro SG90 9 g", cat: "Aktuator", price: "Rp 25.000", stock: 65, image: "/images/product-sg90.jpg" },
  { name: "Motor DC Gearbox dengan Roda 3–6 V", cat: "Motor", price: "Rp 25.000", stock: 50, image: "/images/product-gear-motor.webp" },
  { name: "Modul Relai 1 Kanal 5 V Optokopler", cat: "Aksesori", price: "Rp 12.000", stock: 95, image: "/images/product-relay.webp" },
  { name: "Kabel Jumper Papan Percobaan 20 cm (Jantan-Betina)", cat: "Aksesori", price: "Rp 12.000", stock: 200, image: "/images/product-jumper-wires.webp" },
]

export default function ProductsPage() {
  return (
    <LandingMotion>
      <div className="py-12 sm:py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageEntrance>
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#FFC928] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="space-y-4 max-w-3xl mb-8 sm:mb-12">
            <Badge variant="gold">Katalog Komponen IoT</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white tracking-[-0.035em]">
              Komponen Elektronika &amp; Mikrokontroler
            </h1>
            <p className="text-lg text-slate-300">
              Modul perangkat keras berkualitas yang diuji langsung di laboratorium MikroIm.
            </p>
          </div>

          <ProductCatalog products={sampleProducts} />
        </PageEntrance>
      </div>
    </LandingMotion>
  )
}

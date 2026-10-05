import React from "react"
import Link from "next/link"
import { Cpu, ArrowRight, ShoppingBag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    name: "ESP32 Dev Board NodeMCU 38-Pin",
    category: "Microcontroller",
    price: "Rp 68.000",
    specs: "Dual-Core 240MHz, 4MB Flash, WiFi + Bluetooth BLE",
    status: "Ready Stock",
  },
  {
    name: "HC-SR04 Ultrasonic Distance Sensor",
    category: "Sensors",
    price: "Rp 16.500",
    specs: "Range 2cm - 400cm, Akurasi 3mm, 5V DC Operation",
    status: "Ready Stock",
  },
  {
    name: "SG90 Micro Servo 9g 180 Degree",
    category: "Actuators",
    price: "Rp 18.000",
    specs: "Torsi 1.8 kg/cm, Operating Speed 0.1s/60 deg, PWM",
    status: "Ready Stock",
  },
  {
    name: "1-Channel 5V Relay Module Optocoupler",
    category: "Power & Modules",
    price: "Rp 12.000",
    specs: "AC 250V 10A / DC 30V 10A, Isolasi Optocoupler Aktif Rendah",
    status: "Ready Stock",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-[#061120] border-t border-[#173359] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="gold">Katalog Komponen</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Komponen IoT &amp; Hardware Teruji
            </h2>
            <p className="text-slate-300 text-base">
              Koleksi komponen elektronik, mikrokontroler, modul sensor, dan aktuator yang telah dikurasi dan divalidasi kualitasnya oleh teknisi MikroIm.
            </p>
          </div>
          <Link href="/products">
            <Button variant="secondary" className="flex items-center gap-2">
              Buka Katalog Lengkap
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#0c213d]/90 border border-[#173359] p-5 flex flex-col justify-between hover:border-[#FFC928]/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                {/* Visual Icon / Circuit Illustration */}
                <div className="h-40 rounded-xl bg-[#071426] border border-[#173359] flex items-center justify-center p-6 relative overflow-hidden mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#0c213d] border border-[#1b3b65] flex items-center justify-center text-[#FFC928] group-hover:scale-110 transition-transform">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <span className="absolute top-3 left-3 text-[10px] font-mono text-[#94A3B8] bg-[#0c213d] px-2 py-0.5 rounded border border-[#173359]">
                    {item.category}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.status}
                  </span>
                </div>

                <h3 className="font-semibold text-white text-base leading-snug group-hover:text-[#FFC928] transition-colors mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {item.specs}
                </p>
              </div>

              <div className="pt-4 border-t border-[#173359] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Harga</span>
                  <span className="text-base font-bold text-[#FFC928]">{item.price}</span>
                </div>
                <Link href="/products">
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Beli
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

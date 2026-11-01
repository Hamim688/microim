import type { CatalogProduct } from "@/components/products/product-catalog"

// Satu sumber data produk: dipakai halaman Produk dan pita berjalan di Beranda.
// Tambah/ubah produk cukup di sini.
export const products: CatalogProduct[] = [
  { name: "Servo SG90", cat: "Servo", price: "Rp 25.000", stock: 65, image: "/images/product-sg90.jpg" },
  { name: "ESP32 Dev Module", cat: "Mikrokontroler", price: "Rp 100.000", stock: 45, image: "/images/product-esp32.jpg" },
  { name: "Motor DC Gearbox TT", cat: "Aktuator", price: "Rp 25.000", stock: 50, image: "/images/product-gear-motor.jpg" },
  { name: "Kabel Jumper 20cm", cat: "Aksesoris", price: "Rp 12.000", stock: 150, image: "/images/product-jumper-wires.jpg" },
  { name: "Battery Holder", cat: "Catu Daya", price: "Rp 9.000", stock: 40, image: "/images/product-battery-holder.jpg" },
  { name: "Battery AAA", cat: "Catu Daya", price: "Rp 2.000", stock: 200, image: "/images/product-battery-aaa.jpg" },
  { name: "Converter Adaptor", cat: "Catu Daya", price: "Rp 5.000", stock: 80, image: "/images/product-converter-adaptor.jpg" },
  { name: "Adaptor 12v 2Amper", cat: "Catu Daya", price: "Rp 35.000", stock: 35, image: "/images/product-adapter-12v.jpg" },
  { name: "Stick", cat: "Aksesoris", price: "Rp 4.000", stock: 120, image: "/images/product-stick.jpg" },
  { name: "Baut Komponen 1inch", cat: "Mekanik", price: "Rp 200", stock: 500, image: "/images/product-screws.jpg" },
  { name: "Baut Komponen 1,5inch", cat: "Mekanik", price: "Rp 200", stock: 500, image: "/images/product-screws.jpg" },
  { name: "Hardware dan Software", cat: "Jasa", price: "Rp 100.000", stock: 99, image: "/images/product-service-iot.jpg" },
  { name: "Mobil Kit", cat: "Kit", price: "Rp 65.000", stock: 25, image: "/images/product-robot-car-kit.jpg" },
  { name: "Driver Motor", cat: "Modul", price: "Rp 30.000", stock: 40, image: "/images/product-motor-driver.jpg" },
  { name: "Sensor garis", cat: "Sensor", price: "Rp 15.000", stock: 60, image: "/images/product-line-sensor.jpg" },
  { name: "Bracket HCSR", cat: "Mekanik", price: "Rp 6.000", stock: 85, image: "/images/product-bracket-hcsr.jpg" },
  { name: "Sensor SRF04", cat: "Sensor", price: "Rp 20.000", stock: 75, image: "/images/product-ultrasonic.jpg" },
  { name: "Battery Rechargeable", cat: "Catu Daya", price: "Rp 18.000", stock: 50, image: "/images/product-battery-rechargeable.jpg" },
]

/** Nama produk untuk pita berjalan: tanpa kategori Jasa, varian dengan foto sama cukup sekali. */
export function marqueeProductNames(): string[] {
  const seenImages = new Set<string>()
  return products
    .filter((product) => product.cat !== "Jasa")
    .filter((product) => {
      if (seenImages.has(product.image)) return false
      seenImages.add(product.image)
      return true
    })
    .map((product) => product.name)
}

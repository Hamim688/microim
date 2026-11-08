// Impor riwayat transaksi dari spreadsheet lama Microim.
// Baris dengan TANGGAL + NAMA PEMBELI yang sama digabung jadi satu transaksi berisi banyak item.
// Stok TIDAK dikurangi lagi: penjualan ini sudah dihitung saat `npm run db:import` (stok terjual dari spreadsheet).
// Pakai: npm run db:import-transaksi        (sekali saja)
//        npm run db:import-transaksi -- --ulang   (hapus hasil impor sebelumnya lalu impor lagi)
import "./env.mjs"
import pkg from "@prisma/client"

const { PrismaClient } = pkg
const db = new PrismaClient()
const MARK = "Impor dari spreadsheet"

// [tanggal (YYYY-MM-DD), pembeli, item, jumlah, harga satuan, jasa?]
const ROWS = [
  ["2026-09-30", "Abyan", "Servo SG90", 4, 25000],
  ["2026-09-30", "Ale", "Servo SG90", 4, 25000],
  ["2026-09-30", "Cezar", "Servo SG90", 4, 25000],
  ["2026-09-30", "Dimas Adhie", "Servo SG90", 4, 25000],
  ["2026-09-30", "Dimaz", "Servo SG90", 4, 25000],
  ["2026-10-02", "Akbar", "Motor DC Gearbox TT", 1, 15000],
  ["2026-10-02", "Akbar", "Servo SG90", 1, 25000],
  ["2026-10-05", "Bintang", "Servo SG90", 3, 25000],
  ["2026-10-05", "Devi", "Adaptor 12v 2Amper", 1, 35000],
  ["2026-10-05", "Diah", "Battery AAA", 5, 2000],
  ["2026-10-05", "Diah", "Battery Holder 4 slot", 1, 9000],
  ["2026-10-05", "Nabila", "Converter Adaptor", 1, 5000],
  ["2026-10-05", "Roihan", "Adaptor 12v 2Amper", 1, 35000],
  ["2026-10-22", "Dimas Adhie", "Hardware dan Software", 1, 100000, true],
  ["2026-10-26", "Dimas Adhie", "Mobil Kit", 1, 65000],
  ["2026-10-26", "Dimas Adhie", "Battery AAA", 4, 2000],
  ["2026-10-26", "Dimas Adhie", "Driver Motor l298n", 1, 30000],
  ["2026-10-26", "Dimas Adhie", "Servo SG90", 1, 25000],
  ["2026-10-26", "Dimas Adhie", "Sensor garis", 2, 15000],
  ["2026-10-26", "Dimas Adhie", "ESP32 Dev Module", 1, 100000],
  ["2026-10-26", "Dimas Adhie", "Kabel Jumper 20cm", 1, 12000],
  ["2026-10-26", "Dimas Adhie", "Sensor SRF04", 1, 20000],
  ["2026-10-26", "Dimas Adhie", "Battery Holder 4 slot", 1, 9000],
  ["2026-10-26", "Feby", "Mobil Kit", 1, 65000],
  ["2026-10-26", "Ica", "Sensor garis", 2, 15000],
  ["2026-10-26", "Ica", "Bracket HCSR", 1, 6000],
  ["2026-10-26", "Izza", "Mobil Kit", 1, 65000],
  ["2026-10-26", "Izza", "Battery AAA", 4, 2000],
  ["2026-10-26", "Izza", "Sensor garis", 2, 15000],
  ["2026-10-26", "Roihan", "Mobil Kit", 1, 65000],
  ["2026-10-26", "Roihan", "Sensor SRF04", 1, 20000],
  ["2026-10-26", "Roihan", "Sensor garis", 2, 15000],
  ["2026-10-26", "Roihan", "Driver Motor l298n", 1, 30000],
  ["2026-10-26", "Roihan", "Servo SG90", 1, 25000],
  ["2026-10-26", "Roihan", "Kabel Jumper 20cm", 1, 12000],
  ["2026-10-26", "Roihan", "Kabel Jumper 20cm", 1, 12000],
  ["2026-10-30", "Jonatan", "Battery AAA", 4, 2000],
  ["2026-10-30", "Jonatan", "Driver Motor l298n", 1, 30000],
  ["2026-11-01", "Dimas Adhie", "Battery Rechargeable", 3, 18000],
  ["2026-11-01", "Dimas Adhie", "Hardware dan Software", 1, 50000, true],
  ["2026-11-01", "Dimas Adhie", "Holder Battery Rechargeable 1 slot", 1, 7000],
  ["2026-11-01", "Dimas Adhie", "Holder Battery Rechargeable 2 slot", 1, 8000],
]

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

const existing = await db.order.count({ where: { note: MARK } })
if (existing && !process.argv.includes("--ulang")) {
  console.log(`Sudah ada ${existing} transaksi hasil impor. Jalankan dengan "-- --ulang" kalau mau mengimpor ulang.`)
  await db.$disconnect()
  process.exit(0)
}
if (existing) {
  // Hapus hasil impor lama TANPA mengubah stok (stok memang tidak pernah dikurangi oleh impor ini).
  await db.order.deleteMany({ where: { note: MARK } })
  console.log(`${existing} transaksi impor lama dihapus.`)
}

const products = await db.product.findMany({ select: { id: true, name: true, costPrice: true } })
const findProduct = (name) => {
  const n = norm(name)
  return products.find((p) => norm(p.name) === n) ?? products.find((p) => n.startsWith(norm(p.name)) || norm(p.name).startsWith(n))
}

// Kelompokkan per tanggal + pembeli.
const groups = new Map()
for (const [date, buyer, item, qty, price, service] of ROWS) {
  const key = `${date}|${buyer}`
  if (!groups.has(key)) groups.set(key, { date, buyer, items: new Map() })
  const g = groups.get(key)
  const itemKey = `${service ? "S" : "C"}|${norm(item)}|${price}`
  const prev = g.items.get(itemKey)
  if (prev) prev.qty += qty
  else g.items.set(itemKey, { item, qty, price, service: Boolean(service) })
}

const missing = new Set()
let created = 0
let itemsCount = 0
for (const g of groups.values()) {
  // Jam 12.00 WIB agar tanggal tidak bergeser karena zona waktu.
  const createdAt = new Date(`${g.date}T12:00:00+07:00`)
  const prefix = `MCR-${g.date.slice(2).replaceAll("-", "")}-`
  const last = await db.order.findFirst({ where: { orderNumber: { startsWith: prefix } }, orderBy: { orderNumber: "desc" }, select: { orderNumber: true } })
  const seq = last ? Number(last.orderNumber.slice(prefix.length)) + 1 : 1

  const items = []
  for (const it of g.items.values()) {
    if (it.service) {
      items.push({ itemType: "SERVICE", name: it.item, quantity: it.qty, price: it.price, costPrice: 0 })
      continue
    }
    const p = findProduct(it.item)
    if (!p) {
      missing.add(it.item)
      continue
    }
    items.push({ itemType: "COMPONENT", productId: p.id, quantity: it.qty, price: it.price, costPrice: p.costPrice })
  }
  if (!items.length) continue
  await db.order.create({
    data: {
      orderNumber: `${prefix}${String(seq).padStart(3, "0")}`,
      customerName: g.buyer,
      status: "PAID",
      paymentMethod: "CASH",
      note: MARK,
      totalAmount: items.reduce((s, i) => s + i.quantity * i.price, 0),
      createdAt,
      items: { create: items },
    },
  })
  created++
  itemsCount += items.length
}

console.log(`\nImpor transaksi selesai: ${created} transaksi (${itemsCount} item) dari ${ROWS.length} baris spreadsheet.`)
if (missing.size) console.log("  Produk tidak ditemukan (dilewati):", [...missing].join(", "))
await db.$disconnect()

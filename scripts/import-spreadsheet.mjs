// Impor data stok dari spreadsheet lama Microim (modal, harga jual, stok masuk, terjual).
// Aman dijalankan ulang: riwayat stok produk yang BELUM punya transaksi di admin akan disusun ulang dari data ini.
// Pakai: npm run db:import
import "./env.mjs"
import pkg from "@prisma/client"

const { PrismaClient } = pkg
const db = new PrismaClient()

// [nama di spreadsheet, kategori, modal, harga jual, stok masuk, terjual, nama lama di database (bila beda)]
const ROWS = [
  ["Adaptor 12v 2Amper", "Catu Daya", 30000, 35000, 2, 2],
  ["Battery AAA", "Catu Daya", 1500, 2000, 13, 17],
  ["Battery Holder 4 slot", "Catu Daya", 6000, 9000, 1, 2, "Battery Holder"],
  ["Battery Rechargeable", "Catu Daya", 15000, 18000, 4, 3],
  ["Baut Komponen 1,5inch", "Mekanik", 100, 200, 20, 0],
  ["Baut Komponen 1inch", "Mekanik", 100, 200, 20, 0],
  ["Bracket HCSR", "Mekanik", 5000, 6000, 1, 1],
  ["Converter Adaptor", "Catu Daya", 3000, 5000, 1, 1],
  ["Driver Motor l298n", "Modul", 28000, 30000, 2, 3, "Driver Motor"],
  ["ESP32 Dev Module", "Mikrokontroler", 85000, 100000, 1, 1],
  ["Kabel Jumper 20cm", "Aksesoris", 8000, 12000, 2, 3],
  ["Mobil Kit", "Kit", 55000, 65000, 4, 4],
  ["Motor DC Gearbox TT", "Aktuator", 12000, 15000, 1, 1],
  ["Sensor garis", "Sensor", 13000, 15000, 8, 8],
  ["Sensor SRF04", "Sensor", 15000, 20000, 2, 2],
  ["Servo SG90", "Servo", 22000, 25000, 26, 26],
  ["Stick", "Aksesoris", 2500, 4000, 1, 0],
  ["Holder Battery Rechargeable 1 slot", "Catu Daya", 5000, 7000, 2, 1],
  ["Holder Battery Rechargeable 2 slot", "Catu Daya", 6000, 8000, 2, 1],
]

const slugify = (text) =>
  text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "produk"

const report = { dibuat: [], diperbarui: [], dilewati: [], minus: [] }

for (const [name, cat, modal, jual, masuk, terjual, oldName] of ROWS) {
  const catSlug = slugify(cat)
  const category = await db.category.upsert({ where: { slug: catSlug }, update: {}, create: { name: cat, slug: catSlug } })

  let product =
    (await db.product.findUnique({ where: { slug: slugify(name) } })) ??
    (oldName ? await db.product.findUnique({ where: { slug: slugify(oldName) } }) : null)

  const sisa = masuk - terjual
  const stock = Math.max(sisa, 0)

  if (!product) {
    product = await db.product.create({
      data: { name, slug: slugify(name), description: "", price: jual, costPrice: modal, stock: 0, categoryId: category.id },
    })
    report.dibuat.push(name)
  } else {
    const sold = await db.orderItem.count({ where: { productId: product.id } })
    if (sold > 0) {
      await db.product.update({ where: { id: product.id }, data: { name, price: jual, costPrice: modal, categoryId: category.id } })
      report.dilewati.push(`${name} (sudah ada ${sold} transaksi di admin: hanya modal & harga yang diperbarui, stok tidak diubah)`)
      continue
    }
    report.diperbarui.push(name)
  }

  await db.$transaction(async (tx) => {
    await tx.stockMovement.deleteMany({ where: { productId: product.id } })
    await tx.product.update({ where: { id: product.id }, data: { name, price: jual, costPrice: modal, stock, categoryId: category.id } })
    let running = 0
    if (masuk > 0) {
      running += masuk
      await tx.stockMovement.create({ data: { productId: product.id, type: "INITIAL", change: masuk, stockAfter: running, note: "Impor spreadsheet: stok masuk" } })
    }
    if (terjual > 0) {
      running -= terjual
      await tx.stockMovement.create({ data: { productId: product.id, type: "SALE", change: -terjual, stockAfter: running, note: "Impor spreadsheet: terjual sebelum pakai admin" } })
    }
    if (running < 0) {
      await tx.stockMovement.create({
        data: { productId: product.id, type: "ADJUSTMENT", change: -running, stockAfter: 0, note: `Koreksi impor: di spreadsheet stok sisa ${running} (terjual lebih banyak dari stok masuk)` },
      })
      report.minus.push(`${name} (${running} → 0)`)
    }
  })
}

console.log(`\nImpor selesai: ${report.dibuat.length} produk baru, ${report.diperbarui.length} diperbarui.`)
if (report.dibuat.length) console.log("  Baru:", report.dibuat.join(", "))
if (report.minus.length) console.log("  Stok minus dijadikan 0, cek ulang:", report.minus.join("; "))
if (report.dilewati.length) console.log("  Perhatian:\n   - " + report.dilewati.join("\n   - "))
await db.$disconnect()

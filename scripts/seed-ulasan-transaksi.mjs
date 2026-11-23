// Ulasan dari transaksi yang sudah ada: satu ulasan per transaksi, memakai nama pembeli & barangnya.
// Status PENDING — konfirmasi dulu ke pelanggan sebelum ditampilkan (setujui di /admin/ulasan).
// Pakai: node scripts/seed-ulasan-transaksi.mjs            (lewati bila sudah pernah)
//        node scripts/seed-ulasan-transaksi.mjs --ulang    (hapus ulasan source "transaksi" lalu buat lagi)
import "./env.mjs"
import pkg from "@prisma/client"

const db = new pkg.PrismaClient()
const SOURCE = "transaksi"

// orderNumber → [rating, isi ulasan]
const REVIEWS = {
  "MCR-260930-001": [5, "Malem-malem chat butuh 4 servo buat praktikum, eh langsung dibales. Besoknya udah COD di kampus, servonya jalan semua 👍"],
  "MCR-260930-002": [5, "Lebih murah dari olshop, gak pake nunggu ongkir pula. Pas ambil dicekin satu-satu dulu, mantap"],
  "MCR-260930-003": [4, "Servonya oke, adminnya fast respon. Sempet nunggu bentar pas COD sih, tapi dikabarin dulu jadi santai aja"],
  "MCR-260930-004": [5, "Langsung ambil 4 servo, barang ready dan hari itu juga bisa diambil. Gercep bgt"],
  "MCR-260930-005": [5, "Enak banget gak usah keluar kampus nyari servo. Dites di tempat, muter semua wkwk"],
  "MCR-261002-001": [5, "Beli motor DC sama servo, sekalian dikasih tau tegangan yg pas buat motornya. Helpful parah"],
  "MCR-261005-001": [5, "Servonya awet dipake praktikum berkali-kali, gak ada yg macet. Next beli di sini lagi"],
  "MCR-261005-002": [5, "Tadinya bingung adaptor mana yg cocok, terus dijelasin soal volt sama ampere-nya. Jadi gak salah beli deh"],
  "MCR-261005-003": [5, "Butuh baterai sama holder buat mobil-mobilan tugas, tinggal chat terus ambil di kampus. Praktis!"],
  "MCR-261005-004": [4, "Converter-nya pas dan jalan normal. Semoga ke depan pilihan ukurannya makin banyak ya"],
  "MCR-261005-005": [5, "Adaptor 12V-nya stabil buat rangkaianku. Fast respon, COD-nya juga gampang"],
  "MCR-261022-001": [5, "Robot arm + web 3D-nya jadi persis kayak yg aku mau, terus dijelasin cara kerjanya sampe paham. Presentasi jadi pede 🔥"],
  "MCR-261026-001": [5, "Hampir semua komponen smart car aku ambil di sini, dari ESP32 sampe sensor. Bisa nanya-nanya dulu cocok enggaknya, enak bgt"],
  "MCR-261026-002": [4, "Mobil kitnya rapi, lengkap juga. Kalo bisa ada panduan rakitnya biar makin gampang hehe"],
  "MCR-261026-003": [5, "Sensor garis sama bracket-nya pas, dikasih tau pinout-nya juga jadi wiring gak pusing"],
  "MCR-261026-004": [5, "Akhirnya line follower-ku jalan juga 😭 Mobil kit, baterai, sensor garis, semua dapet di satu tempat"],
  "MCR-261026-005": [5, "Borong buat robot: L298N, SRF04, servo, sampe kabel jumper. Kepake semua, gak ada yg zonk"],
  "MCR-261030-001": [5, "L298N-nya langsung jalan pas dipasang. Harganya ramah kantong mahasiswa"],
  "MCR-261101-001": [5, "Conveyor-nya dirakitin sampe jalan, sekalian baterai cas sama holdernya. Cepet dan rapi kerjanya"],
  "MCR-261109-001": [5, "Pesan dispenser obat IoT, tiap progres selalu dikabarin. Alatnya juga jadi tepat waktu, makasih Microim!"],
}

const existing = await db.review.count({ where: { source: SOURCE } })
if (existing && !process.argv.includes("--ulang")) {
  console.log(`Sudah ada ${existing} ulasan dari transaksi. Pakai --ulang untuk membuat ulang.`)
  process.exit(0)
}
if (existing) await db.review.deleteMany({ where: { source: SOURCE } })

const orders = await db.order.findMany({
  where: { status: { not: "CANCELLED" } },
  include: { items: { include: { product: { select: { name: true } } } } },
  orderBy: { createdAt: "asc" },
})

const data = []
for (const o of orders) {
  const r = REVIEWS[o.orderNumber]
  if (!r) { console.log(`Lewati ${o.orderNumber} (${o.customerName}): belum ada teks ulasan.`); continue }
  const names = o.items.map((i) => i.product?.name ?? i.name ?? "Jasa")
  const item = (names.length > 3 ? `${names.slice(0, 3).join(", ")}, dll.` : names.join(", ")).slice(0, 80)
  const createdAt = new Date(o.createdAt.getTime() + 24 * 60 * 60 * 1000) // sehari setelah transaksi
  data.push({ name: o.customerName, rating: r[0], item, comment: r[1], status: "PENDING", source: SOURCE, createdAt })
}
await db.review.createMany({ data })
console.log(`${data.length} ulasan dibuat (PENDING).`)
await db.$disconnect()

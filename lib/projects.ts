// Contoh proyek yang bisa dirakit dari komponen yang tersedia di katalog Microim.
// Dipakai section Proyek di Beranda dan halaman /projects, supaya isinya selalu sama.
export type ExampleProject = {
  slug: "smart-car" | "line-follower" | "iot-monitor"
  title: string
  category: string
  desc: string
  tech: string[]
}

export const exampleProjects: ExampleProject[] = [
  {
    slug: "smart-car",
    title: "Smart Car 2WD Radar Scanner",
    category: "Robotika",
    desc: "Mobil robot yang memindai sekitarnya hingga 180° dengan sensor ultrasonik di atas servo, lalu menghindari rintangan secara otomatis.",
    tech: ["ESP32", "Servo SG90", "Sensor SRF04", "Driver L298N"],
  },
  {
    slug: "line-follower",
    title: "Robot Line Follower",
    category: "Robotika",
    desc: "Robot pengikut garis untuk praktikum dan lomba: membaca lintasan dengan sensor garis dan mengatur kecepatan dua motor DC.",
    tech: ["Arduino / ESP32", "Sensor Garis", "Motor DC Gearbox TT", "Driver L298N"],
  },
  {
    slug: "iot-monitor",
    title: "Pemantau Ruangan Berbasis IoT",
    category: "IoT",
    desc: "Perangkat pembaca suhu, kelembapan, atau jarak yang mengirim data lewat WiFi ke dashboard di HP, cocok untuk tugas mata kuliah IoT.",
    tech: ["ESP32", "Sensor", "WiFi", "Dashboard IoT"],
  },
]

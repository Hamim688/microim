// Ide proyek robotika dan IoT beserta komponen utamanya. Dipakai halaman /projects (semua) dan section Proyek di
// Beranda (tiga pertama, yang punya gambar teknik). Ini daftar ide, bukan portofolio: sebagian komponen belum tentu
// ada di katalog Microim.
export type ProjectCategory = "Robotika" | "IoT"
export type ProjectLevel = "Pemula" | "Menengah" | "Lanjut"

export type ProjectIdea = {
  slug: string
  title: string
  category: ProjectCategory
  level: ProjectLevel
  desc: string
  /** Komponen yang dibutuhkan, termasuk pendukung (sasis, baterai, kabel). Alat kerja seperti solder tidak dicantumkan. */
  parts: string[]
}

/** Tiga proyek unggulan Beranda: slug-nya punya gambar teknik di project-drawings.tsx. */
/** `tech`: empat komponen utama, versi ringkas untuk baris di Beranda. */
export type ExampleProject = ProjectIdea & { slug: "smart-car" | "line-follower" | "iot-monitor"; tech: string[] }

export const exampleProjects: ExampleProject[] = [
  {
    slug: "smart-car",
    title: "Smart Car 2WD Radar Scanner",
    category: "Robotika",
    level: "Menengah",
    desc: "Mobil robot yang memindai sekitarnya hingga 180° dengan sensor ultrasonik di atas servo, lalu menghindari rintangan secara otomatis.",
    tech: ["ESP32", "Servo SG90", "Sensor SRF04", "Driver L298N"],
    parts: ["ESP32", "Servo SG90", "Sensor SRF04", "Bracket sensor ultrasonik", "Driver L298N", "Sasis 2WD + 2 motor DC gearbox", "Roda bebas (caster)", "Battery holder + baterai", "Kabel jumper"],
  },
  {
    slug: "line-follower",
    title: "Robot Line Follower",
    category: "Robotika",
    level: "Pemula",
    desc: "Robot pengikut garis untuk praktikum dan lomba: membaca lintasan dengan sensor garis dan mengatur kecepatan dua motor DC.",
    tech: ["Arduino / ESP32", "Sensor Garis", "Motor DC Gearbox TT", "Driver L298N"],
    parts: ["Arduino / ESP32", "Sensor Garis", "Driver L298N", "2× Motor DC Gearbox TT", "Sasis 2WD + roda bebas", "Battery holder + baterai", "Kabel jumper", "Baut dan spacer"],
  },
  {
    slug: "iot-monitor",
    title: "Pemantau Ruangan Berbasis IoT",
    category: "IoT",
    level: "Pemula",
    desc: "Perangkat pembaca suhu, kelembapan, atau jarak yang mengirim data lewat WiFi ke dashboard di HP, cocok untuk tugas mata kuliah IoT.",
    tech: ["ESP32", "Sensor", "WiFi", "Dashboard IoT"],
    parts: ["ESP32", "Sensor DHT22 (suhu dan kelembapan)", "Sensor Ultrasonik HC-SR04 (opsional, jarak)", "Breadboard", "Kabel jumper", "Kabel USB / adaptor 5V", "Dashboard IoT"],
  },
]

const moreIdeas: ProjectIdea[] = [
  // --- Robotika ---
  {
    slug: "mobil-rc-bluetooth",
    title: "Mobil RC Kendali Bluetooth",
    category: "Robotika",
    level: "Pemula",
    desc: "Mobil robot yang dikendalikan dari HP lewat Bluetooth: maju, mundur, belok, dan atur kecepatan dari aplikasi.",
    parts: ["Arduino Uno", "Modul Bluetooth HC-05", "Driver L298N", "Motor DC Gearbox TT", "Sasis 2WD", "Battery holder + baterai 18650", "Kabel jumper", "Aplikasi kendali Bluetooth di HP"],
  },
  {
    slug: "lengan-robot-4dof",
    title: "Lengan Robot 4 DOF",
    category: "Robotika",
    level: "Menengah",
    desc: "Lengan robot empat sendi dengan penjepit, digerakkan lewat joystick atau urutan gerak yang direkam untuk memindahkan benda.",
    parts: ["Arduino Uno", "4× Servo SG90 / MG90S", "Driver Servo PCA9685", "Modul Joystick", "Adaptor 5V 3A", "Rangka lengan akrilik / cetak 3D", "Kabel jumper", "Baut dan spacer"],
  },
  {
    slug: "robot-self-balancing",
    title: "Robot Self-Balancing Dua Roda",
    category: "Robotika",
    level: "Lanjut",
    desc: "Robot dua roda yang menjaga dirinya tetap tegak dengan membaca kemiringan dan mengoreksi motor memakai kendali PID.",
    parts: ["Arduino Nano / ESP32", "Sensor MPU6050", "Driver Motor TB6612FNG", "Motor DC Gearbox + Encoder", "Baterai Li-ion 18650", "Rangka bertingkat akrilik", "2× roda", "Modul step-down (buck converter)", "Kabel jumper"],
  },
  {
    slug: "robot-maze-solver",
    title: "Robot Maze Solver",
    category: "Robotika",
    level: "Menengah",
    desc: "Robot yang mencari jalan keluar labirin dengan mengikuti dinding memakai tiga sensor jarak di depan, kiri, dan kanan.",
    parts: ["Arduino Uno", "3× Sensor Ultrasonik HC-SR04", "Driver L298N", "Motor DC Gearbox TT", "Sasis 2WD", "Roda bebas (caster)", "Battery holder + baterai", "Kabel jumper"],
  },
  {
    slug: "robot-sumo-mini",
    title: "Robot Sumo Mini",
    category: "Robotika",
    level: "Menengah",
    desc: "Robot adu dorong untuk lomba: mencari lawan dengan sensor jarak dan menjaga diri tetap di arena dengan sensor garis.",
    parts: ["Arduino Nano", "Sensor Garis TCRT5000", "Sensor Ultrasonik HC-SR04", "Driver Motor TB6612FNG", "Motor Gearbox N20", "Sasis dan bilah pendorong", "2× roda karet", "Baterai LiPo 2S / 18650", "Kabel jumper"],
  },
  {
    slug: "robot-pemadam-api",
    title: "Robot Pemadam Api",
    category: "Robotika",
    level: "Menengah",
    desc: "Robot yang mendeteksi titik api dengan sensor nyala, mendekatinya, lalu memadamkan dengan kipas atau pompa air mini.",
    parts: ["Arduino Uno", "Sensor Api (Flame Sensor)", "Driver L298N", "Modul Relay", "Pompa Air Mini / Kipas DC", "Sasis 2WD + motor DC gearbox", "Servo SG90 (pengarah nozel)", "Battery holder + baterai", "Kabel jumper"],
  },
  {
    slug: "mobil-esp32-cam",
    title: "Mobil Pengintai ESP32-CAM",
    category: "Robotika",
    level: "Menengah",
    desc: "Mobil robot dengan kamera yang menyiarkan video langsung ke browser HP lewat WiFi, sekaligus dikendalikan dari halaman yang sama.",
    parts: ["ESP32-CAM", "USB to TTL (FTDI)", "Driver L298N", "Motor DC Gearbox TT", "Sasis 2WD", "Battery holder + baterai 18650", "Modul step-down 5V", "Kabel jumper"],
  },
  {
    slug: "robot-kendali-gestur",
    title: "Robot Kendali Gestur Tangan",
    category: "Robotika",
    level: "Lanjut",
    desc: "Mobil robot yang mengikuti kemiringan tangan: sensor gerak di sarung tangan mengirim perintah secara nirkabel ke robot.",
    parts: ["2× Arduino Nano", "Sensor MPU6050", "2× Modul nRF24L01", "Driver L298N", "Sasis 2WD", "2× motor DC gearbox", "Baterai untuk pemancar di tangan", "Battery holder + baterai untuk robot", "Kabel jumper"],
  },
  {
    slug: "robot-transporter",
    title: "Robot Transporter dengan Penjepit",
    category: "Robotika",
    level: "Lanjut",
    desc: "Line follower yang mengambil benda dengan penjepit servo, membawanya mengikuti lintasan, lalu meletakkannya di titik tujuan.",
    parts: ["Arduino Mega / ESP32", "Sensor Garis 5 Channel", "Gripper + Servo MG90S", "Driver L298N", "Motor DC Gearbox TT", "Sasis 2WD + roda bebas", "Battery holder + baterai", "Modul step-down 5V", "Kabel jumper"],
  },
  {
    slug: "kamera-pan-tilt",
    title: "Dudukan Kamera Pan-Tilt",
    category: "Robotika",
    level: "Pemula",
    desc: "Dudukan dua sumbu yang menggerakkan kamera atau sensor ke kiri-kanan dan atas-bawah, dikendalikan joystick atau dari HP.",
    parts: ["Arduino Uno / ESP32", "2× Servo SG90", "Bracket Pan-Tilt", "Modul Joystick", "Adaptor 5V 2A", "Breadboard", "Kabel jumper"],
  },
  // --- IoT ---
  {
    slug: "smart-home-relay",
    title: "Saklar Lampu Pintar",
    category: "IoT",
    level: "Pemula",
    desc: "Menyalakan dan mematikan lampu atau stopkontak dari HP lewat WiFi, lengkap dengan jadwal otomatis.",
    parts: ["ESP32", "Modul Relay 4 Channel", "Adaptor 5V", "Aplikasi / Dashboard IoT", "Fitting lampu + kabel listrik", "Kotak pelindung (box)", "Kabel jumper"],
  },
  {
    slug: "penyiram-tanaman",
    title: "Penyiram Tanaman Otomatis",
    category: "IoT",
    level: "Pemula",
    desc: "Pompa menyala sendiri saat tanah kering, dan kelembapan tanah bisa dipantau dari HP.",
    parts: ["ESP32", "Sensor Kelembapan Tanah Kapasitif", "Modul Relay", "Pompa Air Mini 5V", "Selang", "Adaptor 5V 2A", "Wadah air", "Kabel jumper"],
  },
  {
    slug: "stasiun-cuaca",
    title: "Stasiun Cuaca Mini",
    category: "IoT",
    level: "Menengah",
    desc: "Mencatat suhu, kelembapan, tekanan udara, dan hujan, menampilkannya di layar kecil serta grafik di dashboard.",
    parts: ["ESP32", "Sensor BME280", "Sensor Hujan", "OLED 0,96 inci", "Dashboard IoT", "Kotak pelindung tahan cuaca", "Adaptor 5V", "Kabel jumper"],
  },
  {
    slug: "kunci-pintu-rfid",
    title: "Kunci Pintu RFID",
    category: "IoT",
    level: "Menengah",
    desc: "Pintu terbuka saat kartu terdaftar ditempelkan; kartu tak dikenal memicu buzzer dan tercatat di riwayat akses.",
    parts: ["ESP32", "RFID RC522", "Solenoid Door Lock 12V", "Modul Relay", "Buzzer", "Adaptor 12V", "Kartu / tag RFID", "Dioda 1N4007 (pengaman relay)", "Kabel jumper"],
  },
  {
    slug: "absensi-rfid",
    title: "Absensi RFID ke Spreadsheet",
    category: "IoT",
    level: "Menengah",
    desc: "Tempel kartu untuk absen: nama dan jam langsung tercatat otomatis ke Google Sheets lewat WiFi.",
    parts: ["ESP32", "RFID RC522", "OLED 0,96 inci", "Buzzer", "Google Sheets", "Kartu / tag RFID", "Kotak pelindung (box)", "Kabel USB / adaptor 5V", "Kabel jumper"],
  },
  {
    slug: "detektor-gas",
    title: "Pendeteksi Kebocoran Gas",
    category: "IoT",
    level: "Pemula",
    desc: "Membunyikan alarm dan mengirim notifikasi ke HP saat kadar gas atau asap melewati batas aman.",
    parts: ["ESP32", "Sensor Gas MQ-2", "Buzzer", "LED", "Notifikasi Telegram", "Resistor 220Ω", "Breadboard", "Kabel USB / adaptor 5V", "Kabel jumper"],
  },
  {
    slug: "tempat-sampah-pintar",
    title: "Tempat Sampah Pintar",
    category: "IoT",
    level: "Pemula",
    desc: "Tutup terbuka sendiri saat tangan mendekat, dan memberi tahu lewat HP ketika isinya hampir penuh.",
    parts: ["ESP32", "2× Sensor Ultrasonik HC-SR04", "Servo SG90", "Notifikasi Telegram", "Tempat sampah bertutup", "Adaptor 5V 2A", "Kabel jumper"],
  },
  {
    slug: "monitoring-daya",
    title: "Pemantau Pemakaian Listrik",
    category: "IoT",
    level: "Lanjut",
    desc: "Mengukur tegangan, arus, daya, dan energi (kWh) sebuah peralatan lalu menampilkan grafiknya di dashboard.",
    parts: ["ESP32", "Sensor Daya PZEM-004T", "LCD 16×2 I2C", "Dashboard IoT", "Sensor arus CT (bawaan PZEM)", "Stopkontak + kabel listrik", "Kotak pelindung (box)", "Adaptor 5V"],
  },
  {
    slug: "pemberi-pakan-otomatis",
    title: "Pemberi Pakan Ikan Otomatis",
    category: "IoT",
    level: "Pemula",
    desc: "Menebar pakan pada jam yang ditentukan, atau saat tombol di HP ditekan dari jauh.",
    parts: ["ESP32", "Servo SG90", "RTC DS3231", "Wadah Pakan", "Baterai CR2032 untuk RTC", "Adaptor 5V", "Kabel jumper"],
  },
  {
    slug: "smart-parking",
    title: "Sistem Parkir Pintar",
    category: "IoT",
    level: "Menengah",
    desc: "Menghitung slot parkir yang kosong, membuka palang otomatis, dan menampilkan sisa slot di layar serta di HP.",
    parts: ["ESP32", "Sensor Infrared (IR Obstacle)", "Servo SG90", "LCD 16×2 I2C", "Palang mini", "Papan maket parkir", "Adaptor 5V", "Kabel jumper"],
  },
  {
    slug: "monitoring-hidroponik",
    title: "Pemantau Air Hidroponik",
    category: "IoT",
    level: "Lanjut",
    desc: "Memantau pH, kepekatan nutrisi, dan suhu larutan hidroponik atau akuarium, dengan peringatan saat nilainya keluar batas.",
    parts: ["ESP32", "Sensor pH", "Sensor TDS", "Sensor Suhu DS18B20", "LCD 16×2 I2C", "Resistor 4,7kΩ (untuk DS18B20)", "Larutan kalibrasi pH", "Adaptor 5V", "Kabel jumper"],
  },
  {
    slug: "kamera-keamanan-pir",
    title: "Kamera Keamanan Sensor Gerak",
    category: "IoT",
    level: "Menengah",
    desc: "Saat sensor mendeteksi gerakan, kamera memotret dan mengirim fotonya langsung ke Telegram.",
    parts: ["ESP32-CAM", "Sensor Gerak PIR HC-SR501", "USB to TTL (FTDI)", "Notifikasi Telegram", "Adaptor 5V 2A", "Kotak pelindung (box)", "Kabel jumper"],
  },
  {
    slug: "pemantau-ketinggian-air",
    title: "Pemantau Ketinggian Air",
    category: "IoT",
    level: "Menengah",
    desc: "Mengukur tinggi air tandon atau saluran dengan sensor ultrasonik tahan air, dan memberi peringatan dini saat mendekati batas.",
    parts: ["ESP32", "Sensor Ultrasonik JSN-SR04T", "Buzzer", "Notifikasi Telegram", "Kotak pelindung tahan air", "Adaptor 5V", "Kabel jumper"],
  },
  {
    slug: "jam-running-text",
    title: "Jam dan Running Text WiFi",
    category: "IoT",
    level: "Pemula",
    desc: "Papan LED yang menampilkan jam akurat dari internet dan teks berjalan yang bisa diganti dari HP.",
    parts: ["ESP32 / ESP8266", "Dot Matrix MAX7219 4-in-1", "Adaptor 5V", "Bingkai / kotak akrilik", "Kabel jumper"],
  },
]

/** Semua ide proyek: tiga unggulan Beranda dulu, lalu sisanya. */
export const projectIdeas: ProjectIdea[] = [...exampleProjects, ...moreIdeas]

---
name: Microim
description: "Komponen Lengkap, Kerja Tanggap."
colors:
  navy: "#071426"
  navy-deep: "#040d1a"
  navy-about: "#0d1c2e"
  navy-card: "#10284d"
  navy-card-deep: "#081629"
  gold: "#ffc928"
  gold-top: "#ffd23f"
  gold-deep: "#f4b712"
  gold-metal-light: "#fff0b0"
  gold-metal-dark: "#c9930a"
  text-strong: "#e9eff8"
  text-body: "#a7b5c7"
  text-muted: "#7f91a8"
  problem-red: "#f2a59d"
  button-navy: "#1c3d70"
typography:
  display:
    fontFamily: "Space Grotesk, Geist, Arial, sans-serif"
    fontSize: "clamp(56px, 8.4vw, 112px)"
    fontWeight: 650
    lineHeight: 0.88
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Space Grotesk, Geist, Arial, sans-serif"
    fontSize: "clamp(32px, 4.6vw, 60px)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Space Grotesk, Geist, Arial, sans-serif"
    fontSize: "clamp(18px, 1.7vw, 22px)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  button: "3px"
  chip: "10px"
  card: "14px"
  panel: "18px"
  pill: "999px"
spacing:
  gutter-mobile: "1rem"
  gutter-desktop: "2.5rem"
  card-gap: "18px"
  section-y: "104px"
  section-y-mobile: "76px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy}"
    rounded: "{rounded.button}"
    height: "46px"
    padding: "0 17px"
  button-secondary:
    backgroundColor: "{colors.button-navy}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    height: "46px"
    padding: "0 17px"
  service-card:
    backgroundColor: "{colors.navy-card}"
    textColor: "{colors.text-strong}"
    rounded: "{rounded.card}"
    padding: "26px 26px 22px"
  solution-panel:
    backgroundColor: "#14263d"
    textColor: "{colors.text-strong}"
    rounded: "{rounded.panel}"
    padding: "clamp(28px, 3.4vw, 48px)"
---

# Design System: Microim

Dokumen ini ditulis ulang dari kode yang berjalan (`app/globals.css` dan komponen di `components/`), menggantikan
panduan lama hasil ekspor Stitch. Sumber kebenarannya adalah kode; bila keduanya berbeda, perbarui dokumen ini.

**Cakupan:** seluruh Beranda (navbar, hero + pita, Tentang, Layanan, Produk + Cara Pesan, Proyek, Kontak) sudah
mengikuti sistem ini, begitu juga footer. Halaman `/contact` juga sudah. Halaman tersendiri `/products`, `/projects`, dan kotak ajakan di `/about`
masih memakai gaya lama dan akan disempurnakan satu per satu; jangan jadikan bagian-bagian itu acuan.

## Overview

**Creative North Star: "Meja Rakit di Malam Hari"**

Microim (Microcontroller Immediately Made) menjual komponen IoT dan jasa rakit/pemrograman untuk mahasiswa. Tampilannya
seperti meja kerja elektronika yang lampunya menyala di ruangan gelap: latar navy pekat, emas sebagai cahaya dan
tembaga, dan benda-benda nyata dari dunia elektronika sebagai elemen visual, bukan hiasan abstrak.

Suaranya akrab dan langsung, memakai "kamu", bukan "Anda". Kalimat menyebut hal konkret (H-1 praktikum, COD kampus,
3.3V vs 5V), bukan janji umum.

**Key Characteristics:**
- Gelap secara bawaan, dengan satu section terang berwarna emas (Layanan) sebagai jeda di tengah halaman.
- Motif diambil dari elektronika sungguhan: jalur PCB, bantalan solder, chip IC, pin, lampu panggung.
- Satu ide interaktif per section, bukan banyak efek kecil.
- Judul besar dan tegas; teks kecil minimal 12px.

## Colors

- **Navy** (`#071426`) adalah latar utama. Variannya: `#040d1a` (paling gelap: hero, Produk + Cara Pesan, Kontak) dan
  `#0d1c2e` (Tentang).
- **Biru cetak biru** (`#12305a → #0e2749`, dengan kisi garis `rgb(160 195 245 / 7–9%)`) hanya untuk section Proyek.
  Teksnya `#f1f6fd` (judul), `#b9c9df` (isi), `#9db6d8` (keterangan).
- **Urutan latar Beranda:** navy (hero) → navy Tentang → emas (Layanan) → navy paling gelap (Produk + Cara Pesan) →
  biru cetak biru (Proyek) → navy paling gelap (Kontak). Dua section bersebelahan tidak boleh berlatar sama, kecuali
  memang satu bab.
- **Emas** (`#ffc928`) adalah aksen tunggal: tombol utama, status aktif, garis penanda, dan teks penekanan.
- **Section emas** (Layanan) memakai gradasi `#ffd23f → #ffc928 → #f4b712` dengan teks navy. Hanya satu section per
  halaman yang boleh berlatar emas.
- **Emas logam** (`#fff0b0 → #ffc928 → #c9930a`, atas ke bawah) dipakai untuk tulisan yang "tercetak": nama di chip dan
  huruf nilai yang sedang disorot. Jangan dipakai untuk judul biasa.
- **Teks:** `#e9eff8` untuk judul, `#a7b5c7` untuk isi, `#7f91a8` untuk keterangan.
- **Merah lembut** (`#f2a59d`) hanya untuk menandai "masalah" atau keadaan "sebelum".
- **Kartu navy di atas emas:** `#10284d → #081629`.

## Typography

- **Space Grotesk** untuk judul dan angka besar. **Geist** untuk isi. **Geist Mono** hanya untuk label teknis pendek
  di dalam komponen (misalnya baris datasheet).
- Judul bab memakai huruf kapital, sangat rapat (`-0.045em`), tinggi baris `0.88`, hingga 112px.
- Judul section 32–60px. Judul kartu 18–22px. Isi 14–16px dengan tinggi baris 1.65–1.75.
- Tidak ada teks di bawah 12px.
- Tidak ada label kecil huruf kapital di atas judul section. Judul berdiri sendiri.
- Judul memakai `text-wrap: balance`.

## Layout

- Kontainer: `min(100% - 5rem, 1440px)`; di HP `min(100% - 2rem, 600px)`.
- Titik henti: 760px (HP), 900–1000px (tablet, kolom ganda menjadi satu), 1050px (hero).
- Kepala section dua kolom: judul besar di kiri, kalimat pengantar pendek di kanan bawah. Di HP menjadi satu kolom.
- Jarak antar-bab lebih lega daripada jarak di dalam bab (104px di atas Layanan; 76px di HP).
- Di dalam satu bab tidak ada garis pemisah: batasnya ruang kosong dan perubahan warna latar.
- Batas antar section memakai bentuk, bukan garis yang sama berulang: pita teks miring (Beranda → Tentang),
  jalur PCB yang menjadi tepi atas section emas (Tentang → Layanan), tepi miring (Layanan → Produk), tepi berlubang
  setengah lingkaran berlapis emas seperti tepi modul ESP32 (Produk → Proyek), dan tepi sinyal digital HIGH/LOW
  (Proyek → Kontak). Setiap bentuk hanya dipakai sekali.
- Halaman tidak boleh bisa digeser ke samping di lebar mana pun.

## Elevation & Depth

- Kedalaman terutama dari lapisan warna dan garis tepi tipis (`rgb(148 163 184 / 14–20%)`), bukan bayangan tebal.
- Kartu di atas emas memakai bayangan hangat kecokelatan (`rgb(74 46 0 / 75%)`).
- Pendar emas hanya untuk hal yang benar-benar "menyala": panel solusi aktif, lampu sorot, takik rel yang terkunci.
- "Kaca" (blur latar) hanya di navbar, tombol WhatsApp melayang, dan elemen hero; resepnya ada di variabel
  `--glass-bg`, `--glass-filter`, `--glass-shadow`.

## Shapes

- Tombol bersudut tegas (3px). Kartu 14px, panel besar 18px, chip IC 10px, kapsul dan lencana 999px.
- Garis tepi 1px. Garis putus-putus berarti "belum tersambung" atau pemisah di dalam komponen.
- Bentuk khas: chip IC dengan pin di kiri-kanan, takik setengah lingkaran, dan titik pin 1; jalur PCB bersudut 45°
  dengan bantalan solder; tepi section yang dipotong miring.

## Components

- **Tombol utama:** emas dengan teks gelap, huruf kapital 12px berjarak `.075em`, tinggi 46px. Tombol kedua navy.
- **Kartu layanan:** navy di atas emas, dibuka nomor besar bergaris tepi (terisi emas saat disorot), ikon kecil
  sebaris dengan judul, daftar cakupan bercentang, dan seluruh kartu adalah satu tautan.
- **Chip datasheet:** profil singkat Microim dengan nama tercetak emas logam dan baris bernomor pin.
- **Daftar masalah + panel solusi:** tab vertikal; panel menampilkan "sebelum" yang dicoret dan "sesudah" yang besar,
  dengan lampu indikator berisi ikon solusi di pojok kanan atas. Ketiga masalah tersambung ke panel lewat jalur PCB
  (belokan 45°, bantalan solder di tiap ujung); jalur terpilih menyala emas dan dialiri satu denyut cahaya.
  Di HP menjadi akordeon dan jalurnya disembunyikan.
- **Pembatas jalur PCB (Tentang → Layanan):** saat masuk layar, kilau tergambar dari tepi kiri layar sampai tepi kanan
  layar, tiap bantalan berkilat dengan cincin riak tepat saat dilewati, lalu satu komet cahaya melintas.
- **Nilai M-I-C-R-O-I-M:** tujuh huruf sebagai tab, lampu panggung di atas rel yang menyorot huruf terpilih. Latarnya
  sedikit lebih gelap (`#08131f`) seperti panggung.
- **Visi:** pernyataan besar dengan tanda kutip emas besar di kirinya dan keterangan "Visi Microim" di bawahnya.
- **Etalase produk:** susunan asimetris (1 unggulan besar, 2 sedang, 1 melebar). Foto mengisi kartu; di bawahnya
  kategori, status stok, nama, harga emas, dan tombol kapsul ("Pesan" emas, atau "Tanya restock" bergaris tepi).
- **Cara pesan:** empat langkah di sepanjang satu jalur PCB, tanpa kartu. Saat masuk layar jalur menyala emas dari
  langkah 1 ke 4 dan tiap bantalan solder menyala ketika dilewati. Di tablet dan HP jalurnya tegak di kiri.
- **Baris proyek:** daftar baris (bukan kartu) di atas kertas cetak biru, dipisah garis putus-putus. Tiap baris berisi
  gambar teknik garis (tergambar saat masuk layar, berubah emas saat disorot), penjelasan, dan daftar komponen
  berhuruf mono. Isinya dari `lib/projects.ts`, sama dengan halaman `/projects`.
- **Pembatas sinyal digital (Proyek → Kontak):** pola piksel asli yang berulang, jadi tebal garisnya sama di semua
  lebar layar; garis emasnya tersapu dari kiri ke kanan saat masuk layar.
- **Kontak:** judul besar dua baris (baris kedua emas), dua tombol, rincian kontak tanpa kotak, dan satu panel
  percakapan. Balon kalimat pembuka muncul berurutan dan masing-masing membuka WhatsApp dengan pesan terisi.
- **Footer:** ramping, tiga bagian (merek + tagline, tautan halaman, kontak singkat) dan satu baris bawah. Judul kolom
  huruf biasa 15px, tautan 14px; tanpa kolom tambahan, kutipan, atau label huruf kapital.
- **Formulir pengajuan (`/contact`):** kolom isian 50px, sudut 10px, teks 16px, label huruf biasa 14px; jenis kebutuhan
  berupa kapsul pilihan (yang terpilih emas). Di sebelahnya pratinjau pesan WhatsApp yang ikut terisi selagi
  mengetik dan menempel saat digulir; di HP pratinjau turun ke bawah formulir.
- **Panel nilai:** judul besar (26–38px) dengan ikon emas sebaris, tanpa kotak ikon. Lampu sorotnya satu keluarga warna:
  baja kebiruan dengan poros dan lensa emas.
- **Ikon media sosial:** ikon garis buatan sendiri (`components/icons/social-icon.tsx`), berwarna emas seperti ikon
  kontak lain.
- **Tautan "Kembali":** kembali ke halaman dan posisi gulir terakhir pengunjung; bila halaman dibuka langsung, menuju
  section terkait di Beranda (`components/layout/back-link.tsx`).
- **Fokus keyboard:** garis luar emas 2px (`:focus-visible`) di semua elemen interaktif.

**Gerak:**
- Kurva utama `cubic-bezier(.22, 1, .36, 1)`. Respons tekan 160ms, perubahan keadaan 250–450ms, masuk layar 550–1000ms.
- Elemen yang bisa ditekan mengecil sedikit saat ditekan (`scale: .97–.985`).
- Efek sorot hanya aktif di perangkat berkursor (`@media (hover: hover) and (pointer: fine)`).
- Animasi masuk berulang tiap kali section masuk layar (`useRevealOnScroll`, `RevealFlag`).
- Animasi yang berjalan terus dibatasi: pita teks di Beranda dan kilau huruf nilai. Jangan menambah yang lain.
- `prefers-reduced-motion` selalu dihormati: isi langsung tampil di keadaan akhirnya.

## Do's and Don'ts

**Lakukan:**
- Ambil isi dari rencana bisnis Microim; sebut angka dan situasi yang nyata.
- Pakai motif elektronika yang punya makna di tempatnya.
- Buat satu elemen interaktif yang jelas per section.
- Uji di desktop dan HP, dan pastikan halaman tidak bisa digeser ke samping.

**Jangan:**
- Jangan menaruh label kecil huruf kapital di atas judul, atau kode buatan seperti `[IOT.01]` dan `RAKIT.01`.
- Jangan mengulang susunan "tiga atau empat kartu seragam" di setiap section.
- Jangan menaruh ikon dalam kotak tepat di atas judul kartu; ikon menyatu sebaris dengan judul.
- Jangan menampilkan proyek, angka, atau testimoni yang tidak nyata.
- Jangan menambah animasi tak berujung, pendar, atau gradasi teks di luar yang tercantum di atas.
- Jangan memakai "Anda"; pakai "kamu".
- Jangan memakai teks di bawah 12px.

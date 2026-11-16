export const siteConfig = {
  name: "Microim",
  longName: "Microim — Microcontroller Immediately Made",
  tagline: "Komponen Lengkap, Kerja Tanggap.",
  url: "https://microim.web.id",
  /** Alamat situs tanpa https://, untuk ditampilkan (gambar pratinjau, dashboard admin). */
  domain: "microim.web.id",
  description:
    "Jasa rakit perangkat IoT, pemrograman Arduino dan ESP32, serta jual komponen elektronik ready stock di Semarang. COD di area kampus, cocok untuk praktikum dan tugas akhir.",
}

export const siteContact = {
  email: "microimofficial@gmail.com",
  whatsappDisplay: "+62 851-3747-3695",
  whatsappNumber: "6285137473695",
  location: "Semarang, Jawa Tengah",
}

// Kosongkan nilai `url` untuk menyembunyikan tautan di situs.
export const siteSocials = [
  { name: "Instagram", handle: "@microim.official", url: "https://www.instagram.com/microim.official/" },
  { name: "TikTok", handle: "@microim.official", url: "https://www.tiktok.com/@microim.official" },
].filter((social) => social.url)

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteContact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const siteConfig = {
  name: "Microim",
  longName: "Microim — Microcontroller Immediately Made",
  tagline: "Komponen Lengkap, Kerja Tanggap.",
  url: "https://microim.vercel.app",
  description:
    "Jasa rakit perangkat IoT, pemrograman mikrokontroler, dan toko komponen elektronik. Dari ide sampai perangkat siap pakai bersama Microim.",
}

export const siteContact = {
  email: "microimofficial@gmail.com",
  whatsappDisplay: "+62 851-3747-3695",
  whatsappNumber: "6285137473695",
}

// Kosongkan nilai `url` untuk menyembunyikan tautan di situs.
export const siteSocials = [
  { name: "Instagram", handle: "@microim.official", url: "https://www.instagram.com/microim.official/" },
  { name: "TikTok", handle: "", url: "" },
].filter((social) => social.url)

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteContact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

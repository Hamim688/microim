import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { siteConfig } from "@/lib/site"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Microim - Jasa Rakit IoT, Pemrograman & Komponen Mikrokontroler",
    template: "%s | Microim",
  },
  description: siteConfig.description,
  keywords: ["Microim", "jasa rakit IoT", "pemrograman ESP32", "komponen mikrokontroler", "Arduino", "sensor"],
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: siteConfig.name,
    title: "Microim - Dari Ide ke Perangkat Siap Pakai",
    description: siteConfig.description,
    images: [{ url: "/images/iot-board-hero.png", width: 1536, height: 1024, alt: "Perangkat IoT Microim" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Microim - Dari Ide ke Perangkat Siap Pakai",
    description: siteConfig.description,
    images: ["/images/iot-board-hero.png"],
  },
  icons: {
    icon: "/logo/logo-baru.png",
    shortcut: "/logo/logo-baru.png",
    apple: "/logo/logo-baru.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#071426",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // data-scroll-behavior="smooth": scroll halus tetap untuk lompat ke section, tetapi saat pindah
  // halaman Next.js langsung ke atas (tanpa ini halaman baru tampak "meluncur dari bawah").
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#071426] text-white selection:bg-[#FFC928] selection:text-[#071426]">
        {children}
      </body>
    </html>
  )
}

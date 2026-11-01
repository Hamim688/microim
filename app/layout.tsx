import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsappFloat } from "@/components/layout/whatsapp-float"
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
  weight: ["500", "600", "700"],
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
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#071426] text-white selection:bg-[#FFC928] selection:text-[#071426]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsappFloat />
      </body>
    </html>
  )
}

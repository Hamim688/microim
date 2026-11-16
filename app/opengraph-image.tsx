import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { siteConfig } from "@/lib/site"

// Gambar pratinjau tautan (WhatsApp, Instagram, X, dll.) untuk seluruh situs. Dibuat saat build dari bahan lokal di
// assets/og, jadi selalu senada dengan desain situs dan tidak bergantung internet.
export const alt = `${siteConfig.name} · ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const asset = (file: string) => readFile(join(process.cwd(), "assets/og", file))
const dataUrl = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`

export default async function Image() {
  const [display, body, board, logo] = await Promise.all([
    asset("space-grotesk-700.woff"),
    asset("geist-regular.ttf"),
    asset("esp32.png"),
    asset("logo.png"),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(160deg, #0c1f3b 0%, #071428 55%, #040b17 100%)",
          fontFamily: "Geist",
        }}
      >
        {/* Titik sirkuit samar, senada hero situs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255, 201, 40, 0.22) 1.5px, transparent 2px)",
            backgroundSize: "40px 40px",
            opacity: 0.55,
          }}
        />
        {/* Cahaya di belakang papan */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 70,
            width: 520,
            height: 520,
            display: "flex",
            borderRadius: 999,
            background: "radial-gradient(closest-side, rgba(64, 120, 210, 0.35), rgba(255, 201, 40, 0.08) 60%, transparent)",
          }}
        />
        {/* Garis emas di tepi bawah */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, display: "flex", background: "#ffc928" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700, padding: "64px 0 70px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse hanya menerima <img> */}
            <img src={dataUrl(logo)} width={64} height={64} style={{ borderRadius: 18 }} alt="" />
            <span style={{ color: "#ffffff", fontFamily: "Space Grotesk", fontSize: 40, letterSpacing: -1 }}>Microim</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#e9eff8", fontFamily: "Space Grotesk", fontSize: 82, lineHeight: 1, letterSpacing: -3.5 }}>Komponen Lengkap,</span>
            <span style={{ color: "#ffc928", fontFamily: "Space Grotesk", fontSize: 82, lineHeight: 1.05, letterSpacing: -3.5 }}>Kerja Tanggap.</span>
            <span style={{ marginTop: 30, color: "#b3bfd0", fontSize: 28, lineHeight: 1.4 }}>
              Jasa rakit IoT, pemrograman mikrokontroler, dan komponen siap COD di kampus.
            </span>
          </div>

          <span style={{ color: "#8fa2bb", fontSize: 24 }}>{siteConfig.domain}</span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse hanya menerima <img> */}
        <img src={dataUrl(board)} width={540} height={540} style={{ position: "absolute", right: 10, top: 40 }} alt="" />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: display, style: "normal", weight: 700 },
        { name: "Geist", data: body, style: "normal", weight: 400 },
      ],
    },
  )
}

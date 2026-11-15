import type { Metadata } from "next"
import { siteConfig } from "@/lib/site"

/** Judul pratinjau tautan Beranda (WhatsApp, Instagram, X, dll.). */
export const homeShareTitle = `${siteConfig.name} · ${siteConfig.tagline}`

/** Bagian Open Graph yang sama untuk semua halaman. */
export const sharedOpenGraph = { type: "website", locale: "id_ID", siteName: siteConfig.name } as const

/**
 * Gambar pratinjau dari app/opengraph-image.tsx. Beranda mendapatkannya otomatis; halaman yang menulis `openGraph`
 * sendiri tidak mewarisinya, jadi gambarnya dicantumkan ulang di pageMetadata().
 */
const shareImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} · ${siteConfig.tagline}` }

/**
 * Metadata halaman tersendiri, lengkap dengan judul dan deskripsi pratinjau tautan miliknya sendiri. Tanpa ini,
 * tautan /projects yang dibagikan memakai judul pratinjau Beranda (Next.js tidak mengisi og:title dari title).
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const shareTitle = `${title} | ${siteConfig.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...sharedOpenGraph, url: path, title: shareTitle, description, images: [shareImage] },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [shareImage.url] },
  }
}

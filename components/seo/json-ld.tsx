import type { CatalogProduct } from "@/lib/catalog"
import { siteConfig, siteContact, siteSocials } from "@/lib/site"

// Data terstruktur (schema.org, JSON-LD) yang dibaca Google untuk memahami usaha dan produk Microim.
// Uji hasilnya di https://search.google.com/test/rich-results setelah di-deploy.

const absolute = (path: string) => (path.startsWith("http") ? path : `${siteConfig.url}${path}`)

/** Menyisipkan satu objek JSON-LD. Karakter "<" di-escape supaya isi data tidak bisa menutup tag <script>. */
function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}

/** Profil usaha Microim untuk Beranda: membantu Google menampilkan panel informasi saat orang mencari "microim". */
export function BusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ElectronicsStore",
        "@id": `${siteConfig.url}/#usaha`,
        name: siteConfig.name,
        alternateName: "Microcontroller Immediately Made",
        slogan: siteConfig.tagline,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: absolute("/logo/logo-baru.png"),
        image: absolute("/opengraph-image"),
        telephone: `+${siteContact.whatsappNumber}`,
        email: siteContact.email,
        address: { "@type": "PostalAddress", addressLocality: "Semarang", addressRegion: "Jawa Tengah", addressCountry: "ID" },
        areaServed: { "@type": "City", name: "Semarang" },
        priceRange: "Rp",
        sameAs: siteSocials.map((social) => social.url),
        makesOffer: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Jasa rakit perangkat IoT" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Jasa pemrograman mikrokontroler Arduino dan ESP32" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Penjualan komponen elektronik dan mikrokontroler" } },
        ],
      }}
    />
  )
}

/** Daftar produk untuk /products: nama, foto, harga, dan stok, supaya produk bisa tampil dengan harga di Google. */
export function ProductListJsonLd({ products }: { products: CatalogProduct[] }) {
  const goods = products.filter((p) => p.stock !== null)
  if (goods.length === 0) return null
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Katalog komponen Microim",
        itemListElement: goods.map((p, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: p.name,
            category: p.category,
            ...(p.description ? { description: p.description } : {}),
            ...(p.image ? { image: absolute(p.image) } : {}),
            brand: { "@type": "Brand", name: siteConfig.name },
            offers: {
              "@type": "Offer",
              url: `${siteConfig.url}/products`,
              priceCurrency: "IDR",
              price: Number(p.price.replace(/[^\d]/g, "")),
              availability: (p.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@id": `${siteConfig.url}/#usaha` },
            },
          },
        })),
      }}
    />
  )
}

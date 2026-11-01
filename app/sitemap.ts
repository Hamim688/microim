import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

const routes = ["", "/about", "/services", "/products", "/projects", "/contact"]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }))
}

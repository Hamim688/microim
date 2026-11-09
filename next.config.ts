import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 mewajibkan daftar kualitas. 100 dipakai logo di navbar & footer agar tetap tajam.
    qualities: [75, 100],
  },
  experimental: {
    // Foto produk dikompres di browser (±50–150 KB), batas ini memberi ruang aman untuk unggahan.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;

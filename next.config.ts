import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Foto produk dikompres di browser (±50–150 KB), batas ini memberi ruang aman untuk unggahan.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;

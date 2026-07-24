import type { MetadataRoute } from "next";

// PWA manifest — served at /manifest.webmanifest and linked automatically.
// Brand colors: navy #0A1426 background / gold accents in the icon set.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ASSETMAX Global",
    short_name: "ASSETMAX",
    description:
      "El marketplace global de activos industriales y megaproyectos · The global marketplace for industrial assets & megaprojects",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0A1426",
    theme_color: "#0A1426",
    lang: "es",
    dir: "ltr",
    categories: ["business", "finance"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

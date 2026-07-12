import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/?source=pwa",
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    categories: ["business", "productivity", "utilities"],
    lang: "en-KE",
    dir: "ltr",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#0B3D91",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Get a Quote",
        short_name: "Get Quote",
        description: "Request a custom quote for your digital project",
        url: "/get-quote?utm_source=pwa&utm_medium=shortcut",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Our Services",
        short_name: "Services",
        description: "View our software development, cloud, and cybersecurity services",
        url: "/services?utm_source=pwa&utm_medium=shortcut",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Read our Blog",
        short_name: "Blog",
        description: "Latest insights on technology, cloud, security and development",
        url: "/blog?utm_source=pwa&utm_medium=shortcut",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Contact Us",
        short_name: "Contact",
        description: "Get in touch with Yagwa Tech Solutions",
        url: "/contact?utm_source=pwa&utm_medium=shortcut",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
    screenshots: [
      {
        src: "/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Yagwa Tech Solutions Desktop Homepage",
      },
      {
        src: "/screenshot-mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "Yagwa Tech Solutions Mobile Homepage",
      },
    ] as any,
  };
}


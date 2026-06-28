import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — allow everything except API routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Google crawlers — explicitly allowed
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI crawlers — explicitly allowed for AEO/GEO visibility
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Gemini",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

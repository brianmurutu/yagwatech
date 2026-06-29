import type { Metadata } from "next";
import { site } from "@/lib/site";

export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const ogImage = image ?? `${site.url}/og-image.png`;

  return {
    title,
    description,
    keywords: keywords ?? [
      "IT services Kenya",
      "software development Nairobi",
      "digital solutions Kenya",
      "Yagwa Tech Solutions",
    ],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

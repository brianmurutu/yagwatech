import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | IT Services and Digital Solutions in Kenya`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "IT services Kenya",
    "software development Nairobi",
    "cloud infrastructure Kenya",
    "cybersecurity Kenya",
    "digital marketing Nairobi",
    "Yagwa Tech Solutions",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: site.url },
  openGraph: {
    title: `${site.name} | IT Services and Digital Solutions in Kenya`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_KE",
    type: "website",
    images: [{ url: `${site.url}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | IT Services and Digital Solutions in Kenya`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneRaw,
      contactType: "customer service",
      email: site.email,
      areaServed: "KE",
      availableLanguage: ["English", "Swahili"],
    },
    sameAs: [
      site.social.facebook,
      site.social.twitter,
      site.social.instagram,
      site.social.linkedin,
    ],
  };

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}

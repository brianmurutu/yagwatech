import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    "web development Kenya",
    "mobile app development Nairobi",
    "business automation Kenya",
    "UI UX design Kenya",
    "IT consulting Nairobi",
    "digital transformation Kenya",
    "Yagwa Tech Solutions",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: site.url },
  openGraph: {
    title: `${site.name} | IT Services and Digital Solutions in Kenya`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_KE",
    type: "website",
    images: [{ url: `${site.url}/og-image.png`, width: 1200, height: 630, alt: `${site.name} — IT Services Kenya` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | IT Services and Digital Solutions in Kenya`,
    description: site.description,
    site: "@yagwatech",
    creator: "@yagwatech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "geo.region": "KE-30",
    "geo.placename": "Nairobi",
    "geo.position": "-1.286389;36.817223",
    ICBM: "-1.286389, 36.817223",
  },
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
    foundingDate: site.founded,
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
      areaServed: ["KE", "UG", "TZ", "RW"],
      availableLanguage: ["English", "Swahili"],
    },
    sameAs: [
      site.social.facebook,
      site.social.twitter,
      site.social.instagram,
      site.social.linkedin,
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    image: `${site.url}/og-image.png`,
    url: site.url,
    telephone: site.phoneRaw,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nairobi CBD",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.286389,
      longitude: 36.817223,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "KES, USD",
    paymentAccepted: "Cash, Bank Transfer, M-Pesa",
    areaServed: { "@type": "Country", name: "Kenya" },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}

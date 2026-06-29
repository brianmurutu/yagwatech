import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/site";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        item: `${site.url}${item.href || ""}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/65 flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

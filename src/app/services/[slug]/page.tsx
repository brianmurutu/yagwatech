import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import { services, getServiceBySlug, getRelatedServices } from "@/lib/services";
import { getServiceIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const Icon = getServiceIcon(service.icon);
  const related = getRelatedServices(service);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    areaServed: "KE",
    url: `${site.url}/services/${service.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        eyebrow="Service"
        title={service.name}
        description={service.heroIntro}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.shortName, href: `/services/${service.slug}` },
        ]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/5">
                  <Icon className="h-5 w-5 text-brand-blue" />
                </div>
                <h2 className="mt-5 text-2xl font-medium text-ink-900">Overview</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                  {service.overview}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-ink-900">What is included</h2>
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-black/5 p-5">
                      <h3 className="text-sm font-medium text-ink-900">{feature.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-ink-900">How we work</h2>
                <div className="mt-5 space-y-4">
                  {service.process.map((step) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-medium text-white">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-ink-900">{step.title}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-ink-900">Frequently asked questions</h2>
                <div className="mt-5 space-y-4">
                  {service.faqs.map((faq) => (
                    <div key={faq.question} className="rounded-xl border border-black/5 p-5">
                      <h3 className="text-sm font-medium text-ink-900">{faq.question}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-black/5 bg-ink-50 p-6 sticky top-24">
                <h3 className="text-sm font-medium text-ink-900">Why choose this service</h3>
                <ul className="mt-4 space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
                      <span className="text-[13px] leading-relaxed text-ink-400">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/get-quote"
                  className="mt-6 flex items-center justify-center gap-2 rounded-md bg-brand-orange px-5 py-3 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
                >
                  Get a free quote
                </Link>
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="mt-2.5 flex items-center justify-center gap-2 rounded-md border border-black/10 px-5 py-3 text-sm text-ink-900 hover:bg-white transition-colors"
                >
                  Call {site.phone}
                </a>
              </div>

              {related.length > 0 && (
                <div className="rounded-xl border border-black/5 p-6">
                  <h3 className="text-sm font-medium text-ink-900">Related services</h3>
                  <div className="mt-4 space-y-3">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/services/${r.slug}`}
                        className="flex items-center justify-between text-sm text-ink-400 hover:text-brand-blue transition-colors"
                      >
                        {r.shortName}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { services } from "@/lib/services";
import { getServiceIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Our services",
  description:
    "Explore the full range of IT and digital solutions from Yagwa Tech Solutions, covering software development, cloud, cybersecurity, branding, marketing, and more.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="IT and digital solutions built around your business"
        description="From custom software to cybersecurity and digital marketing, explore the services we offer to help your business grow, adapt, and succeed."
        breadcrumbs={[{ label: "Services" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group rounded-xl border border-black/5 bg-white p-6 hover:border-brand-blue hover:shadow-md transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/5">
                    <Icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <h2 className="mt-4 text-base font-medium text-ink-900 leading-snug">
                    {service.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">
                    {service.tagline}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-blue">
                    Explore service
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-blueDark py-16">
        <div className="container-wrap text-center">
          <h2 className="text-2xl lg:text-3xl font-medium text-white">
            Not sure which service fits your situation?
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-lg mx-auto">
            Tell us what you are trying to solve and we will recommend the right
            starting point, free of charge.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-brand-orange px-7 py-3 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
          >
            Talk to our team
          </Link>
          <p className="mt-3 text-xs text-white/40">
            Or call us directly at {site.phone}
          </p>
        </div>
      </section>
    </>
  );
}

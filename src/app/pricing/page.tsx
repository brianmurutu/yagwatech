import Link from "next/link";
import { Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Transparent pricing guidance for software development, websites, and digital marketing services from Yagwa Tech Solutions in Kenya.",
  path: "/pricing",
});

const tiers = [
  {
    name: "Starter",
    price: "From KES 45,000",
    description: "For small businesses needing a professional online presence.",
    features: [
      "Up to 5 page responsive website",
      "Basic on page SEO setup",
      "Contact form integration",
      "Mobile optimization",
      "2 weeks delivery",
      "30 days post launch support",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "From KES 150,000",
    description: "For businesses ready to invest in custom software or e-commerce.",
    features: [
      "Custom web application or online store",
      "M-Pesa and payment gateway integration",
      "Admin dashboard for content management",
      "Technical SEO and structured data",
      "6 to 10 weeks delivery",
      "90 days post launch support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom quote",
    description: "For organizations needing platforms, integrations, or ongoing teams.",
    features: [
      "Full platform development",
      "API integrations and systems architecture",
      "Dedicated project management",
      "Cloud infrastructure and security review",
      "Flexible delivery timeline",
      "Ongoing support and maintenance plan",
    ],
    highlighted: false,
  },
];

const addOns = [
  { name: "Monthly technical support retainer", price: "From KES 15,000 / month" },
  { name: "SEO and content marketing retainer", price: "From KES 25,000 / month" },
  { name: "Cloud infrastructure management", price: "From KES 20,000 / month" },
  { name: "Half day digital literacy workshop", price: "From KES 30,000" },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Investment"
        title="Pricing that scales with your project"
        description="Every project is different, so these are starting ranges. We provide a firm, written quote once we understand your exact requirements."
        breadcrumbs={[{ label: "Pricing" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-7 ${
                  tier.highlighted
                    ? "border-2 border-brand-blue relative"
                    : "border-black/5"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand-blue px-3 py-1 text-[11px] font-medium text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-medium text-ink-900">{tier.name}</h3>
                <p className="mt-2 text-2xl font-medium text-brand-blue">{tier.price}</p>
                <p className="mt-2 text-[13.5px] text-ink-400 leading-relaxed">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
                      <span className="text-[13px] leading-relaxed text-ink-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/get-quote"
                  className={`mt-7 flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors ${
                    tier.highlighted
                      ? "bg-brand-orange text-white hover:bg-brand-orangeLight"
                      : "border border-black/10 text-ink-900 hover:bg-ink-50"
                  }`}
                >
                  Get a quote
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-medium text-ink-900">Ongoing services and add ons</h2>
            <p className="mt-2 text-sm text-ink-400">
              Pricing for retainers and ongoing support, billed monthly unless noted.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {addOns.map((addOn) => (
                <div
                  key={addOn.name}
                  className="flex items-center justify-between rounded-xl border border-black/5 px-5 py-4"
                >
                  <span className="text-sm text-ink-900">{addOn.name}</span>
                  <span className="text-sm font-medium text-brand-blue whitespace-nowrap ml-4">
                    {addOn.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 rounded-2xl bg-ink-50 p-8 text-center">
            <h3 className="text-lg font-medium text-ink-900">
              Every quote is based on your actual requirements
            </h3>
            <p className="mt-2 text-sm text-ink-400 max-w-lg mx-auto">
              The ranges above are a starting guide. Final pricing depends on scope,
              integrations, and timeline, and we always confirm the full cost in writing
              before any work begins.
            </p>
            <Link
              href="/get-quote"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-blue px-7 py-3 text-sm font-medium text-white hover:bg-brand-blueLight transition-colors"
            >
              Request a custom quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { Clock, ShieldCheck, BadgeCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import QuoteForm from "@/components/QuoteForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Get a quote",
  description:
    "Request a free, no obligation quote from Yagwa Tech Solutions for software development, websites, cloud, or any of our IT services.",
  path: "/get-quote",
});

export default function GetQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Free quote"
        title="Tell us about your project"
        description="Share a few details below and our team will get back to you within one business day with guidance and a written quote."
        breadcrumbs={[{ label: "Get a quote", href: "/get-quote" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <QuoteForm />
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-black/5 p-6">
                <Clock className="h-6 w-6 text-brand-blue" />
                <h3 className="mt-3 text-sm font-medium text-ink-900">
                  Response within 1 business day
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">
                  We review every request personally and reply with next steps, not an
                  automated form letter.
                </p>
              </div>
              <div className="rounded-xl border border-black/5 p-6">
                <BadgeCheck className="h-6 w-6 text-brand-orange" />
                <h3 className="mt-3 text-sm font-medium text-ink-900">
                  No obligation quote
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">
                  A written quote with no pressure to commit. Compare it, sit with it, and
                  decide on your own timeline.
                </p>
              </div>
              <div className="rounded-xl border border-black/5 p-6">
                <ShieldCheck className="h-6 w-6 text-brand-blue" />
                <h3 className="mt-3 text-sm font-medium text-ink-900">
                  Your details stay private
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">
                  Project details you share with us are used only to prepare your quote.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

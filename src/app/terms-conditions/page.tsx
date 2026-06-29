import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms and conditions",
  description: `The terms and conditions governing use of the ${site.name} website and engagement of our services.`,
  path: "/terms-conditions",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and conditions"
        description="Last updated June 2026. Please read these terms carefully before using our website or engaging our services."
        breadcrumbs={[{ label: "Terms and conditions", href: "/terms-conditions" }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-wrap max-w-2xl space-y-8">
          <div>
            <h2 className="text-xl font-medium text-ink-900">Acceptance of terms</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              By accessing this website, you agree to be bound by these terms and
              conditions. If you do not agree with any part of these terms, please do not
              use this website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Services</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              Descriptions of services on this website are for general informational
              purposes. Actual project scope, pricing, and timelines are confirmed
              separately in writing once we understand your specific requirements,
              typically through a signed proposal or contract.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Intellectual property</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              All content on this website, including text, graphics, logos, and code, is
              the property of {site.name} unless otherwise stated, and may not be
              reproduced without permission. Ownership of work delivered under a client
              contract is governed by the terms of that specific agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Quotes and payments</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              Quotes provided through this website or in response to inquiries are
              estimates and are not binding until confirmed in a signed proposal or
              invoice. Payment terms, including deposits and milestone payments, are
              specified in the relevant project agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Limitation of liability</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              {site.name} provides this website on an as is basis and makes no
              warranties regarding its uninterrupted availability. We are not liable for
              any indirect or consequential loss arising from use of this website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Governing law</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              These terms are governed by the laws of Kenya. Any disputes arising from
              use of this website or our services will be subject to the jurisdiction of
              Kenyan courts.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Contact us</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              Questions about these terms can be directed to{" "}
              <a href={`mailto:${site.email}`} className="text-brand-blue">
                {site.email}
              </a>{" "}
              or {site.phone}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

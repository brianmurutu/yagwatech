import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: `How ${site.name} collects, uses, and protects information submitted through our website.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        description="Last updated June 2026. This policy explains how we handle information you share with us."
        breadcrumbs={[{ label: "Privacy policy" }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-wrap max-w-2xl space-y-8">
          <div>
            <h2 className="text-xl font-medium text-ink-900">Information we collect</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              When you use our contact form, request a quote, or subscribe to our
              newsletter, we collect the information you provide directly, such as your
              name, email address, phone number, and any project details you share. We
              do not collect sensitive personal information through these forms, and we
              do not ask for payment details on our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">How we use your information</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              We use the information you submit to respond to your inquiry, prepare
              quotes, deliver newsletter content you have subscribed to, and improve our
              services. We do not sell or rent your personal information to third
              parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">How we store and protect your data</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              Information submitted through our forms is transmitted securely and
              processed through our email delivery provider. We take reasonable
              technical and organizational measures to protect your information from
              unauthorized access, alteration, or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Cookies and analytics</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              Our website may use basic analytics tools to understand how visitors use
              the site, which helps us improve content and navigation. These tools do not
              identify you personally.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Your rights</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              You can request access to, correction of, or deletion of the personal
              information we hold about you at any time by contacting us at{" "}
              <a href={`mailto:${site.email}`} className="text-brand-blue">
                {site.email}
              </a>
              . You can also unsubscribe from our newsletter at any time using the link
              in any email we send.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Changes to this policy</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              We may update this privacy policy from time to time. Any changes will be
              posted on this page with an updated revision date.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-ink-900">Contact us</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              If you have questions about this privacy policy, reach us at{" "}
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

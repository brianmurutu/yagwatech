import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import { faqs } from "@/lib/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Frequently asked questions",
  description:
    "Answers to common questions about working with Yagwa Tech Solutions, covering pricing, process, timelines, and technical details.",
  path: "/faqs",
});

export default function FaqsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        eyebrow="Support"
        title="Frequently asked questions"
        description="Answers to the questions we hear most often about pricing, process, and working with our team."
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap max-w-2xl">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}

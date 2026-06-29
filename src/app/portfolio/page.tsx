import PageHero from "@/components/PageHero";
import PortfolioGrid from "@/components/PortfolioGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Explore projects delivered by Yagwa Tech Solutions, spanning software development, consulting, branding, finance, and community digital empowerment across Kenya.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Projects that drive transformation across Kenya"
        description="From scalable enterprise technology to community centered digital literacy programs, explore the work behind our client partnerships."
        breadcrumbs={[{ label: "Portfolio", href: "/portfolio" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <PortfolioGrid />
        </div>
      </section>
    </>
  );
}

import { Suspense } from 'react';
import PageHero from "@/components/PageHero";
import { blogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import BlogList from "@/components/blog/BlogList";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Insights, tips, and stories from the world of tech, business, and digital transformation, written by the Yagwa Tech Solutions team.",
  path: "/blog",
  keywords: [
    "Kenya tech blog",
    "IT insights Nairobi",
    "digital transformation blog",
    "software development articles Kenya",
    "cybersecurity blog Africa",
  ],
});

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Tech, business, and digital transformation, explained plainly"
        description="Practical articles written for business owners and teams navigating technology decisions in Kenya and beyond."
        breadcrumbs={[{ label: "Blog", href: "/blog" }]}
      />

      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-orange border-t-transparent" />
        </div>
      }>
        <BlogList initialPosts={sorted} />
      </Suspense>
    </>
  );
}

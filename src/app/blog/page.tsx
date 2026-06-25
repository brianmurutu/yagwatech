import Link from "next/link";
import { Calendar } from "lucide-react";
import PageHero from "@/components/PageHero";
import { blogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Insights, tips, and stories from the world of tech, business, and digital transformation, written by the Yagwa Tech Solutions team.",
  path: "/blog",
});

const gradients = [
  "from-brand-blue to-brand-blueLight",
  "from-brand-blueDark to-brand-blue",
  "from-brand-orange to-brand-orangeLight",
];

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
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-black/5 bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-40 flex items-center justify-center bg-gradient-to-br ${
                    gradients[i % gradients.length]
                  }`}
                >
                  <span className="px-6 text-center text-xs font-medium text-white/60">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-brand-orange">
                    {post.category}
                  </p>
                  <h2 className="mt-1.5 text-base font-medium text-ink-900 leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    <span className="mx-1">/</span>
                    {post.readingMinutes} min read
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

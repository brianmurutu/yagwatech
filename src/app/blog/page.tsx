import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { blogPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import AnimatedSection from "@/components/AnimatedSection";

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

function getBlogImage(category: string, slug: string): string {
  const c = category.toLowerCase();
  if (c.includes("cloud") || c.includes("infrastructure")) return "/images/blog-cloud.png";
  if (c.includes("security") || c.includes("cyber") || c.includes("managed")) return "/images/blog-cybersecurity.png";
  if (c.includes("startup") || c.includes("business") || c.includes("ai") || c.includes("technology")) return "/images/blog-startup.png";
  // Slug-based fallback
  if (slug.includes("cloud") || slug.includes("migration")) return "/images/blog-cloud.png";
  if (slug.includes("security") || slug.includes("cyber")) return "/images/blog-cybersecurity.png";
  return "/images/blog-startup.png";
}

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [featured, ...rest] = sorted;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Tech, business, and digital transformation, explained plainly"
        description="Practical articles written for business owners and teams navigating technology decisions in Kenya and beyond."
        breadcrumbs={[{ label: "Blog", href: "/blog" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          {/* Featured post */}
          {featured && (
            <AnimatedSection>
              <Link
                href={`/blog/${featured.slug}`}
                className="group mb-10 flex flex-col lg:flex-row rounded-2xl border border-black/5 bg-white overflow-hidden hover:shadow-2xl hover:shadow-black/8 transition-all hover:-translate-y-1"
              >
                <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden shrink-0">
                  <Image
                    src={getBlogImage(featured.category, featured.slug)}
                    alt={`${featured.title} — Yagwa Tech blog`}
                    fill
                    className="object-cover img-zoom"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-blueDark/30" />
                  <span className="absolute top-4 left-4 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white shadow">
                    Featured
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
                    {featured.category}
                  </span>
                  <h2 className="mt-2 text-2xl font-bold text-ink-900 leading-snug group-hover:text-brand-blue transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-400 line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-4 text-xs text-ink-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(featured.date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readingMinutes} min read
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-brand-blue">
                      Read article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          )}

          {/* Grid of remaining posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <AnimatedSection key={post.slug} type="scale" delay={i * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-black/5 bg-white overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={getBlogImage(post.category, post.slug)}
                      alt={`${post.title} — Yagwa Tech blog`}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/50 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2.5 py-1 text-[11px] font-semibold text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h2 className="text-base font-semibold text-ink-900 leading-snug group-hover:text-brand-blue transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-400 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-400 border-t border-black/5 pt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingMinutes} min
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-brand-blue font-semibold">
                        Read <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { blogPosts, getBlogPostBySlug, getRecentPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRecentPosts(post.slug, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-wrap">
          <div className="flex items-center gap-4 text-sm text-ink-400 mb-10 pb-6 border-b border-black/5">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingMinutes} min read
            </span>
            <span>By {post.author}</span>
          </div>

          <article className="max-w-2xl space-y-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-[15.5px] leading-[1.8] text-ink-900">
                {paragraph}
              </p>
            ))}
          </article>

          <div className="mt-12 max-w-2xl rounded-xl bg-ink-50 p-7 text-center">
            <h3 className="text-base font-medium text-ink-900">
              Need help with something like this?
            </h3>
            <p className="mt-2 text-sm text-ink-400">
              Our team is ready to talk through your specific situation.
            </p>
            <Link
              href="/get-quote"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-orange px-6 py-3 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
            >
              Get a free quote
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-black/5 pt-12">
              <h2 className="text-xl font-medium text-ink-900">More articles</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group rounded-xl border border-black/5 p-5 hover:border-brand-blue transition-colors"
                  >
                    <p className="text-xs font-medium text-brand-orange">{p.category}</p>
                    <h3 className="mt-1.5 text-sm font-medium text-ink-900 leading-snug">
                      {p.title}
                    </h3>
                    <span className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-blue">
                      Read article <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

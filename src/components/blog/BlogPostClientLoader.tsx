'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { BlogPost, getRecentPosts } from '@/lib/blog';

interface BlogPostClientLoaderProps {
  slug: string;
}

export default function BlogPostClientLoader({ slug }: BlogPostClientLoaderProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('yagwa_blog_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BlogPost[];
        const found = parsed.find((p) => p.slug === slug && p.status === 'Published');
        if (found) {
          setPost(found);
        }
      } catch (e) {
        console.error('Failed to load post from localStorage:', e);
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    notFound();
    return null;
  }

  const related = getRecentPosts(post.slug, 3);

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
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
              {post.readingMinutes || 5} min read
            </span>
            <span>By {post.author}</span>
          </div>

          <article className="max-w-2xl space-y-5">
            {Array.isArray(post.content) ? (
              post.content.map((paragraph, i) => (
                <p key={i} className="text-[15.5px] leading-[1.8] text-ink-900">
                  {paragraph}
                </p>
              ))
            ) : (
              <div
                className="prose max-w-none text-[15.5px] leading-[1.8] text-ink-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
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
                    <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-blue">
                      Read article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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

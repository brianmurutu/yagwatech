'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { BlogPost, blogPosts } from '@/lib/blog';
import BlogComments from '@/components/blog/BlogComments';
import BlogSidebar from '@/components/blog/BlogSidebar';

interface BlogPostClientLoaderProps {
  slug: string;
}

export default function BlogPostClientLoader({ slug }: BlogPostClientLoaderProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('yagwa_blog_posts');
    let allPosts = [...blogPosts];
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BlogPost[];
        const published = parsed.filter((p) => p.status === 'Published');
        if (published.length > 0) {
          // Merge static and dynamic, filtering out duplicates by slug
          const merged = [...published];
          blogPosts.forEach((staticPost) => {
            if (!merged.some((p) => p.slug === staticPost.slug)) {
              merged.push(staticPost);
            }
          });
          allPosts = merged;
        }
      } catch (e) {
        console.error('Failed to load post from localStorage:', e);
      }
    }

    // Sort by date descending
    allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const found = allPosts.find((p) => p.slug === slug);
    if (found) {
      setPost(found);
      const filteredRelated = allPosts
        .filter((p) => p.slug !== slug)
        .slice(0, 3);
      setRelated(filteredRelated);
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

      <section className="py-16 lg:py-20 bg-white">
        <div className="container-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main content column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Post meta */}
              <div className="flex items-center gap-4 text-sm text-ink-400 pb-6 border-b border-black/5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-brand-orange" />
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-brand-blue" />
                  {post.readingMinutes || 5} min read
                </span>
                <span>By {post.author}</span>
              </div>

              {/* Post content */}
              <article className="space-y-6">
                {Array.isArray(post.content) ? (
                  post.content.map((paragraph, i) => (
                    <p key={i} className="text-[15.5px] leading-[1.8] text-ink-800">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <div
                    className="prose max-w-none text-[15.5px] leading-[1.8] text-ink-800"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}
              </article>

              {/* Quick Quote CTA box */}
              <div className="rounded-2xl border border-black/5 bg-ink-50 p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-ink-900">
                    Need help implementing digital tools?
                  </h3>
                  <p className="mt-1 text-xs text-ink-400 leading-relaxed">
                    Our engineering and consulting team is ready to talk through your specific business challenges.
                  </p>
                </div>
                <Link
                  href="/get-quote"
                  className="mt-4 sm:mt-0 shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-orangeLight transition-all active:scale-95 shadow shadow-brand-orange/10"
                >
                  Get a free quote <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Interactive Commenting Section */}
              <BlogComments slug={post.slug} />

              {/* Related posts */}
              {related.length > 0 && (
                <div className="border-t border-black/5 pt-10">
                  <h4 className="text-lg font-bold text-ink-900">More Articles</h4>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="group rounded-2xl border border-black/5 p-5 hover:border-brand-blue hover:shadow-md transition-all bg-white"
                      >
                        <p className="text-[10px] font-semibold text-brand-orange uppercase tracking-wider">{p.category}</p>
                        <h5 className="mt-1 text-xs font-semibold text-ink-900 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                          {p.title}
                        </h5>
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue">
                          Read article <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar column */}
            <div className="lg:col-span-1">
              <BlogSidebar currentSlug={post.slug} />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

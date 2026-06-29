'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/blog';
import AnimatedSection from '@/components/AnimatedSection';

function getBlogImage(category: string, index: number): string {
  const c = category.toLowerCase();
  if (c.includes("cloud") || c.includes("infrastructure")) return "/images/blog-cloud.png";
  if (c.includes("security") || c.includes("cyber")) return "/images/blog-cybersecurity.png";
  if (c.includes("startup") || c.includes("business")) return "/images/blog-startup.png";
  const fallbacks = ["/images/blog-cloud.png", "/images/blog-cybersecurity.png", "/images/blog-startup.png"];
  return fallbacks[index % fallbacks.length];
}

interface HomeBlogSectionProps {
  initialPosts: BlogPost[];
}

export default function HomeBlogSection({ initialPosts }: HomeBlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  useEffect(() => {
    const saved = localStorage.getItem('yagwa_blog_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BlogPost[];
        // Filter out drafts
        const published = parsed.filter((p) => p.status === 'Published');
        if (published.length > 0) {
          // Sort published posts by date descending
          published.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          // Take the latest 3
          setPosts(published.slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load posts from localStorage:', e);
      }
    }
  }, []);

  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="container-wrap">
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            Insights
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink-900">
            Latest from our <span className="text-brand-blue">blog</span>
          </h2>
          <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
            Tech insights, business tips, and digital transformation stories written for
            people who build things.
          </p>
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <AnimatedSection key={post.slug} type="scale">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-xl border border-black/5 overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={post.featuredImage || getBlogImage(post.category, i)}
                    alt={`${post.title} — Yagwa Tech blog`}
                    fill
                    className="object-cover img-zoom"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/50 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col flex-1 bg-white p-4">
                  <h3 className="text-sm font-semibold text-ink-900 leading-snug group-hover:text-brand-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-auto pt-3 text-xs text-ink-400">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orangeLight transition-all hover:-translate-y-0.5 shadow-md shadow-brand-orange/20"
          >
            View all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

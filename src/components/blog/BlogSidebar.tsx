'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { blogPosts, getRecentPosts } from '@/lib/blog';

interface BlogSidebarProps {
  currentSlug: string;
}

export default function BlogSidebar({ currentSlug }: BlogSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const recentPosts = getRecentPosts(currentSlug, 3);

  // Extract all categories dynamically and count posts in each
  const categoryCounts = blogPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Extract all unique tags dynamically
  const tags = Array.from(
    new Set(
      blogPosts
        .map((p) => p.tags || '')
        .flatMap((t) => t.split(',').map((s) => s.trim()))
        .filter(Boolean)
    )
  ).slice(0, 10); // Display top 10 tags

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <aside className="space-y-8 lg:sticky lg:top-24">
      {/* Search Widget */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-bold text-ink-900 mb-3 flex items-center gap-2">
          <Search className="h-4 w-4 text-brand-orange" />
          Search Articles
        </h4>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Type keyword and enter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-xl border border-black/10 bg-ink-50 px-4 py-3 pr-10 outline-none focus:border-brand-blue focus:bg-white focus:ring-1 focus:ring-brand-blue/20 transition-all text-ink-900 placeholder:text-ink-300"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-400 hover:text-brand-blue transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-brand-orange" />
          Categories
        </h4>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center justify-between text-xs text-ink-600 hover:text-brand-blue py-1.5 border-b border-black/5 hover:border-brand-blue/20 transition-all"
              >
                <span>{cat.name}</span>
                <span className="rounded-full bg-ink-50 border border-black/5 px-2 py-0.5 text-[10px] font-semibold text-ink-400 group-hover:bg-brand-blue/10">
                  {cat.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts Widget */}
      {recentPosts.length > 0 && (
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h4 className="text-sm font-bold text-ink-900 mb-4">Recent Articles</h4>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block border-b border-black/5 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-[10px] font-semibold text-brand-orange uppercase tracking-wider">
                  {post.category}
                </span>
                <h5 className="mt-1 text-xs font-semibold text-ink-900 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                  {post.title}
                </h5>
                <span className="mt-1.5 block text-[10px] text-ink-300">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags Widget */}
      {tags.length > 0 && (
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h4 className="text-sm font-bold text-ink-900 mb-4 flex items-center gap-2">
            <Tag className="h-4 w-4 text-brand-orange" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="rounded-lg bg-ink-50 hover:bg-brand-blue/10 border border-black/5 hover:border-brand-blue/20 px-2.5 py-1.5 text-[10.5px] text-ink-600 hover:text-brand-blue font-medium transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Business Quote CTA Widget */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blueDark to-brand-blue p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 h-20 w-20 rounded-full bg-white/5" />
        <h4 className="text-base font-bold leading-snug">Need digital solutions built for your business?</h4>
        <p className="mt-2 text-xs text-white/80 leading-relaxed">
          From custom software development to fintech integrations and cybersecurity: we design systems that grow with you.
        </p>
        <Link
          href="/get-quote"
          className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-orange hover:bg-brand-orangeLight px-4 py-3 text-xs font-semibold text-white shadow shadow-brand-orange/20 transition-all hover:translate-y-[-1px] active:translate-y-0"
        >
          Get a free quote <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}

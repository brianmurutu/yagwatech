'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BlogPost } from '@/lib/blog';
import AnimatedSection from '@/components/AnimatedSection';

function getBlogImage(category: string, slug: string): string {
  const c = category.toLowerCase();
  if (c.includes("cloud") || c.includes("infrastructure")) return "/images/blog-cloud-migration.png";
  if (c.includes("security") || c.includes("cyber") || c.includes("managed")) return "/images/blog-cybersecurity.png";
  if (c.includes("startup") || c.includes("business") || c.includes("ai") || c.includes("technology")) return "/images/blog-ai-readiness.png";
  // Slug-based fallback
  if (slug.includes("cloud") || slug.includes("migration")) return "/images/blog-cloud-migration.png";
  if (slug.includes("security") || slug.includes("cyber")) return "/images/blog-cybersecurity.png";
  return "/images/blog-startup.png";
}

interface BlogListProps {
  initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);

  const activeSearch = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || '';
  const activeTag = searchParams.get('tag') || '';

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
          setPosts(published);
        }
      } catch (e) {
        console.error('Failed to load posts from localStorage:', e);
      }
    }
  }, []);

  // Filter posts based on query params
  const filteredPosts = posts.filter((post) => {
    if (activeCategory && post.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (activeTag) {
      const tagsList = (post.tags || '').split(',').map((t) => t.trim().toLowerCase());
      if (!tagsList.includes(activeTag.toLowerCase())) {
        return false;
      }
    }
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(q);
      const excerptMatch = (post.excerpt || '').toLowerCase().includes(q);
      const categoryMatch = post.category.toLowerCase().includes(q);
      const tagsMatch = (post.tags || '').toLowerCase().includes(q);
      
      let contentMatch = false;
      if (Array.isArray(post.content)) {
        contentMatch = post.content.some((p) => p.toLowerCase().includes(q));
      } else {
        contentMatch = post.content.toLowerCase().includes(q);
      }
      
      if (!titleMatch && !excerptMatch && !categoryMatch && !tagsMatch && !contentMatch) {
        return false;
      }
    }
    return true;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, activeCategory, activeTag]);

  const POSTS_PER_PAGE = 7;
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const featured = currentPage === 1 && filteredPosts.length > 0 ? filteredPosts[0] : undefined;
  const rest = currentPage === 1
    ? filteredPosts.slice(1, POSTS_PER_PAGE)
    : filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const clearFilters = () => {
    router.push('/blog');
  };

  return (
    <section className="py-20 lg:py-24">
      <div className="container-wrap">
        
        {/* Active Filters Bar */}
        {(activeCategory || activeTag || activeSearch) && (
          <div className="mb-10 p-5 rounded-2xl bg-ink-50 border border-black/5 flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
            <div className="text-xs sm:text-sm text-ink-600">
              Showing results for:{' '}
              {activeCategory && (
                <span className="font-semibold text-brand-blue">
                  Category &quot;{activeCategory}&quot;
                </span>
              )}
              {activeTag && (
                <span className="font-semibold text-brand-blue">
                  Tag &quot;{activeTag}&quot;
                </span>
              )}
              {activeSearch && (
                <span className="font-semibold text-brand-blue">
                  Search &quot;{activeSearch}&quot;
                </span>
              )}
              <span className="text-xs text-ink-400 ml-2 font-normal">
                ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found)
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orangeLight hover:underline transition-all"
            >
              Clear filters <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-black/5 bg-white p-8">
            <p className="text-ink-500 text-sm font-medium">No articles found matching your criteria.</p>
            <p className="text-ink-300 text-xs mt-1">Try refining your search terms or selecting another category.</p>
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-orangeLight transition-all active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <AnimatedSection>
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-10 flex flex-col lg:flex-row rounded-2xl border border-black/5 bg-white overflow-hidden hover:shadow-2xl hover:shadow-black/8 transition-all hover:-translate-y-1"
            >
              <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden shrink-0">
                <Image
                  src={featured.featuredImage || getBlogImage(featured.category, featured.slug)}
                  alt={`${featured.title} - Yagwa Tech blog`}
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
                  {featured.excerpt || (typeof featured.content === 'string' ? featured.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : featured.content[0])}
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
                    {featured.readingMinutes || 5} min read
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
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <AnimatedSection key={post.slug} type="scale" delay={i * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-black/5 bg-white overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={post.featuredImage || getBlogImage(post.category, post.slug)}
                      alt={`${post.title} - Yagwa Tech blog`}
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
                      {post.excerpt || (typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : post.content[0])}
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
                        {post.readingMinutes || 5} min
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
        )}

        {/* Pager / Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center gap-2 overflow-x-auto max-w-full no-scrollbar py-2 px-4 bg-white/50 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-black/5 text-ink-600 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:hover:border-black/5 disabled:hover:text-ink-600 transition-all shadow-sm active:scale-95"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center active:scale-95 ${
                      isActive
                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                        : 'bg-white border border-black/5 text-ink-600 hover:border-brand-blue hover:text-brand-blue hover:shadow-sm'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-black/5 text-ink-600 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:hover:border-black/5 disabled:hover:text-ink-600 transition-all shadow-sm active:scale-95"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}

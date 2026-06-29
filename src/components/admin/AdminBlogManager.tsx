'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Search, Edit2, Trash2, ArrowLeft, Save, Send, Tag, BookOpen,
  Sparkles, Globe, Laptop, Smartphone, Check, AlertTriangle,
  XCircle, Image, Info, Loader2,
} from 'lucide-react';

const AdminTinyMCEEditor = dynamic(() => import('./AdminTinyMCEEditor'), { ssr: false });

interface BlogPost {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  status: 'Published' | 'Draft';
  tags: string;
  content: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  featuredImage?: string;
}

// Slugification utility
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// HTML stripping utility
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

interface SEOCheckResult {
  title: string;
  passed: boolean;
  message: string;
  warning?: boolean;
}

// SEO Audit engine
const runSEOChecks = (
  title: string,
  content: string,
  slug: string,
  metaTitle: string,
  metaDescription: string,
  focusKeyword: string
) => {
  const checks: SEOCheckResult[] = [];
  const keyword = focusKeyword.trim().toLowerCase();
  const plainContent = stripHtml(content);
  const words = plainContent.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (!keyword) {
    checks.push({
      title: 'Focus Keyword',
      passed: false,
      message: 'Enter a focus keyword to run dynamic search engine optimization checks.',
      warning: true,
    });
  } else {
    // 1. Focus Keyword in Title
    const kwInTitle = metaTitle.toLowerCase().includes(keyword) || title.toLowerCase().includes(keyword);
    checks.push({
      title: 'Keyword in Title',
      passed: kwInTitle,
      message: kwInTitle
        ? 'Your focus keyword was found in the title!'
        : 'The focus keyword does not appear in the SEO title.',
    });

    // 2. Focus Keyword in Slug
    const formattedKwForSlug = keyword.replace(/\s+/g, '-');
    const kwInSlug = slug.toLowerCase().includes(formattedKwForSlug);
    checks.push({
      title: 'Keyword in URL Slug',
      passed: kwInSlug,
      message: kwInSlug
        ? 'Your focus keyword is present in the URL slug.'
        : 'The focus keyword is missing from the URL slug.',
    });

    // 3. Focus Keyword in Meta Description
    const kwInDesc = metaDescription.toLowerCase().includes(keyword);
    checks.push({
      title: 'Keyword in Meta Description',
      passed: kwInDesc,
      message: kwInDesc
        ? 'Your focus keyword was found in the meta description!'
        : 'The focus keyword does not appear in the meta description.',
    });

    // 4. Focus Keyword in Content
    const kwInContent = plainContent.toLowerCase().includes(keyword);
    checks.push({
      title: 'Keyword in Content',
      passed: kwInContent,
      message: kwInContent
        ? 'The focus keyword was found in the article body.'
        : 'The focus keyword does not appear in the article body.',
    });

    // 5. Keyword Density
    if (kwInContent && wordCount > 0) {
      const escapedKw = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = plainContent.toLowerCase().match(new RegExp(escapedKw, 'g'));
      const matchCount = matches ? matches.length : 0;
      const density = (matchCount / wordCount) * 100;
      const densityPassed = density >= 0.5 && density <= 2.5;
      checks.push({
        title: `Keyword Density (${density.toFixed(1)}%)`,
        passed: densityPassed,
        message: densityPassed
          ? 'Keyword density is perfect! (between 0.5% and 2.5%)'
          : `Keyword density is ${density.toFixed(1)}%. Ideal density is between 0.5% and 2.5% (${matchCount} occurrences).`,
      });
    } else {
      checks.push({
        title: 'Keyword Density',
        passed: false,
        message: 'Unable to calculate keyword density because keyword is not present in content.',
      });
    }
  }

  // 6. Content Word Count
  const countPassed = wordCount >= 300;
  checks.push({
    title: `Content Length (${wordCount} words)`,
    passed: countPassed,
    message: countPassed
      ? 'Great job! Content exceeds the recommended 300-word minimum.'
      : `Content contains ${wordCount} words. Try writing at least 300 words to make it search-friendly.`,
  });

  // 7. Heading Structure
  const hasHeadings = /<h[2-4][^>]*>/.test(content);
  checks.push({
    title: 'Subheadings (H2, H3)',
    passed: hasHeadings,
    message: hasHeadings
      ? 'Your content has H2 or H3 subheadings for structural readability.'
      : 'Consider adding some subheadings (H2/H3) to break up your content.',
  });

  // 8. Alt tags on images
  const imgMatches = content.match(/<img[^>]*>/g) || [];
  let altMissing = false;
  if (imgMatches.length > 0) {
    for (const img of imgMatches) {
      if (!/alt=["'][^"']+["']/.test(img)) {
        altMissing = true;
        break;
      }
    }
    checks.push({
      title: 'Image Alt Tags',
      passed: !altMissing,
      message: !altMissing
        ? 'All images in your content have descriptive Alt tags!'
        : 'One or more images in your content are missing Alt attributes.',
    });
  } else {
    checks.push({
      title: 'Images in Content',
      passed: true,
      message: 'No images found in content. (Good for text-only, but adding visual media helps engagement).',
    });
  }

  // Calculate score out of 100
  const totalWeight = checks.length * 10;
  const passedWeight = checks.filter(c => c.passed).length * 10;
  const score = totalWeight > 0 ? Math.round((passedWeight / totalWeight) * 100) : 0;

  return { checks, score };
};

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How Cloud Computing is Transforming Kenyan SMEs',
    author: 'Brian Murutu',
    category: 'Cloud',
    date: '2026-06-28',
    status: 'Published',
    tags: 'cloud, SME, Kenya, AWS',
    content: '<p>Cloud computing has become a game-changer for small and medium enterprises across Kenya. By shifting processing power and storage to remote web services, companies cut server costs and scale on demand.</p>',
    slug: 'how-cloud-computing-transforms-kenyan-smes',
    metaTitle: 'Cloud Computing Benefits for Kenyan SMEs | YagwaTech',
    metaDescription: 'Learn how Kenyan small and medium enterprises are adopting cloud systems to reduce operational costs, boost security, and scale computing power.',
    focusKeyword: 'cloud computing',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Cybersecurity Threats Facing East African Businesses in 2026',
    author: 'Grace Njeri',
    category: 'Security',
    date: '2026-06-25',
    status: 'Published',
    tags: 'cybersecurity, Africa, threats, ransomware',
    content: '<p>East African businesses are increasingly becoming targets of sophisticated cyber attacks. With the rapid digitization, ransomware incidents have doubled since last year.</p>',
    slug: 'cybersecurity-threats-facing-east-african-businesses-in-2026',
    metaTitle: '2026 Cybersecurity Threats in East Africa | YagwaTech',
    metaDescription: 'Ransomware, phishing, and data breaches are rising in East Africa. Discover key cybersecurity tactics to shield your enterprise systems.',
    focusKeyword: 'cybersecurity',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'The Rise of Mobile-First Development in Kenya',
    author: 'James Otieno',
    category: 'Technology',
    date: '2026-06-22',
    status: 'Draft',
    tags: 'mobile, development, Kenya, UX',
    content: '<p>With over 60% of internet traffic coming from mobile devices in Kenya, developers are shifting focus towards native-feeling web and mobile applications.</p>',
    slug: 'rise-of-mobile-first-development-in-kenya',
    metaTitle: 'Mobile-First Development Trends in Kenya | YagwaTech',
    metaDescription: 'Kenyan internet traffic is overwhelmingly mobile. Explore mobile-first design principles, responsive web apps, and native development trends.',
    focusKeyword: 'mobile-first',
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Building Scalable APIs for Africa\'s Growing Fintech Sector',
    author: 'Amina Wanjiku',
    category: 'Business',
    date: '2026-06-18',
    status: 'Published',
    tags: 'API, fintech, M-Pesa, scalability',
    content: '<p>The African fintech sector is booming, with Kenya leading innovation through M-Pesa integrations and open API protocols.</p>',
    slug: 'building-scalable-apis-for-african-fintech',
    metaTitle: 'Fintech API Integration and Scalability | YagwaTech',
    metaDescription: 'A technical guide on designing high-throughput, secure, and developer-friendly APIs for M-Pesa payments and African financial systems.',
    focusKeyword: 'fintech',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'AI and Machine Learning Adoption Trends in East Africa',
    author: 'David Mwangi',
    category: 'Innovation',
    date: '2026-06-14',
    status: 'Published',
    tags: 'AI, machine learning, East Africa, innovation',
    content: '<p>Artificial Intelligence is gradually reshaping industries across East Africa, from smart farming to clinical diagnosis assistants.</p>',
    slug: 'ai-and-machine-learning-adoption-trends-in-east-africa',
    metaTitle: 'Artificial Intelligence Trends in East Africa | YagwaTech',
    metaDescription: 'From automated agricultural insights to digital health assistants, discover how machine learning technologies are deployed in Kenya and beyond.',
    focusKeyword: 'artificial intelligence',
    featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
  },
];

const CATEGORIES = ['Technology', 'Business', 'Security', 'Cloud', 'Innovation'];

const emptyPost = (): Omit<BlogPost, 'id'> => ({
  title: '',
  author: '',
  category: 'Technology',
  date: new Date().toISOString().slice(0, 10),
  status: 'Draft',
  tags: '',
  content: '',
  slug: '',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  featuredImage: '',
});

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);

  // Load posts from localStorage on mount (hydration safe)
  useEffect(() => {
    const saved = localStorage.getItem('yagwa_blog_posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load posts from localStorage:', e);
      }
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('yagwa_blog_posts', JSON.stringify(posts));
  }, [posts]);

  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>(emptyPost());
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // SEO Dashboard tabs state
  const [seoTab, setSeoTab] = useState<'meta' | 'checklist' | 'social'>('meta');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [socialPlatform, setSocialPlatform] = useState<'fb' | 'x'>('fb');

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File is too large. Max size is 5MB.', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, featuredImage: data.url }));
      showToast('Featured image uploaded successfully!');
    } catch (err: any) {
      console.error('Image upload failed, falling back to local base64:', err);
      
      // Fallback to Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, featuredImage: event.target!.result as string }));
          showToast('Uploaded offline as Base64 (Server upload not available)', 'success');
        } else {
          showToast('Failed to process image file.', 'error');
        }
      };
      reader.onerror = () => {
        showToast('Error reading image file.', 'error');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be uploaded again if removed
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNew = () => {
    setEditingPost(null);
    setFormData(emptyPost());
    setView('editor');
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      author: post.author,
      category: post.category,
      date: post.date,
      status: post.status,
      tags: post.tags,
      content: post.content,
      slug: post.slug || slugify(post.title),
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || stripHtml(post.content).slice(0, 155),
      focusKeyword: post.focusKeyword || '',
      featuredImage: post.featuredImage || '',
    });
    setView('editor');
  };

  const handleSave = (publishStatus: 'Draft' | 'Published') => {
    if (!formData.title.trim()) { showToast('Title is required', 'error'); return; }
    const finalData = {
      ...formData,
      status: publishStatus,
      slug: formData.slug || slugify(formData.title),
      metaTitle: formData.metaTitle || formData.title,
      metaDescription: formData.metaDescription || stripHtml(formData.content).slice(0, 155),
    };
    if (editingPost) {
      setPosts((prev) => prev.map((p) => p.id === editingPost.id ? { ...p, ...finalData } : p));
      showToast('Post updated successfully');
    } else {
      const newPost: BlogPost = { id: Date.now().toString(), ...finalData };
      setPosts((prev) => [newPost, ...prev]);
      showToast('Post created successfully');
    }
    setView('list');
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
    showToast('Post deleted');
  };

  const handleContentChange = useCallback((content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg animate-fade-in ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-base font-bold text-ink-900 mb-2">Delete Post?</h3>
            <p className="text-sm text-ink-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-ink-400 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIST VIEW ──────────────────────────────────── */}
      {view === 'list' && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-ink-900">Blog Manager</h1>
              <p className="text-sm text-ink-400 mt-1">{posts.length} total posts</p>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <Plus className="w-4 h-4" /> New Post
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title, author or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide">Title</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide hidden md:table-cell">Author</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide hidden lg:table-cell">Category</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide hidden sm:table-cell">Date</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-ink-900 line-clamp-1">{post.title}</p>
                            <p className="text-xs text-ink-400 mt-0.5 md:hidden">{post.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-ink-400 hidden md:table-cell">{post.author}</td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{post.category}</span>
                      </td>
                      <td className="px-5 py-4 text-ink-400 hidden sm:table-cell">{post.date}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            post.status === 'Published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(post)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-brand-blue transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(post.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-ink-400">
                        No posts match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── EDITOR VIEW ────────────────────────────────── */}
      {view === 'editor' && (
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-ink-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to posts
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              {editingPost ? 'Edit Post' : 'New Post'}
            </h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main editor area */}
            <div className="xl:col-span-2 space-y-6">
              {/* Core Editor Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1.5">Post Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData((p) => {
                        const updated = { ...p, title: newTitle };
                        if (!p.slug || p.slug === slugify(p.title)) {
                          updated.slug = slugify(newTitle);
                        }
                        if (!p.metaTitle || p.metaTitle === p.title) {
                          updated.metaTitle = newTitle;
                        }
                        return updated;
                      });
                    }}
                    placeholder="Enter a compelling post title…"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1.5">Content</label>
                  <AdminTinyMCEEditor value={formData.content} onChange={handleContentChange} height={400} />
                </div>
              </div>

              {/* SEO OPTIMIZER DASHBOARD */}
              {(() => {
                const { checks: seoChecks, score: seoScore } = runSEOChecks(
                  formData.title,
                  formData.content,
                  formData.slug || '',
                  formData.metaTitle || '',
                  formData.metaDescription || '',
                  formData.focusKeyword || ''
                );

                const getScoreColor = (val: number) => {
                  if (val < 50) return 'text-red-500 stroke-red-500 border-red-200 bg-red-50/50';
                  if (val < 80) return 'text-amber-500 stroke-amber-500 border-amber-200 bg-amber-50/50';
                  return 'text-green-600 stroke-green-600 border-green-200 bg-green-50/50';
                };

                const getScoreStrokeColor = (val: number) => {
                  if (val < 50) return '#EF4444';
                  if (val < 80) return '#F59E0B';
                  return '#16A34A';
                };

                const getScoreLabel = (val: number) => {
                  if (val < 50) return 'Needs Work';
                  if (val < 80) return 'Acceptable';
                  return 'Excellent SEO';
                };

                const titleLength = formData.metaTitle?.length || 0;
                const descLength = formData.metaDescription?.length || 0;

                const titlePct = Math.min((titleLength / 60) * 100, 100);
                const descPct = Math.min((descLength / 160) * 100, 100);

                const getTitleProgressColor = (len: number) => {
                  if (len < 40) return 'bg-amber-500';
                  if (len <= 60) return 'bg-green-500';
                  return 'bg-red-500';
                };

                const getDescProgressColor = (len: number) => {
                  if (len < 120) return 'bg-amber-500';
                  if (len <= 160) return 'bg-green-500';
                  return 'bg-red-500';
                };

                return (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header with SEO Score Ring */}
                    <div className="border-b border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-inner border border-gray-100">
                          <svg className="w-full h-full transform -rotate-90 p-1">
                            <circle
                              cx="24"
                              cy="24"
                              r="18"
                              className="stroke-gray-100"
                              strokeWidth="3.5"
                              fill="transparent"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="18"
                              stroke={getScoreStrokeColor(seoScore)}
                              strokeWidth="3.5"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 18}
                              strokeDashoffset={2 * Math.PI * 18 * (1 - seoScore / 100)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-sm font-bold text-ink-900">{seoScore}</span>
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-ink-900 flex items-center gap-1.5">
                            Real-time SEO Optimizer <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                          </h2>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getScoreColor(seoScore)}`}>
                              {getScoreLabel(seoScore)}
                            </span>
                            <span className="text-xs text-ink-400">Score updates instantly as you write</span>
                          </div>
                        </div>
                      </div>

                      {/* Tab Selectors */}
                      <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setSeoTab('meta')}
                          className={`px-3 py-1.5 rounded-lg transition-all ${
                            seoTab === 'meta' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-900'
                          }`}
                        >
                          Google Snippet
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeoTab('checklist')}
                          className={`px-3 py-1.5 rounded-lg transition-all ${
                            seoTab === 'checklist' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-900'
                          }`}
                        >
                          Checklist
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeoTab('social')}
                          className={`px-3 py-1.5 rounded-lg transition-all ${
                            seoTab === 'social' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-900'
                          }`}
                        >
                          Social Preview
                        </button>
                      </div>
                    </div>

                    {/* Tab contents */}
                    <div className="p-5">
                      {/* TAB 1: SEARCH PREVIEW & META */}
                      {seoTab === 'meta' && (
                        <div className="space-y-5">
                          {/* Focus Keyword */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">
                              Focus Keyword
                            </label>
                            <input
                              type="text"
                              value={formData.focusKeyword}
                              onChange={(e) => setFormData(p => ({ ...p, focusKeyword: e.target.value }))}
                              placeholder="e.g. cloud computing"
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                            />
                            <p className="text-[11px] text-ink-400 mt-1">
                              Define the core search phrase to run advanced density and checklist analysis.
                            </p>
                          </div>

                          {/* Mock Google Snippet Card */}
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                              <span className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-brand-blue" /> Search Engine Snippet Preview
                              </span>
                              <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 text-[10px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => setPreviewMode('desktop')}
                                  className={`px-2 py-1 rounded flex items-center gap-1 ${
                                    previewMode === 'desktop' ? 'bg-gray-100 text-ink-900' : 'text-ink-400'
                                  }`}
                                >
                                  <Laptop className="w-3 h-3" /> Desktop
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPreviewMode('mobile')}
                                  className={`px-2 py-1 rounded flex items-center gap-1 ${
                                    previewMode === 'mobile' ? 'bg-gray-100 text-ink-900' : 'text-ink-400'
                                  }`}
                                >
                                  <Smartphone className="w-3 h-3" /> Mobile
                                </button>
                              </div>
                            </div>

                            {/* Actual Preview Mockup */}
                            {previewMode === 'desktop' ? (
                              <div className="bg-white border border-gray-200/60 rounded-xl p-4 font-sans text-left space-y-1 shadow-sm">
                                <div className="text-[12px] text-[#202124] truncate">
                                  yagwatech.co.ke › blog › <span className="text-[#5f6368]">{formData.slug || 'how-cloud-computing-transforms-kenyan-smes'}</span>
                                </div>
                                <div className="text-[19px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
                                  {formData.metaTitle || formData.title || 'Draft Article Preview'}
                                </div>
                                <div className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                                  {formData.metaDescription || (formData.content ? stripHtml(formData.content).slice(0, 155) : 'Write a meta description to control what users see in organic search listings.')}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white border border-gray-200/60 rounded-xl p-3 font-sans text-left space-y-1.5 shadow-sm max-w-sm mx-auto">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-[10px] text-white font-bold">YT</div>
                                  <div className="text-[12px] leading-tight">
                                    <p className="font-semibold text-ink-950">YagwaTech</p>
                                    <p className="text-[#5f6368] text-[10px] truncate">yagwatech.co.ke/blog/{formData.slug || 'slug'}</p>
                                  </div>
                                </div>
                                <div className="text-[16px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-2">
                                  {formData.metaTitle || formData.title || 'Draft Article Preview'}
                                </div>
                                <div className="text-[12px] text-[#4d5156] leading-snug line-clamp-3">
                                  {formData.metaDescription || (formData.content ? stripHtml(formData.content).slice(0, 155) : 'Write a meta description to control what users see in organic search listings.')}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* SEO Inputs */}
                          <div className="space-y-4">
                            {/* Meta Title */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-semibold text-ink-900">SEO Title</label>
                                <span className={`text-[10px] font-bold ${titleLength >= 40 && titleLength <= 60 ? 'text-green-600' : 'text-amber-500'}`}>
                                  {titleLength} / 60 chars (Recommended: 40-60)
                                </span>
                              </div>
                              <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData(p => ({ ...p, metaTitle: e.target.value }))}
                                placeholder="Customize SEO Title..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                              />
                              <div className="w-full bg-gray-150 h-1.5 rounded-full overflow-hidden mt-1.5">
                                <div
                                  className={`h-full transition-all duration-300 ${getTitleProgressColor(titleLength)}`}
                                  style={{ width: `${titlePct}%` }}
                                />
                              </div>
                            </div>

                            {/* URL Slug */}
                            <div>
                              <label className="block text-xs font-semibold text-ink-900 mb-1">URL Slug</label>
                              <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData(p => ({ ...p, slug: slugify(e.target.value) }))}
                                placeholder="post-url-slug"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                              />
                            </div>

                            {/* Meta Description */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-semibold text-ink-900">Meta Description</label>
                                <span className={`text-[10px] font-bold ${descLength >= 120 && descLength <= 160 ? 'text-green-600' : 'text-amber-500'}`}>
                                  {descLength} / 160 chars (Recommended: 120-160)
                                </span>
                              </div>
                              <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData(p => ({ ...p, metaDescription: e.target.value }))}
                                placeholder="Write a short summary for search snippets..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
                              />
                              <div className="w-full bg-gray-150 h-1.5 rounded-full overflow-hidden mt-1.5">
                                <div
                                  className={`h-full transition-all duration-300 ${getDescProgressColor(descLength)}`}
                                  style={{ width: `${descPct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: CHECKLIST */}
                      {seoTab === 'checklist' && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                            SEO Checklist Analysis
                          </h4>
                          <div className="divide-y divide-gray-100">
                            {seoChecks.map((check, idx) => (
                              <div key={idx} className="py-2.5 flex items-start gap-3">
                                {check.passed ? (
                                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5 bg-green-50 rounded-full p-0.5 border border-green-200" />
                                ) : check.warning ? (
                                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 bg-amber-50 rounded-full p-0.5 border border-amber-200" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 bg-red-50 rounded-full p-0.5 border border-red-200" />
                                )}
                                <div className="text-xs">
                                  <p className="font-semibold text-ink-900">{check.title}</p>
                                  <p className="text-ink-400 mt-0.5">{check.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TAB 3: SOCIAL PREVIEW */}
                      {seoTab === 'social' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="text-xs font-bold text-ink-900">Social Media Cards Preview</span>
                            <div className="flex bg-gray-100 rounded-lg p-0.5 text-[10px] font-bold">
                              <button
                                type="button"
                                onClick={() => setSocialPlatform('fb')}
                                className={`px-2 py-1 rounded flex items-center gap-1.5 ${
                                  socialPlatform === 'fb' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400'
                                }`}
                              >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/>
                                </svg>
                                Facebook
                              </button>
                              <button
                                type="button"
                                onClick={() => setSocialPlatform('x')}
                                className={`px-2 py-1 rounded flex items-center gap-1.5 ${
                                  socialPlatform === 'x' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400'
                                }`}
                              >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                X (Twitter)
                              </button>
                            </div>
                          </div>

                          {/* Social card wrapper */}
                          {socialPlatform === 'fb' ? (
                            <div className="max-w-sm mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white font-sans text-left text-xs">
                              {/* Header */}
                              <div className="p-3 flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-[11px]">YT</div>
                                <div>
                                  <p className="font-bold text-ink-950">YagwaTech</p>
                                  <p className="text-ink-400 text-[10px]">Just now · 🌐</p>
                                </div>
                              </div>
                              {/* Caption */}
                              <p className="px-3 pb-2 text-ink-900">
                                Check out our latest post on {formData.category}!
                              </p>
                              {/* Card Image */}
                              <div className="aspect-video bg-gray-100 relative overflow-hidden border-y border-gray-200">
                                {formData.featuredImage ? (
                                  <img src={formData.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-ink-300">
                                    <Image className="w-8 h-8 mb-1" />
                                    <p className="text-[10px]">No Featured Image uploaded</p>
                                  </div>
                                )}
                              </div>
                              {/* Footer content */}
                              <div className="p-3 bg-gray-50 space-y-1">
                                <p className="text-[10px] text-ink-400 uppercase tracking-wide">YAGWATECH.CO.KE</p>
                                <p className="font-bold text-ink-900 leading-snug line-clamp-1">
                                  {formData.metaTitle || formData.title || 'Draft Article Title'}
                                </p>
                                <p className="text-[11px] text-ink-400 line-clamp-2">
                                  {formData.metaDescription || (formData.content ? stripHtml(formData.content).slice(0, 155) : 'Write a meta description to fill this snippet.')}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="max-w-sm mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white font-sans text-left text-xs">
                              {/* Large Image Layout */}
                              <div className="aspect-video bg-gray-100 relative overflow-hidden border-b border-gray-100">
                                {formData.featuredImage ? (
                                  <img src={formData.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-ink-300">
                                    <Image className="w-8 h-8 mb-1" />
                                    <p className="text-[10px]">No Featured Image uploaded</p>
                                  </div>
                                )}
                              </div>
                              {/* Footer text */}
                              <div className="p-3 space-y-1 border-t border-gray-200">
                                <p className="text-[10px] text-[#536471]">🔗 yagwatech.co.ke</p>
                                <p className="font-bold text-ink-950 leading-snug line-clamp-1">
                                  {formData.metaTitle || formData.title || 'Draft Article Title'}
                                </p>
                                <p className="text-[11px] text-[#536471] line-clamp-2">
                                  {formData.metaDescription || (formData.content ? stripHtml(formData.content).slice(0, 155) : 'Write a meta description to fill this snippet.')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Publish card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <h3 className="text-sm font-bold text-ink-900">Publish</h3>
                <div>
                  <label className="block text-xs font-semibold text-ink-400 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as 'Draft' | 'Published' }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => handleSave('Draft')}
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-ink-900 hover:bg-gray-50 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Draft
                  </button>
                  <button
                    onClick={() => handleSave('Published')}
                    className="flex items-center justify-center gap-2 py-2.5 bg-brand-blue hover:bg-brand-blueLight text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    <Send className="w-4 h-4" /> Publish
                  </button>
                </div>
              </div>

              {/* Featured Image upload placeholder card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-ink-900">Featured Image</h3>
                  {!formData.featuredImage && !isUploading && (
                    <button
                      type="button"
                      onClick={() => {
                        const mockImages = [
                          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
                          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'
                        ];
                        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
                        setFormData(p => ({ ...p, featuredImage: randomImage }));
                      }}
                      className="text-[10px] text-brand-orange hover:text-brand-orangeDark font-bold transition-colors"
                    >
                      Use Demo Image
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {isUploading ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50 flex flex-col items-center justify-center min-h-[144px]">
                    <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-2" />
                    <p className="text-xs font-semibold text-ink-900">Uploading image...</p>
                    <p className="text-[10px] text-ink-400 mt-1">Please wait</p>
                  </div>
                ) : formData.featuredImage ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img
                        src={formData.featuredImage}
                        alt="Featured preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setFormData(p => ({ ...p, featuredImage: '' }))}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition-all"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-ink-400 text-center truncate">{formData.featuredImage}</p>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-blue/50 hover:bg-blue-50/20 transition-all cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-2 border border-gray-100 group-hover:bg-blue-50 transition-all">
                      <Plus className="w-5 h-5 text-ink-400 group-hover:text-brand-blue" />
                    </div>
                    <p className="text-xs font-semibold text-ink-900">Upload featured image</p>
                    <p className="text-[10px] text-ink-400 mt-1">PNG, JPG or WEBP up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Meta card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <h3 className="text-sm font-bold text-ink-900">Post Details</h3>
                <div>
                  <label className="block text-xs font-semibold text-ink-400 mb-1.5">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
                    placeholder="Author name"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-400 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-400 mb-1.5">
                    <div className="flex items-center gap-1"><Tag className="w-3 h-3" /> Tags (comma-separated)</div>
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="cloud, Kenya, technology"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-400 mb-1.5">Publish Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

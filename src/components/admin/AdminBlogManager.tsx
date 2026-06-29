'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Search, Edit2, Trash2, ArrowLeft, Save, Send, Tag, BookOpen,
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
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How Cloud Computing is Transforming Kenyan SMEs',
    author: 'Brian Murutu',
    category: 'Cloud',
    date: '2026-06-28',
    status: 'Published',
    tags: 'cloud, SME, Kenya, AWS',
    content: '<p>Cloud computing has become a game-changer for small and medium enterprises across Kenya...</p>',
  },
  {
    id: '2',
    title: 'Cybersecurity Threats Facing East African Businesses in 2026',
    author: 'Grace Njeri',
    category: 'Security',
    date: '2026-06-25',
    status: 'Published',
    tags: 'cybersecurity, Africa, threats, ransomware',
    content: '<p>East African businesses are increasingly becoming targets of sophisticated cyber attacks...</p>',
  },
  {
    id: '3',
    title: 'The Rise of Mobile-First Development in Kenya',
    author: 'James Otieno',
    category: 'Technology',
    date: '2026-06-22',
    status: 'Draft',
    tags: 'mobile, development, Kenya, UX',
    content: '<p>With over 60% of internet traffic coming from mobile devices in Kenya...</p>',
  },
  {
    id: '4',
    title: 'Building Scalable APIs for Africa\'s Growing Fintech Sector',
    author: 'Amina Wanjiku',
    category: 'Business',
    date: '2026-06-18',
    status: 'Published',
    tags: 'API, fintech, M-Pesa, scalability',
    content: '<p>The African fintech sector is booming, with Kenya leading innovation through M-Pesa integrations...</p>',
  },
  {
    id: '5',
    title: 'AI and Machine Learning Adoption Trends in East Africa',
    author: 'David Mwangi',
    category: 'Innovation',
    date: '2026-06-14',
    status: 'Published',
    tags: 'AI, machine learning, East Africa, innovation',
    content: '<p>Artificial Intelligence is gradually reshaping industries across East Africa, from agriculture to healthcare...</p>',
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
});

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>(emptyPost());
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    setFormData({ title: post.title, author: post.author, category: post.category, date: post.date, status: post.status, tags: post.tags, content: post.content });
    setView('editor');
  };

  const handleSave = (publishStatus: 'Draft' | 'Published') => {
    if (!formData.title.trim()) { showToast('Title is required', 'error'); return; }
    const data = { ...formData, status: publishStatus };
    if (editingPost) {
      setPosts((prev) => prev.map((p) => p.id === editingPost.id ? { ...p, ...data } : p));
      showToast('Post updated successfully');
    } else {
      const newPost: BlogPost = { id: Date.now().toString(), ...data };
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
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1.5">Post Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Enter a compelling post title…"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1.5">Content</label>
                  <AdminTinyMCEEditor value={formData.content} onChange={handleContentChange} height={500} />
                </div>
              </div>
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

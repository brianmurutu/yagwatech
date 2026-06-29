'use client';

import { useState } from 'react';
import { Image as ImageIcon, Upload, Search, Link as LinkIcon, Trash2, X, Copy, Check } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'Blog' | 'Portfolio' | 'Team' | 'Uncategorized';
  size: string;
  dimensions: string;
  uploadedAt: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  { id: '1', name: 'about-office.png', url: '/images/about-office.png', category: 'Portfolio', size: '848 KB', dimensions: '1200 x 800', uploadedAt: '2026-06-20' },
  { id: '2', name: 'blog-cloud.png', url: '/images/blog-cloud.png', category: 'Blog', size: '912 KB', dimensions: '800 x 500', uploadedAt: '2026-06-25' },
  { id: '3', name: 'blog-cybersecurity.png', url: '/images/blog-cybersecurity.png', category: 'Blog', size: '1 MB', dimensions: '800 x 500', uploadedAt: '2026-06-27' },
  { id: '4', name: 'blog-startup.png', url: '/images/blog-startup.png', category: 'Blog', size: '867 KB', dimensions: '800 x 500', uploadedAt: '2026-06-28' },
  { id: '5', name: 'hero-bg.png', url: '/images/hero-bg.png', category: 'Portfolio', size: '882 KB', dimensions: '1920 x 1080', uploadedAt: '2026-06-15' },
  { id: '6', name: 'portfolio-branding.png', url: '/images/portfolio-branding.png', category: 'Portfolio', size: '852 KB', dimensions: '900 x 600', uploadedAt: '2026-06-18' },
  { id: '7', name: 'portfolio-community.png', url: '/images/portfolio-community.png', category: 'Portfolio', size: '927 KB', dimensions: '900 x 600', uploadedAt: '2026-06-18' },
  { id: '8', name: 'portfolio-development.png', url: '/images/portfolio-development.png', category: 'Portfolio', size: '682 KB', dimensions: '900 x 600', uploadedAt: '2026-06-18' },
  { id: '9', name: 'reviewer_david.jpg', url: '/images/reviewer_david.jpg', category: 'Team', size: '10 KB', dimensions: '150 x 150', uploadedAt: '2026-06-10' },
  { id: '10', name: 'reviewer_grace.jpg', url: '/images/reviewer_grace.jpg', category: 'Team', size: '10.3 KB', dimensions: '150 x 150', uploadedAt: '2026-06-10' },
  { id: '11', name: 'reviewer_samuel.jpg', url: '/images/reviewer_samuel.jpg', category: 'Team', size: '9.4 KB', uploadedAt: '2026-06-10', dimensions: '150 x 150' }
];

export default function AdminMediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const categories = ['All', 'Blog', 'Portfolio', 'Team', 'Uncategorized'];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      setMedia(media.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      showToast('Media item deleted');
    }
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newItem: MediaItem = {
        id: (media.length + 1).toString(),
        name: file.name,
        url: `/images/${file.name.toLowerCase().replace(/\s+/g, '-')}`,
        category: 'Uncategorized',
        size: `${Math.round(file.size / 1024)} KB`,
        dimensions: '800 x 600',
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      setMedia([newItem, ...media]);
      showToast('File uploaded successfully (Simulated)');
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-55 bg-ink-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Media Library</h1>
          <p className="text-sm text-ink-400">Upload and manage visual assets for the website and blog posts</p>
        </div>

        <div>
          <label className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeDark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md shadow-brand-orange/15 cursor-pointer">
            <Upload className="w-4 h-4" /> Upload Asset
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSimulateUpload}
            />
          </label>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 w-full md:w-auto">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-brand-blue/10 text-brand-blue ring-1 ring-brand-blue/20'
                  : 'text-ink-400 hover:bg-ink-50/50 hover:text-ink-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by name..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl py-16 text-center text-ink-400 border border-black/5 shadow-sm">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-ink-900">No media assets found</p>
            <p className="text-xs text-ink-400 mt-1">Try uploading a new image or searching a different term</p>
          </div>
        ) : (
          filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
                selectedItem?.id === item.id ? 'ring-2 ring-brand-orange border-transparent' : 'border-black/5'
              }`}
            >
              <div className="relative aspect-video bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-ink-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="bg-white/90 text-ink-900 text-[10px] font-bold px-2 py-1 rounded-md">View details</span>
                </div>
              </div>
              <div className="p-3">
                <div className="font-semibold text-xs text-ink-900 truncate" title={item.name}>{item.name}</div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-400">{item.category}</span>
                  <span className="text-[10px] text-gray-400">{item.size}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Side Drawer/Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-ink-900/60 backdrop-blur-sm flex items-center justify-end p-4">
          <div className="bg-white h-full max-h-[90vh] sm:max-h-none sm:h-full w-full max-w-md rounded-2xl sm:rounded-r-none sm:rounded-l-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-down">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blueDark to-brand-blue px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-md font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-orange" />
                Asset Details
              </h2>
              <button onClick={() => setSelectedItem(null)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Preview */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 aspect-video overflow-hidden flex items-center justify-center">
                <img src={selectedItem.url} alt={selectedItem.name} className="max-w-full max-h-full object-contain" />
              </div>

              {/* Specs */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-400">File Name</label>
                  <p className="font-semibold text-sm text-ink-900 break-all">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-400">File Type / Category</label>
                  <p className="font-semibold text-sm text-ink-900">{selectedItem.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Dimensions</label>
                    <p className="font-semibold text-sm text-ink-900">{selectedItem.dimensions}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ink-400">File Size</label>
                    <p className="font-semibold text-sm text-ink-900">{selectedItem.size}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Upload Date</label>
                  <p className="font-semibold text-sm text-ink-900">{selectedItem.uploadedAt}</p>
                </div>

                {/* File Link */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Absolute URL</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={selectedItem.url}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyLink(selectedItem.url)}
                      className="px-3 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center transition-colors"
                      title="Copy URL"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-ink-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50">
              <button
                onClick={() => handleCopyLink(selectedItem.url)}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blueLight text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <LinkIcon className="w-4 h-4" /> Copy URL
              </button>
              <button
                onClick={() => handleDelete(selectedItem.id)}
                className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-red-100"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

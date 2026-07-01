'use client';

import { useState, useEffect } from 'react';
import { Pin, Plus, X, Bell, Megaphone, AlertTriangle, Info, CheckCircle } from 'lucide-react';

type Category = 'General' | 'HR' | 'Technical' | 'Event' | 'Urgent';

interface Announcement {
  id: number;
  title: string;
  body: string;
  author: string;
  date: string;
  pinned: boolean;
  category: Category;
}

const categoryStyle: Record<Category, { badge: string; Icon: React.ElementType }> = {
  General: { badge: 'bg-[#0B3D91]/10 text-[#0B3D91]', Icon: Bell },
  HR: { badge: 'bg-purple-100 text-purple-600', Icon: Info },
  Technical: { badge: 'bg-blue-100 text-blue-600', Icon: CheckCircle },
  Event: { badge: 'bg-green-100 text-green-600', Icon: Megaphone },
  Urgent: { badge: 'bg-red-100 text-red-600', Icon: AlertTriangle },
};

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: '🏖️ Office Closure — Mashujaa Day Holiday',
    body: 'The office will be closed on Monday, October 20th, 2024 in observance of Mashujaa Day. All client engagements should be rescheduled accordingly. Enjoy the long weekend!',
    author: 'Mercy Akinyi (HR)',
    date: '2024-07-10',
    pinned: true,
    category: 'HR',
  },
  {
    id: 2,
    title: '🔒 Mandatory Security Training — All Staff',
    body: 'All employees are required to complete the 2024 Cybersecurity Awareness Training by July 31st. Log in to the LMS at training.yagwatech.com. Completion is mandatory for access renewal.',
    author: 'Peter Njoroge (Security)',
    date: '2024-07-08',
    pinned: true,
    category: 'Urgent',
  },
  {
    id: 3,
    title: '🎉 Welcome Amina Ochieng — New Junior Developer',
    body: 'Please join us in welcoming Amina Ochieng to the engineering team! Amina joins us from USIU-A and will be working on the mobile applications team. Welcome aboard, Amina!',
    author: 'Lydia Mwangi (PM)',
    date: '2024-07-05',
    pinned: false,
    category: 'General',
  },
  {
    id: 4,
    title: '📦 New AWS Infrastructure — Migration Complete',
    body: 'The cloud migration to AWS East Africa region is now complete. All production workloads have been successfully migrated. Latency improvements of 40% have been recorded for Kenyan clients.',
    author: 'James Odhiambo (DevOps)',
    date: '2024-07-02',
    pinned: false,
    category: 'Technical',
  },
  {
    id: 5,
    title: '🏆 Q2 All-Hands Meeting — Save the Date',
    body: 'Our Q2 All-Hands review and team lunch will be held on Friday, July 26th at 2:00 PM at the Karen office. Attendance is strongly encouraged. Agenda to be shared by end of week.',
    author: 'Brian Murutu (CEO)',
    date: '2024-06-28',
    pinned: false,
    category: 'Event',
  },
];

export default function PortalAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'General' as Category });

  useEffect(() => {
    const saved = localStorage.getItem('yagwa_announcements');
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load announcements:', e);
      }
    } else {
      setAnnouncements(initialAnnouncements);
      localStorage.setItem('yagwa_announcements', JSON.stringify(initialAnnouncements));
    }
  }, []);

  const togglePin = (id: number) => {
    const updated = announcements.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a));
    setAnnouncements(updated);
    localStorage.setItem('yagwa_announcements', JSON.stringify(updated));
  };

  const deleteAnnouncement = (id: number) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('yagwa_announcements', JSON.stringify(updated));
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const newAnnouncement: Announcement = {
      id: Date.now(),
      ...form,
      author: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      pinned: false,
    };
    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('yagwa_announcements', JSON.stringify(updated));
    setForm({ title: '', body: '', category: 'General' });
    setShowForm(false);
  };

  const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A2E]">Announcements</h3>
          <p className="text-sm text-[#5A6680]">
            {announcements.filter((a) => a.pinned).length} pinned · {announcements.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#0B3D91] hover:bg-[#1A56C4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-[#0B3D91]/25"
        >
          <Plus className="w-4 h-4" />
          Post Announcement
        </button>
      </div>

      {/* New Announcement Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-[#0B3D91]/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-[#1A1A2E]">New Announcement</h4>
            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-[#5A6680]" />
            </button>
          </div>
          <form onSubmit={handlePost} className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Announcement title…"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
            />
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write the announcement body here…"
              rows={4}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all resize-none"
            />
            <div className="flex gap-3">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 bg-white"
              >
                {(['General', 'HR', 'Technical', 'Event', 'Urgent'] as Category[]).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F47B20] text-white text-sm font-semibold rounded-xl hover:bg-[#F99A50] transition-all"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements list */}
      <div className="space-y-3">
        {sorted.map((a) => {
          const { badge, Icon } = categoryStyle[a.category];
          return (
            <div
              key={a.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md group ${
                a.pinned ? 'border-[#F47B20]/30 bg-gradient-to-r from-white to-[#F47B20]/3' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${badge}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#1A1A2E] text-sm leading-snug">{a.title}</h4>
                      {a.pinned && (
                        <Pin className="w-3.5 h-3.5 text-[#F47B20] flex-shrink-0 fill-[#F47B20]" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => togglePin(a.id)}
                        title={a.pinned ? 'Unpin' : 'Pin'}
                        className={`p-1.5 rounded-lg transition-colors ${a.pinned ? 'text-[#F47B20] hover:bg-[#F47B20]/10' : 'text-gray-400 hover:bg-gray-100 hover:text-[#F47B20]'}`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(a.id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#5A6680] leading-relaxed mb-3">{a.body}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badge}`}>
                      {a.category}
                    </span>
                    <span className="text-[11px] text-[#5A6680]">By {a.author}</span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(a.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

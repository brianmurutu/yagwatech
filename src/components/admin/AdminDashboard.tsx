'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, Clock, Briefcase, Plus, UserPlus, BarChart2, Settings, CheckCircle, XCircle } from 'lucide-react';

type AdminModule =
  | 'dashboard'
  | 'blog'
  | 'content'
  | 'employees'
  | 'leaves'
  | 'projects'
  | 'media'
  | 'settings';

interface AdminDashboardProps {
  onNavigate: (module: AdminModule) => void;
}

const quickActions = [
  { label: 'New Blog Post', icon: Plus, module: 'blog' as AdminModule, color: 'bg-brand-blue hover:bg-brand-blueLight' },
  { label: 'Add Employee', icon: UserPlus, module: 'employees' as AdminModule, color: 'bg-green-600 hover:bg-green-700' },
  { label: 'View Projects', icon: BarChart2, module: 'projects' as AdminModule, color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'System Settings', icon: Settings, module: 'settings' as AdminModule, color: 'bg-gray-700 hover:bg-gray-800' },
];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [totalEmployees, setTotalEmployees] = useState(12);
  const [publishedPostsCount, setPublishedPostsCount] = useState(18);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(3);
  const [activeProjectsCount, setActiveProjectsCount] = useState(8);

  const [postsList, setPostsList] = useState<any[]>([]);
  const [leavesList, setLeavesList] = useState<any[]>([]);

  useEffect(() => {
    // 1. Employees
    const emp = localStorage.getItem('yagwa_employees');
    if (emp) {
      try {
        const parsed = JSON.parse(emp);
        setTotalEmployees(parsed.length);
      } catch (e) { console.error(e); }
    }

    // 2. Blog Posts
    const blog = localStorage.getItem('yagwa_blog_posts');
    if (blog) {
      try {
        const parsed = JSON.parse(blog) as any[];
        const published = parsed.filter(p => p.status === 'Published');
        setPublishedPostsCount(published.length);
        setPostsList(parsed.slice(0, 3));
      } catch (e) { console.error(e); }
    } else {
      setPostsList([
        { title: 'How Cloud Computing is Transforming Kenyan SMEs', author: 'Brian Murutu', date: '28 Jun 2026', status: 'Published' },
        { title: 'Cybersecurity Threats Facing East African Businesses in 2026', author: 'Grace Njeri', date: '25 Jun 2026', status: 'Published' },
        { title: 'The Rise of Mobile-First Development in Kenya', author: 'James Otieno', date: '22 Jun 2026', status: 'Draft' },
      ]);
    }

    // 3. Leaves
    const leaves = localStorage.getItem('yagwa_leaves');
    if (leaves) {
      try {
        const parsed = JSON.parse(leaves) as any[];
        const pending = parsed.filter(l => l.status === 'Pending');
        setPendingLeavesCount(pending.length);
        
        const mapped = pending.map(l => ({
          id: l.id,
          name: l.employee,
          type: l.type,
          days: l.days,
          from: l.startDate,
          to: l.endDate
        }));
        setLeavesList(mapped.slice(0, 3));
      } catch (e) { console.error(e); }
    } else {
      setLeavesList([
        { id: '1', name: 'Amina Wanjiku', type: 'Annual Leave', days: 5, from: '2 Jul', to: '6 Jul' },
        { id: '2', name: 'Kevin Kimani', type: 'Sick Leave', days: 2, from: '30 Jun', to: '1 Jul' },
        { id: '3', name: 'Faith Akinyi', type: 'Emergency Leave', days: 1, from: '29 Jun', to: '29 Jun' },
      ]);
    }

    // 4. Projects
    const projects = localStorage.getItem('yagwa_projects');
    if (projects) {
      try {
        const parsed = JSON.parse(projects) as any[];
        const active = parsed.filter(p => p.status === 'In Progress' || p.status === 'Backlog' || p.status === 'Review');
        setActiveProjectsCount(active.length);
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    const leaves = localStorage.getItem('yagwa_leaves');
    if (leaves) {
      try {
        const parsed = JSON.parse(leaves) as any[];
        const updated = parsed.map(l => l.id.toString() === id.toString() ? { ...l, status: action } : l);
        localStorage.setItem('yagwa_leaves', JSON.stringify(updated));
        
        const pending = updated.filter(l => l.status === 'Pending');
        setPendingLeavesCount(pending.length);
        const mapped = pending.map(l => ({
          id: l.id,
          name: l.employee,
          type: l.type,
          days: l.days,
          from: l.startDate,
          to: l.endDate
        }));
        setLeavesList(mapped.slice(0, 3));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stats = [
    { label: 'Total Employees', value: totalEmployees.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: 'Live team size' },
    { label: 'Published Posts', value: publishedPostsCount.toString(), icon: FileText, color: 'text-green-600', bg: 'bg-green-50', change: 'Insights articles' },
    { label: 'Pending Leaves', value: pendingLeavesCount.toString(), icon: Clock, color: 'text-[#F47B20]', bg: 'bg-orange-50', change: `${pendingLeavesCount} active review${pendingLeavesCount !== 1 ? 's' : ''}` },
    { label: 'Active Projects', value: activeProjectsCount.toString(), icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', change: 'Kanban boards' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-400 mt-1">Welcome back, Super Admin — here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-900">{s.value}</p>
              <p className="text-sm font-medium text-ink-900">{s.label}</p>
              <p className="text-xs text-ink-400 mt-0.5">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-ink-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.module)}
              className={`${a.color} text-white flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 text-sm font-medium`}
            >
              <a.icon className="w-5 h-5" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-ink-900">Recent Blog Posts</h2>
            <button
              onClick={() => onNavigate('blog')}
              className="text-xs font-medium text-brand-blue hover:text-brand-blueLight"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {postsList.map((post) => (
              <div key={post.title} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{post.title}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{post.author} · {post.date}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      post.status === 'Published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
            {postsList.length === 0 && (
              <div className="p-5 text-center text-xs text-ink-400">
                No blog posts found.
              </div>
            )}
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-ink-900">Pending Leave Requests</h2>
            <button
              onClick={() => onNavigate('leaves')}
              className="text-xs font-medium text-brand-blue hover:text-brand-blueLight"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {leavesList.map((leave) => (
              <div key={leave.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{leave.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {leave.type} · {leave.days} day{leave.days !== 1 ? 's' : ''} · {leave.from} – {leave.to}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(leave.id, 'Approved')}
                      className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors"
                      title="Approve Leave"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAction(leave.id, 'Rejected')}
                      className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-colors"
                      title="Reject Leave"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {leavesList.length === 0 && (
              <div className="p-5 text-center text-xs text-ink-400">
                No pending leave requests.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

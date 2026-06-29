'use client';

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

const stats = [
  { label: 'Total Employees', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+2 this month' },
  { label: 'Published Posts', value: '18', icon: FileText, color: 'text-green-600', bg: 'bg-green-50', change: '+3 this week' },
  { label: 'Pending Leaves', value: '3', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', change: '2 urgent' },
  { label: 'Active Projects', value: '8', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', change: '3 due soon' },
];

const recentPosts = [
  { title: 'How Cloud Computing is Transforming Kenyan SMEs', author: 'Brian Murutu', date: '28 Jun 2026', status: 'Published' },
  { title: 'Cybersecurity Threats Facing East African Businesses in 2026', author: 'Grace Njeri', date: '25 Jun 2026', status: 'Published' },
  { title: 'The Rise of Mobile-First Development in Kenya', author: 'James Otieno', date: '22 Jun 2026', status: 'Draft' },
];

const pendingLeaves = [
  { name: 'Amina Wanjiku', type: 'Annual Leave', days: 5, from: '2 Jul', to: '6 Jul' },
  { name: 'Kevin Kimani', type: 'Sick Leave', days: 2, from: '30 Jun', to: '1 Jul' },
  { name: 'Faith Akinyi', type: 'Emergency Leave', days: 1, from: '29 Jun', to: '29 Jun' },
];

const quickActions = [
  { label: 'New Blog Post', icon: Plus, module: 'blog' as AdminModule, color: 'bg-brand-blue hover:bg-brand-blueLight' },
  { label: 'Add Employee', icon: UserPlus, module: 'employees' as AdminModule, color: 'bg-green-600 hover:bg-green-700' },
  { label: 'View Projects', icon: BarChart2, module: 'projects' as AdminModule, color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'System Settings', icon: Settings, module: 'settings' as AdminModule, color: 'bg-gray-700 hover:bg-gray-800' },
];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
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
            {recentPosts.map((post) => (
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
            {pendingLeaves.map((leave) => (
              <div key={leave.name} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{leave.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {leave.type} · {leave.days} day{leave.days !== 1 ? 's' : ''} · {leave.from} – {leave.to}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-600 transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  Activity,
  Database
} from 'lucide-react';

interface Props {
  setActiveModule: (m: string) => void;
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-[#0B3D91]/10', text: 'text-[#0B3D91]', ring: 'ring-[#0B3D91]/20' },
  orange: { bg: 'bg-[#F47B20]/10', text: 'text-[#F47B20]', ring: 'ring-[#F47B20]/20' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
};

const activity = [
  {
    type: 'task',
    text: 'Completed task "ERP API integration for Equity Bank"',
    time: '10 min ago',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    type: 'project',
    text: 'Project "Mobile App Redesign" moved to In Progress',
    time: '2 hrs ago',
    icon: TrendingUp,
    color: 'text-[#F47B20]',
  },
  {
    type: 'task',
    text: 'Submitted "Cybersecurity Audit Report" for final internal review',
    time: 'Yesterday',
    icon: Activity,
    color: 'text-amber-500',
  },
  {
    type: 'project',
    text: '"Digital Marketing Campaign" moved to Review — awaiting client sign-off',
    time: '2 days ago',
    icon: Briefcase,
    color: 'text-[#0B3D91]',
  },
];

const quickActions = [
  { label: 'View Kanban Projects', module: 'projects', Icon: Briefcase, bg: 'bg-emerald-600' },
  { label: 'My Checklist Tasks', module: 'tasks', Icon: CheckCircle, bg: 'bg-[#0B3D91]' },
  { label: 'Shared Documents', module: 'documents', Icon: FolderOpen, bg: 'bg-purple-600' },
];

export default function PortalDashboard({ setActiveModule }: Props) {
  const [activeProjectsCount, setActiveProjectsCount] = useState(4);
  const [pendingTasksCount, setPendingTasksCount] = useState(8);
  const [documentsCount, setDocumentsCount] = useState(5);
  const [isSyncActive, setIsSyncActive] = useState(false);
  const [tasksPercentage, setTasksPercentage] = useState(75);

  useEffect(() => {
    // 1. Projects
    const projects = localStorage.getItem('yagwa_projects');
    if (projects) {
      try {
        const parsed = JSON.parse(projects) as any[];
        const active = parsed.filter(p => p.status === 'In Progress' || p.status === 'Backlog' || p.status === 'Review');
        setActiveProjectsCount(active.length);
      } catch (e) { console.error(e); }
    }

    // 2. Tasks
    const tasks = localStorage.getItem('yagwa_tasks');
    if (tasks) {
      try {
        const parsed = JSON.parse(tasks) as any[];
        const pending = parsed.filter(t => t.status !== 'Done');
        const done = parsed.filter(t => t.status === 'Done');
        setPendingTasksCount(pending.length);
        if (parsed.length > 0) {
          setTasksPercentage(Math.round((done.length / parsed.length) * 100));
        }
      } catch (e) { console.error(e); }
    }

    // 3. Sync status
    fetch('/api/crm/status')
      .then(res => res.json())
      .then(data => {
        setIsSyncActive(data.projects?.status === 'connected');
      })
      .catch(e => console.error(e));
  }, []);

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjectsCount.toString(),
      change: 'Ongoing client deliverables',
      Icon: Briefcase,
      color: 'blue',
    },
    {
      label: 'Pending Tasks',
      value: pendingTasksCount.toString(),
      change: 'Awaiting checkbox completion',
      Icon: CheckCircle,
      color: 'orange',
    },
    {
      label: 'Company Policies',
      value: documentsCount.toString(),
      change: 'Available resources',
      Icon: FolderOpen,
      color: 'purple',
    },
    {
      label: 'Zoho Sync Link',
      value: isSyncActive ? 'Connected' : 'Sandbox',
      change: isSyncActive ? 'API is fully operational' : 'Simulated local storage',
      Icon: Database,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#07255A] to-[#1A56C4] rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Good afternoon, Team Member! 👋</h3>
          <p className="text-white/65 text-sm mt-1">
            Access Zoho Kanban, document repositories, and daily checklists in one workspace.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-white/40 text-xs">Today</span>
          <span className="text-lg font-semibold">
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, Icon, color }) => {
          const c = colorMap[color];
          return (
            <div
              key={label}
              className="bg-white rounded-2xl p-6 shadow-sm shadow-black/5 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#5A6680] font-medium">{label}</p>
                <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.ring} ring-1 flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${c.text}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#1A1A2E]">{value}</div>
              <p className="text-xs text-[#5A6680] mt-1">{change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#1A1A2E]">Recent Activity</h3>
            <span className="text-xs text-[#5A6680] bg-gray-100 px-2.5 py-1 rounded-full">
              Last 48 hrs
            </span>
          </div>
          <div className="space-y-4">
            {activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className={`mt-0.5 flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1A2E] leading-snug">{item.text}</p>
                  <span className="text-[11px] text-[#5A6680] mt-0.5 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1A1A2E] mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map(({ label, module, Icon, bg }) => (
              <button
                key={label}
                onClick={() => setActiveModule(module)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-all group hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-sm font-medium text-[#1A1A2E] text-left">{label}</span>
                <ArrowRight className="w-4 h-4 text-[#5A6680] group-hover:text-[#1A1A2E] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>

          {/* Mini stats */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs text-[#5A6680] font-medium mb-3 uppercase tracking-wide">Tasks Completed Ratio</p>
            <div className="space-y-2">
              {[
                { label: 'Tasks completed', value: `${tasksPercentage}%`, bar: tasksPercentage },
                { label: 'Zoho REST API status', value: isSyncActive ? '100%' : 'Mock', bar: isSyncActive ? 100 : 50 },
              ].map(({ label, value, bar }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#5A6680]">{label}</span>
                    <span className="font-semibold text-[#1A1A2E]">{value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0B3D91] rounded-full transition-all"
                      style={{ width: `${bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

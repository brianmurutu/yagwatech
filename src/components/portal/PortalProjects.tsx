'use client';

import { useState, useEffect } from 'react';
import { Plus, X, User, Calendar, AlertTriangle } from 'lucide-react';

type Priority = 'High' | 'Medium' | 'Low';
type Column = 'Backlog' | 'In Progress' | 'Review' | 'Done';

interface Project {
  id: string;
  title: string;
  client: string;
  clientEmail?: string;
  status: Column;
  assignee: string;
  priority: Priority;
  dueDate: string;
  column: Column;
  tags: string[];
  budget?: string;
  description?: string;
  deadline?: string;
}

const initialProjects: Project[] = [
  { id: '1', title: 'Client Onboarding Portal', client: 'Safaricom PLC', status: 'Backlog', assignee: 'Faith Njeri', priority: 'Medium', dueDate: '2026-08-15', column: 'Backlog', tags: ['Web', 'Portal'] },
  { id: '2', title: 'Mobile App Redesign', client: 'KCB Bank Group', status: 'Backlog', assignee: 'Dennis Mutua', priority: 'Low', dueDate: '2026-09-01', column: 'Backlog', tags: ['Mobile', 'UI/UX'] },
  { id: '3', title: 'ERP Integration for KCB', client: 'Equity Bank', status: 'In Progress', assignee: 'David Kamau', priority: 'High', dueDate: '2026-07-30', column: 'In Progress', tags: ['Enterprise', 'API'] },
  { id: '4', title: 'Cybersecurity Audit', client: 'Co-operative Bank', status: 'In Progress', assignee: 'Peter Njoroge', priority: 'High', dueDate: '2026-07-20', column: 'In Progress', tags: ['Security'] },
];

const columns: Column[] = ['Backlog', 'In Progress', 'Review', 'Done'];

const priorityStyle: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Low: 'bg-green-100 text-green-700 border border-green-200',
};

const columnStyle: Record<Column, { header: string; dot: string }> = {
  Backlog: { header: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  'In Progress': { header: 'bg-[#0B3D91]/10 text-[#0B3D91]', dot: 'bg-[#0B3D91]' },
  Review: { header: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  Done: { header: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

export default function PortalProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSyncActive, setIsSyncActive] = useState(false);
  const [form, setForm] = useState({
    title: '',
    client: '',
    assignee: 'Faith Njeri',
    priority: 'Medium' as Priority,
    dueDate: '',
    column: 'Backlog' as Column,
  });

  const loadProjects = async () => {
    try {
      const configRes = await fetch('/api/crm/status');
      const configData = await configRes.json();
      const isLive = configData.projects?.status === 'connected';
      setIsSyncActive(isLive);

      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();

      if (projectsData.success) {
        if (projectsData.mock) {
          // Local storage projects
          const saved = localStorage.getItem('yagwa_projects');
          if (saved) {
            const parsed = JSON.parse(saved) as any[];
            const mapped = parsed.map((p) => ({
              ...p,
              id: p.id.toString(),
              column: p.status || p.column || 'Backlog',
              status: p.status || p.column || 'Backlog',
              dueDate: p.dueDate || p.deadline || new Date().toISOString().split('T')[0],
              tags: p.tags || [],
            }));
            setProjects(mapped);
          } else {
            const formatted = initialProjects.map((p) => ({
              ...p,
              column: p.status,
              dueDate: p.dueDate,
              client: p.client || 'Client Name',
              budget: 'KSh 500,000',
              description: 'Standard onboarding phase and project review.',
              tags: [],
            }));
            setProjects(formatted);
            localStorage.setItem('yagwa_projects', JSON.stringify(formatted));
          }
        } else {
          // Live Zoho Projects
          const mapped = (projectsData.projects || []).map((p: any) => ({
            ...p,
            column: p.status,
            dueDate: p.deadline,
            tags: [],
          }));
          setProjects(mapped);
        }
      }
    } catch (e) {
      console.error('Failed to load projects board:', e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          client: form.client || 'YagwaTech Internal',
          description: 'Project created via employee portal.',
          assignee: form.assignee,
          priority: form.priority,
          deadline: form.dueDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
          budget: 'KSh 0',
          status: form.column,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.mock) {
          const newProject: Project = {
            id: Date.now().toString(),
            title: form.title,
            client: form.client || 'YagwaTech Internal',
            assignee: form.assignee || 'Unassigned',
            priority: form.priority,
            dueDate: form.dueDate || new Date().toISOString().split('T')[0],
            column: form.column,
            status: form.column,
            tags: [],
            description: 'Project created via employee portal.',
          };
          const updated = [...projects, newProject];
          setProjects(updated);
          localStorage.setItem('yagwa_projects', JSON.stringify(updated));
        } else {
          loadProjects();
        }

        setForm({ title: '', client: '', assignee: 'Faith Njeri', priority: 'Medium', dueDate: '', column: 'Backlog' });
        setShowModal(false);
      }
    } catch {
      alert('Error creating project.');
    }
  };

  const cycleColumn = (id: string, current: Column) => {
    const nextColMap: Record<Column, Column> = {
      'Backlog': 'In Progress',
      'In Progress': 'Review',
      'Review': 'Done',
      'Done': 'Backlog'
    };
    const next = nextColMap[current];

    const updated = projects.map((p) => {
      if (p.id.toString() !== id.toString()) return p;
      return { ...p, column: next, status: next };
    });

    setProjects(updated);
    if (!isSyncActive) {
      localStorage.setItem('yagwa_projects', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A2E]">Project Kanban</h3>
          <p className="text-sm text-[#5A6680]">{projects.length} total projects {isSyncActive ? '(Zoho Synced)' : '(Local Database)'}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#0B3D91] hover:bg-[#1A56C4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-[#0B3D91]/25"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colProjects = projects.filter((p) => p.column === col || p.status === col);
          const { header, dot } = columnStyle[col];
          return (
            <div key={col} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              {/* Column header */}
              <div className={`flex items-center justify-between mb-4 px-3 py-2 rounded-xl ${header}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-sm font-semibold">{col}</span>
                </div>
                <span className="text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full">
                  {colProjects.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {colProjects.length === 0 ? (
                  <div className="text-center py-8 text-[#5A6680] text-sm">
                    <div className="text-2xl mb-2">📋</div>
                    <p>No projects here</p>
                  </div>
                ) : (
                  colProjects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="text-sm font-semibold text-[#1A1A2E] leading-snug group-hover:text-[#0B3D91] transition-colors">
                          {p.title}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${priorityStyle[p.priority]}`}>
                          {p.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mb-2">Client: {p.client}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#0B3D91] flex items-center justify-center">
                            <span className="text-white text-[8px] font-bold">
                              {p.assignee.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#5A6680] truncate max-w-[80px]">{p.assignee}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cycleColumn(p.id, p.status || p.column);
                          }}
                          className="text-[10px] text-[#0B3D91] hover:text-[#1A56C4] font-semibold flex items-center gap-0.5"
                          title="Move project to next stage"
                        >
                          Move →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-[#1A1A2E]">Add New Project</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Project Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Customer Portal v2"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Client Company *</label>
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="e.g. Safaricom PLC"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Assignee</label>
                <select
                  value={form.assignee}
                  onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                >
                  {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Column</label>
                  <select
                    value={form.column}
                    onChange={(e) => setForm({ ...form, column: e.target.value as Column })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                  >
                    {columns.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-[#5A6680] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0B3D91] text-white rounded-xl text-sm font-semibold hover:bg-[#1A56C4] transition-all"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

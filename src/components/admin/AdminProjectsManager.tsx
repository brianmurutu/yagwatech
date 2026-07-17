'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Briefcase, 
  User, 
  Calendar, 
  DollarSign, 
  Filter, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Link2,
  Mail
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  client: string;
  clientEmail?: string;
  status: 'Backlog' | 'In Progress' | 'Review' | 'Done';
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  budget: string;
  description: string;
}

const INITIAL_PROJECTS: Project[] = [
  { id: '1', title: 'Client Onboarding Portal', client: 'Safaricom PLC', clientEmail: 'onboarding@safaricom.co.ke', status: 'Backlog', assignee: 'Faith Akinyi', priority: 'Medium', deadline: '2026-08-15', budget: 'KSh 1,200,000', description: 'Internal onboarding portal for new Safaricom business client accounts.' },
  { id: '2', title: 'Mobile App Redesign', client: 'KCB Bank Group', clientEmail: 'appdev@kcbgroup.com', status: 'Backlog', assignee: 'David Mwangi', priority: 'Low', deadline: '2026-09-01', budget: 'KSh 850,000', description: 'Complete UI/UX redesign of the corporate mobile banking application.' },
  { id: '3', title: 'ERP Integration', client: 'Equity Bank', clientEmail: 'systems@equitybank.co.ke', status: 'In Progress', assignee: 'James Otieno', priority: 'High', deadline: '2026-07-30', budget: 'KSh 3,500,000', description: 'Integrating enterprise resource planning systems with modern backend APIs.' },
  { id: '4', title: 'Cybersecurity Audit', client: 'Co-operative Bank', clientEmail: 'secops@co-opbank.co.ke', status: 'In Progress', assignee: 'Samuel Karanja', priority: 'High', deadline: '2026-07-20', budget: 'KSh 1,800,000', description: 'Full system penetration testing, security analysis, and compliance audit.' },
  { id: '5', title: 'Website Optimization', client: 'Kenya Airways', clientEmail: 'marketing@kenya-airways.com', status: 'In Progress', assignee: 'Kevin Kimani', priority: 'Medium', deadline: '2026-07-25', budget: 'KSh 600,000', description: 'Performance tuning, SEO optimizations, and content rendering enhancement.' },
  { id: '6', title: 'Digital Marketing Campaign', client: 'YagwaTech Internal', clientEmail: 'internal@yagwatech.com', status: 'Review', assignee: 'David Mwangi', priority: 'Medium', deadline: '2026-07-18', budget: 'KSh 200,000', description: 'East African regional brand campaign and targeted lead generation.' },
  { id: '7', title: 'Cloud Migration Phase 1', client: 'Nairobi County Government', clientEmail: 'admin@nairobi.go.ke', status: 'Done', assignee: 'Grace Njeri', priority: 'High', deadline: '2026-06-30', budget: 'KSh 4,500,000', description: 'Migration of local government databases and servers to Amazon Web Services.' },
  { id: '8', title: 'Staff Training LMS', client: 'Davis & Shirtliff', clientEmail: 'training@davis-shirtliff.com', status: 'Done', assignee: 'Amina Wanjiku', priority: 'Low', deadline: '2026-06-15', budget: 'KSh 750,000', description: 'Custom Learning Management System deployment and administration training.' },
];

const TEAM_MEMBERS = ['James Otieno', 'Amina Wanjiku', 'David Mwangi', 'Faith Akinyi', 'Kevin Kimani', 'Samuel Karanja', 'Grace Njeri', 'Brian Murutu'];

export default function AdminProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [kycStatuses, setKycStatuses] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [toast, setToast] = useState<string | null>(null);
  const [isSyncActive, setIsSyncActive] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    clientEmail: '',
    status: 'Backlog' as 'Backlog' | 'In Progress' | 'Review' | 'Done',
    assignee: 'James Otieno',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    deadline: '',
    budget: '',
    description: '',
  });

  const loadData = async () => {
    try {
      // 1. Fetch Integration Status
      const configRes = await fetch('/api/crm/status');
      const configData = await configRes.json();
      const isLiveProjects = configData.projects?.status === 'connected';
      setIsSyncActive(isLiveProjects);

      // 2. Fetch Projects
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();

      if (projectsData.success) {
        if (projectsData.mock) {
          // Fallback to local storage projects
          const saved = localStorage.getItem('yagwa_projects');
          if (saved) {
            setProjects(JSON.parse(saved));
          } else {
            setProjects(INITIAL_PROJECTS);
            localStorage.setItem('yagwa_projects', JSON.stringify(INITIAL_PROJECTS));
          }
        } else {
          setProjects(projectsData.projects || []);
        }
      }

      // 3. Fetch KYC statuses
      const kycRes = await fetch('/api/kyc/status');
      const kycData = await kycRes.json();
      if (kycData.success && kycData.records) {
        const mapping: Record<string, string> = {};
        Object.entries(kycData.records).forEach(([email, record]: [string, any]) => {
          mapping[email] = record.status;
        });
        setKycStatuses(mapping);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      client: '',
      clientEmail: '',
      status: 'Backlog',
      assignee: 'James Otieno',
      priority: 'Medium',
      deadline: '',
      budget: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      client: project.client,
      clientEmail: project.clientEmail || '',
      status: project.status,
      assignee: project.assignee,
      priority: project.priority,
      deadline: project.deadline,
      budget: project.budget,
      description: project.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      if (!isSyncActive) {
        // Mock Mode: update local projects list in state and local storage
        const updated = projects.filter(p => p.id !== id);
        setProjects(updated);
        localStorage.setItem('yagwa_projects', JSON.stringify(updated));
        showToast('Project deleted successfully (Local Mock Mode)');
      } else {
        // In a live integration, we'd fire a DELETE request
        alert('Deletion is handled directly inside Zoho Projects interface.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.mock) {
          // Local storage handling
          let updated: Project[];
          if (editingProject) {
            updated = projects.map(p => {
              if (p.id === editingProject.id) {
                return { ...p, ...formData };
              }
              return p;
            });
            showToast('Project updated successfully (Local Mock Mode)');
          } else {
            const newProject: Project = {
              id: Date.now().toString(),
              ...formData,
            };
            updated = [...projects, newProject];
            showToast('Project created & synced successfully (Local Mock Mode)');
          }
          setProjects(updated);
          localStorage.setItem('yagwa_projects', JSON.stringify(updated));
        } else {
          showToast(editingProject ? 'Project updated in Zoho Projects!' : 'Project created & synced in Zoho Projects!');
          loadData();
        }
        setShowModal(false);
      } else {
        alert(data.error || 'Failed to process project submission.');
      }
    } catch {
      alert('Network failure connecting to projects bridge.');
    }
  };

  const copyKycLink = (email: string) => {
    if (!email) return;
    const link = `${window.location.origin}/kyc?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(link);
    showToast(`KYC Verification Link copied for ${email}`);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Low': return 'bg-green-100 text-green-700 border border-green-200';
    }
  };

  const getStatusBadge = (status: 'Backlog' | 'In Progress' | 'Review' | 'Done') => {
    switch (status) {
      case 'Backlog': return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Review': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Done': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    }
  };

  const getKycBadge = (email?: string) => {
    if (!email) return <span className="text-[10px] text-gray-400">N/A</span>;
    const status = kycStatuses[email.toLowerCase()] || 'Not Started';

    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
            <Activity className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <ShieldAlert className="w-3 h-3 text-red-600" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-55 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Projects & KYC Status Manager
          </h1>
          <p className="text-sm text-slate-500">Track company operations, Zoho Project boards, and Persona identity verifications</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#F47B20] hover:bg-[#d46512] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Active Sync Status */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase">System Status:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${isSyncActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {isSyncActive ? 'Zoho Projects Active Sync' : 'Simulated Local Storage Mode'}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Sync status updates in real-time using webhook callbacks.
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, clients or assignees..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden md:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Project Details</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Lead / Assignee</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">KYC State</th>
                <th className="px-6 py-4">Budget / Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Briefcase className="w-8 h-8 text-gray-300" />
                      <p className="font-medium">No projects found matching filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{p.title}</div>
                      <div className="text-xs text-slate-400 mt-1 max-w-xs line-clamp-1">{p.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{p.client}</div>
                      {p.clientEmail && (
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {p.clientEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-[10px] text-brand-blue font-bold">
                          {p.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        {p.assignee}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(p.priority)}`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {getKycBadge(p.clientEmail)}
                        {p.clientEmail && (
                          <button
                            onClick={() => copyKycLink(p.clientEmail!)}
                            className="p-1 border border-slate-200 hover:border-slate-400 rounded-md hover:bg-slate-50 text-slate-500 hover:text-slate-700"
                            title="Copy Onboarding KYC Link"
                          >
                            <Link2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{p.budget}</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F47B20]" />
                        {p.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-all"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#07255A] to-[#0B3D91] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#F47B20]" />
                {editingProject ? 'Edit Project Details' : 'Create Synced Project'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project name"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Client Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Safaricom PLC"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Client Email (For KYC Onboarding)</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="e.g. contact@client.com"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Budget Amount</label>
                  <input
                    type="text"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. KSh 1,500,000"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Lead / Assignee</label>
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-blue/10"
                  >
                    {TEAM_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Backlog' | 'In Progress' | 'Review' | 'Done' })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Project Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide milestones and requirements..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F47B20] hover:bg-[#d46512] text-white rounded-xl text-sm font-semibold shadow-md"
                >
                  {editingProject ? 'Save Sync Changes' : 'Create & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Briefcase, User, Calendar, DollarSign, Filter, Search } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  client: string;
  status: 'Backlog' | 'In Progress' | 'Review' | 'Done';
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  budget: string;
  description: string;
}

const INITIAL_PROJECTS: Project[] = [
  { id: '1', title: 'Client Onboarding Portal', client: 'Safaricom PLC', status: 'Backlog', assignee: 'Faith Akinyi', priority: 'Medium', deadline: '2026-08-15', budget: 'KSh 1,200,000', description: 'Internal onboarding portal for new Safaricom business client accounts.' },
  { id: '2', title: 'Mobile App Redesign', client: 'KCB Bank Group', status: 'Backlog', assignee: 'David Mwangi', priority: 'Low', deadline: '2026-09-01', budget: 'KSh 850,000', description: 'Complete UI/UX redesign of the corporate mobile banking application.' },
  { id: '3', title: 'ERP Integration', client: 'Equity Bank', status: 'In Progress', assignee: 'James Otieno', priority: 'High', deadline: '2026-07-30', budget: 'KSh 3,500,000', description: 'Integrating enterprise resource planning systems with modern backend APIs.' },
  { id: '4', title: 'Cybersecurity Audit', client: 'Co-operative Bank', status: 'In Progress', assignee: 'Samuel Karanja', priority: 'High', deadline: '2026-07-20', budget: 'KSh 1,800,000', description: 'Full system penetration testing, security analysis, and compliance audit.' },
  { id: '5', title: 'Website Optimization', client: 'Kenya Airways', status: 'In Progress', assignee: 'Kevin Kimani', priority: 'Medium', deadline: '2026-07-25', budget: 'KSh 600,000', description: 'Performance tuning, SEO optimizations, and content rendering enhancement.' },
  { id: '6', title: 'Digital Marketing Campaign', client: 'YagwaTech Internal', status: 'Review', assignee: 'David Mwangi', priority: 'Medium', deadline: '2026-07-18', budget: 'KSh 200,000', description: 'East African regional brand campaign and targeted lead generation.' },
  { id: '7', title: 'Cloud Migration Phase 1', client: 'Nairobi County Government', status: 'Done', assignee: 'Grace Njeri', priority: 'High', deadline: '2026-06-30', budget: 'KSh 4,500,000', description: 'Migration of local government databases and servers to Amazon Web Services.' },
  { id: '8', title: 'Staff Training LMS', client: 'Davis & Shirtliff', status: 'Done', assignee: 'Amina Wanjiku', priority: 'Low', deadline: '2026-06-15', budget: 'KSh 750,000', description: 'Custom Learning Management System deployment and administration training.' },
];

const TEAM_MEMBERS = ['James Otieno', 'Amina Wanjiku', 'David Mwangi', 'Faith Akinyi', 'Kevin Kimani', 'Samuel Karanja', 'Grace Njeri', 'Brian Murutu'];

export default function AdminProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    client: '',
    status: 'Backlog',
    assignee: 'James Otieno',
    priority: 'Medium',
    deadline: '',
    budget: '',
    description: '',
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      client: '',
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
      status: project.status,
      assignee: project.assignee,
      priority: project.priority,
      deadline: project.deadline,
      budget: project.budget,
      description: project.description,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      showToast('Project deleted successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...formData } : p));
      showToast('Project updated successfully');
    } else {
      const newProject: Project = {
        id: (projects.length + 1).toString(),
        ...formData,
      };
      setProjects([...projects, newProject]);
      showToast('Project created successfully');
    }
    setShowModal(false);
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

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-55 bg-ink-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Projects Manager</h1>
          <p className="text-sm text-ink-400">Track and coordinate company operations and project deliverables</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeDark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md shadow-brand-orange/15"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, clients or assignees..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-ink-400 hidden md:block" />
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

      {/* Grid or Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/55 text-ink-400 font-semibold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Project Details</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Lead / Assignee</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Budget / Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-ink-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Briefcase className="w-8 h-8 text-gray-300" />
                      <p className="font-medium">No projects found matching filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-ink-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-ink-900">{p.title}</div>
                      <div className="text-xs text-ink-400 mt-1 max-w-xs line-clamp-1">{p.description}</div>
                    </td>
                    <td className="px-6 py-4 text-ink-900 font-medium">{p.client}</td>
                    <td className="px-6 py-4 text-ink-400 font-medium">
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
                      <div className="font-semibold text-ink-900">{p.budget}</div>
                      <div className="text-xs text-ink-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-orange" />
                        {p.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 text-ink-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-all"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-blueDark to-brand-blue px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-orange" />
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project name"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Enter client company"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Budget</label>
                  <input
                    type="text"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. KSh 1,500,000"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Lead / Assignee</label>
                  <select
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue bg-white"
                  >
                    {TEAM_MEMBERS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Deadline</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Backlog' | 'In Progress' | 'Review' | 'Done' })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue bg-white"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Project Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the scope and goals of the project..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-ink-400 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orangeDark text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-orange/15"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

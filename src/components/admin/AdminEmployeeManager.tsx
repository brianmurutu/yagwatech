'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, X, User, Mail, Phone, Briefcase, Building2, Calendar, Check, AlertCircle } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  avatar: string;
  avatarUrl?: string;
  status: 'Pending' | 'Approved';
  kycStatus: string;
}

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR', 'Management'];
const ROLES = ['CEO', 'CTO', 'COO', 'Senior Developer', 'Junior Developer', 'UI/UX Designer', 'Marketing Manager', 'Sales Executive', 'Project Manager', 'DevOps Engineer', 'Data Analyst', 'HR Manager'];

const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];

const emptyForm = () => ({
  name: '',
  role: 'Senior Developer',
  department: 'Engineering',
  email: '',
  phone: '',
  joinDate: new Date().toISOString().split('T')[0],
  avatarUrl: '',
  status: 'Pending' as 'Pending' | 'Approved',
});

export default function AdminEmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/employees');
      const data = await res.json();
      if (data.success && data.employees) {
        setEmployees(data.employees);
      }
    } catch (e) {
      console.error('Failed to load team list:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingEmployee(null);
    setFormData(emptyForm());
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      role: emp.role,
      department: emp.department,
      email: emp.email,
      phone: emp.phone,
      joinDate: emp.joinDate,
      avatarUrl: emp.avatarUrl || '',
      status: emp.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) { return; }

    try {
      const isEdit = !!editingEmployee;
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.name,
          phone: formData.phone,
          role: formData.role,
          department: formData.department,
          status: formData.status,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? 'Employee updated' : 'Employee added (Pending KYC & Approval)');
        loadEmployees();
        setShowModal(false);
      } else {
        alert(data.error || 'Failed to save employee.');
      }
    } catch {
      alert('Error updating employee.');
    }
  };

  const handleApprove = async (email: string) => {
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status: 'Approved' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Employee approved & notified successfully!');
        loadEmployees();
      } else {
        alert(data.error || 'Failed to approve employee.');
      }
    } catch {
      alert('Error connecting to save approval.');
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg bg-green-600 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1A1A2E]">
                {editingEmployee ? 'Edit Team Member Details' : 'Register New Team Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5"><User className="inline w-3 h-3 mr-1" />Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Grace Njeri" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5"><Briefcase className="inline w-3 h-3 mr-1" />Role / Job Title</label>
                <select value={formData.role} onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white">
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5"><Building2 className="inline w-3 h-3 mr-1" />Department</label>
                <select value={formData.department} onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white">
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5"><Mail className="inline w-3 h-3 mr-1" />Email Address *</label>
                <input type="email" disabled={!!editingEmployee} value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="name@yagwatech.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 disabled:bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5"><Phone className="inline w-3 h-3 mr-1" />Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} placeholder="+254 7XX XXX XXX" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5"><Calendar className="inline w-3 h-3 mr-1" />Join Date</label>
                <input type="date" value={formData.joinDate} onChange={(e) => setFormData((p) => ({ ...p, joinDate: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Portal Status</label>
                <select value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as any }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white">
                  <option value="Pending">Pending Approval</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-slate-500 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#0B3D91] hover:bg-[#1A56C4] text-white text-sm font-semibold transition-all">
                {editingEmployee ? 'Save Changes' : 'Register Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Team Registrations</h1>
          <p className="text-sm text-slate-500 mt-1">{employees.length} total registered users</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search registrations by name, role, email or department…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/25 focus:border-[#0B3D91] transition-all"
      />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0B3D91] border-t-transparent mx-auto mb-3" />
              <p className="text-sm">Fetching dynamic registrations list...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="text-lg">👥</p>
              <p className="font-semibold mt-2">No registered employees found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">Employee Details</th>
                  <th className="text-left px-5 py-3.5">Department</th>
                  <th className="text-left px-5 py-3.5">KYC Identity</th>
                  <th className="text-left px-5 py-3.5">Portal Access</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((emp, idx) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                            {emp.avatar || emp.name.split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#1A1A2E]">{emp.name}</p>
                          <p className="text-xs text-slate-500 leading-snug">{emp.role}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-semibold rounded-full uppercase tracking-wider">{emp.department}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                        emp.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                        emp.kycStatus === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        emp.kycStatus === 'Failed' ? 'bg-rose-50 text-rose-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {emp.kycStatus === 'Verified' ? 'Verified (Passed)' :
                         emp.kycStatus === 'Pending' ? 'Pending Action' :
                         emp.kycStatus === 'Failed' ? 'KYC Failed' : 'Not Started'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                        emp.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {emp.status === 'Approved' ? 'Approved & Active' : 'Pending Admin Approval'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2.5">
                        {emp.status !== 'Approved' && (
                          <button
                            onClick={() => handleApprove(emp.email)}
                            className="flex items-center gap-1 bg-[#F47B20] hover:bg-[#d46512] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                            title="Approve employee portal access"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        <button onClick={() => openEdit(emp)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Edit details"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

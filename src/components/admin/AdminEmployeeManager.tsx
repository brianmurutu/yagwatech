'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, User, Mail, Phone, Briefcase, Building2, Calendar, Camera } from 'lucide-react';

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
}

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR', 'Management'];
const ROLES = ['CEO', 'CTO', 'COO', 'Senior Developer', 'Junior Developer', 'UI/UX Designer', 'Marketing Manager', 'Sales Executive', 'Project Manager', 'DevOps Engineer', 'Data Analyst', 'HR Manager'];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Brian Murutu', role: 'CEO', department: 'Management', email: 'brian@yagwatech.co.ke', phone: '+254 712 345 678', joinDate: '2019-03-01', avatar: 'BM', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '2', name: 'Grace Njeri', role: 'CTO', department: 'Engineering', email: 'grace@yagwatech.co.ke', phone: '+254 722 456 789', joinDate: '2019-06-15', avatar: 'GN', avatarUrl: '/images/reviewer_grace.jpg' },
  { id: '3', name: 'James Otieno', role: 'Senior Developer', department: 'Engineering', email: 'james@yagwatech.co.ke', phone: '+254 733 567 890', joinDate: '2020-02-10', avatar: 'JO', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '4', name: 'Amina Wanjiku', role: 'UI/UX Designer', department: 'Design', email: 'amina@yagwatech.co.ke', phone: '+254 744 678 901', joinDate: '2020-07-22', avatar: 'AW', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '5', name: 'David Mwangi', role: 'Marketing Manager', department: 'Marketing', email: 'david@yagwatech.co.ke', phone: '+254 755 789 012', joinDate: '2020-11-05', avatar: 'DM', avatarUrl: '/images/reviewer_david.jpg' },
  { id: '6', name: 'Faith Akinyi', role: 'Project Manager', department: 'Operations', email: 'faith@yagwatech.co.ke', phone: '+254 766 890 123', joinDate: '2021-01-18', avatar: 'FA', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '7', name: 'Kevin Kimani', role: 'Junior Developer', department: 'Engineering', email: 'kevin@yagwatech.co.ke', phone: '+254 777 901 234', joinDate: '2021-04-12', avatar: 'KK', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '8', name: 'Lucy Adhiambo', role: 'Sales Executive', department: 'Sales', email: 'lucy@yagwatech.co.ke', phone: '+254 788 012 345', joinDate: '2021-08-30', avatar: 'LA', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '9', name: 'Samuel Karanja', role: 'DevOps Engineer', department: 'Engineering', email: 'samuel@yagwatech.co.ke', phone: '+254 799 123 456', joinDate: '2021-10-14', avatar: 'SK', avatarUrl: '/images/reviewer_samuel.jpg' },
  { id: '10', name: 'Mercy Waithaka', role: 'HR Manager', department: 'HR', email: 'mercy@yagwatech.co.ke', phone: '+254 711 234 567', joinDate: '2022-02-01', avatar: 'MW', avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '11', name: 'Patrick Ochieng', role: 'Data Analyst', department: 'Engineering', email: 'patrick@yagwatech.co.ke', phone: '+254 722 345 678', joinDate: '2022-06-20', avatar: 'PO', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: '12', name: 'Caroline Mutua', role: 'COO', department: 'Management', email: 'caroline@yagwatech.co.ke', phone: '+254 733 456 789', joinDate: '2019-09-01', avatar: 'CM', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80' },
];

const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];

const emptyForm = (): Omit<Employee, 'id' | 'avatar'> => ({
  name: '', role: 'Senior Developer', department: 'Engineering', email: '', phone: '', joinDate: '', avatarUrl: '',
});

export default function AdminEmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, 'id' | 'avatar'>>(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage or initialize
  useEffect(() => {
    const saved = localStorage.getItem('yagwa_employees');
    if (saved) {
      try {
        setEmployees(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load employees:', e);
      }
    } else {
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.setItem('yagwa_employees', JSON.stringify(INITIAL_EMPLOYEES));
    }
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
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) { return; }
    let updated: Employee[];

    if (editingEmployee) {
      updated = employees.map((e) => e.id === editingEmployee.id ? { ...e, ...formData } : e);
      showToast('Employee updated');
    } else {
      const initials = formData.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
      updated = [...employees, { id: Date.now().toString(), avatar: initials, ...formData }];
      showToast('Employee added');
    }

    setEmployees(updated);
    localStorage.setItem('yagwa_employees', JSON.stringify(updated));
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = employees.filter((e) => e.id !== id);
    setEmployees(updated);
    localStorage.setItem('yagwa_employees', JSON.stringify(updated));
    setDeleteId(null);
    showToast('Employee removed');
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg bg-green-600 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-base font-bold text-ink-900 mb-2">Remove Employee?</h3>
            <p className="text-sm text-ink-400 mb-5">This will permanently remove the employee record.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-ink-400 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-ink-900">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-400 mb-1.5"><User className="inline w-3 h-3 mr-1" />Full Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Grace Njeri" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ink-400 mb-1.5"><Camera className="inline w-3 h-3 mr-1" />Profile Photo URL (Optional)</label>
                <input type="text" value={formData.avatarUrl} onChange={(e) => setFormData((p) => ({ ...p, avatarUrl: e.target.value }))} placeholder="e.g. /images/reviewer_grace.jpg or Unsplash photo link" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 mb-1.5"><Briefcase className="inline w-3 h-3 mr-1" />Role</label>
                <select value={formData.role} onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 mb-1.5"><Building2 className="inline w-3 h-3 mr-1" />Department</label>
                <select value={formData.department} onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 mb-1.5"><Mail className="inline w-3 h-3 mr-1" />Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="name@yagwatech.co.ke" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 mb-1.5"><Phone className="inline w-3 h-3 mr-1" />Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} placeholder="+254 7XX XXX XXX" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-400 mb-1.5"><Calendar className="inline w-3 h-3 mr-1" />Join Date</label>
                <input type="date" value={formData.joinDate} onChange={(e) => setFormData((p) => ({ ...p, joinDate: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-ink-400 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueLight text-white text-sm font-semibold">
                {editingEmployee ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Employee Management</h1>
          <p className="text-sm text-ink-400 mt-1">{employees.length} employees</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, role or department…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
      />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide">Employee</th>
                <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide hidden md:table-cell">Department</th>
                <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide hidden lg:table-cell">Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide hidden xl:table-cell">Phone</th>
                <th className="text-left px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide hidden xl:table-cell">Joined</th>
                <th className="text-right px-5 py-3.5 font-semibold text-ink-400 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {emp.avatarUrl ? (
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {emp.avatar}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-ink-900">{emp.name}</p>
                        <p className="text-xs text-ink-400">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{emp.department}</span>
                  </td>
                  <td className="px-5 py-4 text-ink-400 hidden lg:table-cell">{emp.email}</td>
                  <td className="px-5 py-4 text-ink-400 hidden xl:table-cell">{emp.phone}</td>
                  <td className="px-5 py-4 text-ink-400 hidden xl:table-cell">{emp.joinDate}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(emp)} className="p-1.5 hover:bg-blue-50 rounded-lg text-brand-blue transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(emp.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

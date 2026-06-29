'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Circle } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  online: boolean;
  initials: string;
  avatarUrl?: string;
  colorFrom: string;
  colorTo: string;
}

const INITIAL_EMPLOYEES = [
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

export default function PortalTeam() {
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('yagwa_employees');
    const gradients = [
      { from: '#0B3D91', to: '#1A56C4' },
      { from: '#F47B20', to: '#F99A50' },
      { from: '#8B2FC9', to: '#A855E8' },
      { from: '#059669', to: '#10B981' },
      { from: '#DC2626', to: '#EF4444' },
      { from: '#0891B2', to: '#06B6D4' },
      { from: '#D97706', to: '#F59E0B' },
      { from: '#7C3AED', to: '#8B5CF6' }
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mapped = parsed.map((emp: any, idx: number) => {
          const grad = gradients[idx % gradients.length];
          return {
            id: emp.id,
            name: emp.name,
            role: emp.role,
            department: emp.department,
            email: emp.email,
            phone: emp.phone,
            online: idx % 3 !== 0, // Simulation of online status
            initials: emp.avatar || emp.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase(),
            avatarUrl: emp.avatarUrl || '',
            colorFrom: grad.from,
            colorTo: grad.to
          };
        });
        setEmployeesList(mapped);
      } catch (e) {
        console.error('Failed to parse employees list from localStorage:', e);
      }
    } else {
      const mappedSeed = INITIAL_EMPLOYEES.map((emp, idx) => {
        const grad = gradients[idx % gradients.length];
        return {
          id: emp.id,
          name: emp.name,
          role: emp.role,
          department: emp.department,
          email: emp.email,
          phone: emp.phone,
          online: idx % 3 !== 0,
          initials: emp.avatar,
          avatarUrl: emp.avatarUrl,
          colorFrom: grad.from,
          colorTo: grad.to
        };
      });
      setEmployeesList(mappedSeed);
      localStorage.setItem('yagwa_employees', JSON.stringify(INITIAL_EMPLOYEES));
    }
  }, []);

  const departments = ['All', ...Array.from(new Set(employeesList.map((e) => e.department)))];

  const filtered = employeesList.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || e.department === dept;
    return matchSearch && matchDept;
  });

  const onlineCount = employeesList.filter((e) => e.online).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A2E]">Team Directory</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Circle className="w-2 h-2 text-green-500 fill-green-500" />
            <p className="text-sm text-[#5A6680]">{onlineCount} online · {employeesList.length} total</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6680]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or role…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
          />
        </div>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 bg-white text-[#1A1A2E] min-w-[160px]"
        >
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-[#5A6680] font-medium">No team members found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              {/* Avatar */}
              <div className="relative mb-4 flex justify-center">
                {emp.avatarUrl ? (
                  <img
                    src={emp.avatarUrl}
                    alt={emp.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${emp.colorFrom}, ${emp.colorTo})` }}
                  >
                    {emp.initials}
                  </div>
                )}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    emp.online ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                  title={emp.online ? 'Online' : 'Offline'}
                />
              </div>

              {/* Info */}
              <div className="text-center mb-4">
                <h4 className="font-semibold text-[#1A1A2E] text-sm group-hover:text-[#0B3D91] transition-colors">
                  {emp.name}
                </h4>
                <p className="text-xs text-[#5A6680] mt-0.5 leading-snug">{emp.role}</p>
                <span className="inline-block mt-2 text-[10px] font-medium bg-[#0B3D91]/8 text-[#0B3D91] px-2.5 py-0.5 rounded-full">
                  {emp.department}
                </span>
              </div>

              {/* Contact */}
              <div className="space-y-1.5 pt-3 border-t border-gray-100">
                <a
                  href={`mailto:${emp.email}`}
                  className="flex items-center gap-2 text-[11px] text-[#5A6680] hover:text-[#0B3D91] transition-colors group/link"
                >
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </a>
                <a
                  href={`tel:${emp.phone}`}
                  className="flex items-center gap-2 text-[11px] text-[#5A6680] hover:text-[#0B3D91] transition-colors"
                >
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  {emp.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

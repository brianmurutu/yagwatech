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

export default function PortalTeam() {
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/portal/team');
        const data = await res.json();
        if (data.success && data.team) {
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
          const mapped = data.team.map((emp: any, idx: number) => {
            const grad = gradients[idx % gradients.length];
            return {
              id: emp.id,
              name: emp.name,
              role: emp.role,
              department: emp.department,
              email: emp.email,
              phone: emp.phone,
              online: idx % 3 !== 0, // Simulation of online status
              initials: emp.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase(),
              avatarUrl: emp.avatarUrl || '',
              colorFrom: grad.from,
              colorTo: grad.to
            };
          });
          setEmployeesList(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch team list:', e);
      }
    };
    fetchTeam();
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

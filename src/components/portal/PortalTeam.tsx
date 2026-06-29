'use client';

import { useState } from 'react';
import { Search, Mail, Phone, Circle } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  online: boolean;
  initials: string;
  colorFrom: string;
  colorTo: string;
}

const employees: Employee[] = [
  { id: 1, name: 'Brian Murutu', role: 'CEO & Founder', department: 'Executive', email: 'brian@yagwatech.com', phone: '+254 701 000 001', online: true, initials: 'BM', colorFrom: '#0B3D91', colorTo: '#1A56C4' },
  { id: 2, name: 'David Kamau', role: 'Senior Full-Stack Developer', department: 'Engineering', email: 'david.kamau@yagwatech.com', phone: '+254 701 000 002', online: true, initials: 'DK', colorFrom: '#F47B20', colorTo: '#F99A50' },
  { id: 3, name: 'Grace Wanjiku', role: 'UI/UX Designer', department: 'Design', email: 'grace.wanjiku@yagwatech.com', phone: '+254 701 000 003', online: false, initials: 'GW', colorFrom: '#8B2FC9', colorTo: '#A855E8' },
  { id: 4, name: 'Peter Njoroge', role: 'Cybersecurity Analyst', department: 'Security', email: 'peter.njoroge@yagwatech.com', phone: '+254 701 000 004', online: true, initials: 'PN', colorFrom: '#059669', colorTo: '#10B981' },
  { id: 5, name: 'Amina Ochieng', role: 'Junior Developer', department: 'Engineering', email: 'amina.ochieng@yagwatech.com', phone: '+254 701 000 005', online: true, initials: 'AO', colorFrom: '#DC2626', colorTo: '#EF4444' },
  { id: 6, name: 'James Odhiambo', role: 'Cloud Infrastructure Engineer', department: 'DevOps', email: 'james.odhiambo@yagwatech.com', phone: '+254 701 000 006', online: false, initials: 'JO', colorFrom: '#0891B2', colorTo: '#06B6D4' },
  { id: 7, name: 'Lydia Mwangi', role: 'Project Manager', department: 'Operations', email: 'lydia.mwangi@yagwatech.com', phone: '+254 701 000 007', online: true, initials: 'LM', colorFrom: '#D97706', colorTo: '#F59E0B' },
  { id: 8, name: 'Dennis Mutua', role: 'Mobile App Developer', department: 'Engineering', email: 'dennis.mutua@yagwatech.com', phone: '+254 701 000 008', online: true, initials: 'DM', colorFrom: '#7C3AED', colorTo: '#8B5CF6' },
  { id: 9, name: 'Faith Njeri', role: 'Business Development', department: 'Sales', email: 'faith.njeri@yagwatech.com', phone: '+254 701 000 009', online: false, initials: 'FN', colorFrom: '#DB2777', colorTo: '#EC4899' },
  { id: 10, name: 'Collins Otieno', role: 'Data Analyst', department: 'Analytics', email: 'collins.otieno@yagwatech.com', phone: '+254 701 000 010', online: true, initials: 'CO', colorFrom: '#065F46', colorTo: '#059669' },
  { id: 11, name: 'Mercy Akinyi', role: 'HR Manager', department: 'Human Resources', email: 'mercy.akinyi@yagwatech.com', phone: '+254 701 000 011', online: false, initials: 'MA', colorFrom: '#92400E', colorTo: '#B45309' },
  { id: 12, name: 'Victor Kipchoge', role: 'Systems Administrator', department: 'IT', email: 'victor.kipchoge@yagwatech.com', phone: '+254 701 000 012', online: true, initials: 'VK', colorFrom: '#1E40AF', colorTo: '#3B82F6' },
];

const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

export default function PortalTeam() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || e.department === dept;
    return matchSearch && matchDept;
  });

  const onlineCount = employees.filter((e) => e.online).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A2E]">Team Directory</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Circle className="w-2 h-2 text-green-500 fill-green-500" />
            <p className="text-sm text-[#5A6680]">{onlineCount} online · {employees.length} total</p>
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
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${emp.colorFrom}, ${emp.colorTo})` }}
                >
                  {emp.initials}
                </div>
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

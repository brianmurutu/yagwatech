'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Kanban,
  CheckSquare,
  FolderOpen,
  LogOut,
  ChevronRight,
  Clock,
  Calendar,
  Users,
  Megaphone,
  User,
} from 'lucide-react';

type Module =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'documents'
  | 'attendance'
  | 'leave'
  | 'team'
  | 'announcements'
  | 'profile';

interface Props {
  activeModule: Module;
  setActiveModule: (m: string) => void;
  onLogout: () => void;
}

const navItems: { id: Module; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', Icon: Kanban },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
  { id: 'attendance', label: 'Attendance', Icon: Clock },
  { id: 'leave', label: 'Leave', Icon: Calendar },
  { id: 'team', label: 'Team', Icon: Users },
  { id: 'announcements', label: 'Announcements', Icon: Megaphone },
  { id: 'documents', label: 'Documents', Icon: FolderOpen },
  { id: 'profile', label: 'My Profile', Icon: User },
];

export default function PortalSidebar({ activeModule, setActiveModule, onLogout }: Props) {
  const [user, setUser] = useState({ name: 'Employee User', email: 'employee@yagwatech.com', avatarUrl: '' });

  useEffect(() => {
    const saved = localStorage.getItem('employee_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const localAvatar = localStorage.getItem(`yagwa_avatar_${parsed.email}`) || '';
        setUser({
          name: parsed.fullName || 'Employee User',
          email: parsed.email || 'employee@yagwatech.com',
          avatarUrl: parsed.avatarUrl || localAvatar || '',
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#07255A] sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F47B20] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">YT</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">YagwaTech</div>
              <div className="text-white/45 text-[10px] font-medium tracking-wider uppercase">
              Team Portal
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activeModule === id;
            return (
              <button
                key={id}
                onClick={() => setActiveModule(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#F47B20]/20 text-[#F47B20]'
                    : 'text-white/65 hover:text-white hover:bg-white/8'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-[#F47B20]' : 'group-hover:text-white'}`} />
                <span className="flex-1 text-left">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#F47B20]" />}
              </button>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F47B20] to-[#1A56C4] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user.name}</div>
              <div className="text-white/40 text-[10px] truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07255A] border-t border-white/10 flex items-center justify-around px-2 py-2 safe-bottom">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeModule === id;
          return (
            <button
              key={id}
              onClick={() => setActiveModule(id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
                isActive ? 'text-[#F47B20]' : 'text-white/45 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium leading-none">{label}</span>
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-white/45 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] font-medium leading-none">Exit</span>
        </button>
      </nav>
    </>
  );
}

'use client';

import {
  LayoutDashboard,
  FileText,
  Edit3,
  Users,
  Calendar,
  Briefcase,
  Image,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

type AdminModule =
  | 'dashboard'
  | 'blog'
  | 'content'
  | 'employees'
  | 'leaves'
  | 'projects'
  | 'media'
  | 'settings';

interface AdminSidebarProps {
  activeModule: AdminModule;
  onNavigate: (module: AdminModule) => void;
  onLogout: () => void;
}

const navItems: { id: AdminModule; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'blog', label: 'Blog Manager', icon: FileText },
  { id: 'content', label: 'Content Manager', icon: Edit3 },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'leaves', label: 'Leave Approvals', icon: Calendar },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'media', label: 'Media Library', icon: Image },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ activeModule, onNavigate, onLogout }: AdminSidebarProps) {
  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#07255A] text-white flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">YagwaTech</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase leading-tight">
                ADMIN
              </span>
            </div>
            <span className="text-xs text-white/40 mt-0.5">Management Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeModule === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Super Admin</p>
              <p className="text-xs text-white/40 truncate">superadmin</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Navigation Bar ────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#07255A] text-white shadow-lg">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-white">YagwaTech</span>
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-widest uppercase">
              ADMIN
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-xs text-white/60 hover:text-red-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            Out
          </button>
        </div>
        {/* Scrollable nav */}
        <div className="flex overflow-x-auto scrollbar-none gap-1 px-2 py-2">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeModule === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-brand-orange text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile top spacer */}
      <div className="lg:hidden h-[104px]" />
    </>
  );
}

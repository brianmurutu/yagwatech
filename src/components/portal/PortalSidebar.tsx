'use client';

import {
  LayoutDashboard,
  Kanban,
  CheckSquare,
  Users,
  Calendar,
  Bell,
  Clock,
  FolderOpen,
  LogOut,
  ChevronRight,
} from 'lucide-react';

type Module =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'team'
  | 'leave'
  | 'announcements'
  | 'attendance'
  | 'documents';

interface Props {
  activeModule: Module;
  setActiveModule: (m: string) => void;
  onLogout: () => void;
}

const navItems: { id: Module; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', Icon: Kanban },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
  { id: 'team', label: 'Team', Icon: Users },
  { id: 'leave', label: 'Leave', Icon: Calendar },
  { id: 'announcements', label: 'Announcements', Icon: Bell },
  { id: 'attendance', label: 'Attendance', Icon: Clock },
  { id: 'documents', label: 'Documents', Icon: FolderOpen },
];

export default function PortalSidebar({ activeModule, setActiveModule, onLogout }: Props) {
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
                Employee Portal
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F47B20] to-[#1A56C4] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">Admin User</div>
              <div className="text-white/40 text-[10px] truncate">admin@yagwatech.com</div>
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
        {navItems.slice(0, 6).map(({ id, label, Icon }) => {
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

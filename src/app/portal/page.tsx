'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import PortalSidebar from '@/components/portal/PortalSidebar';
import PortalDashboard from '@/components/portal/PortalDashboard';
import PortalProjects from '@/components/portal/PortalProjects';
import PortalTasks from '@/components/portal/PortalTasks';
import PortalTeam from '@/components/portal/PortalTeam';
import PortalLeave from '@/components/portal/PortalLeave';
import PortalAnnouncements from '@/components/portal/PortalAnnouncements';
import PortalAttendance from '@/components/portal/PortalAttendance';
import PortalDocuments from '@/components/portal/PortalDocuments';

type Module =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'team'
  | 'leave'
  | 'announcements'
  | 'attendance'
  | 'documents';

export default function PortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('portal_auth');
    if (auth === 'true') setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    // Simulate async check
    await new Promise((r) => setTimeout(r, 600));

    if (username === 'employee' && password === 'yagwa2024') {
      localStorage.setItem('portal_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('portal_auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07255A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#F47B20] rounded-full animate-spin" />
          <span className="text-white/60 text-sm">Loading portal…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07255A] via-[#0B3D91] to-[#07255A] flex items-center justify-center p-4">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#F47B20]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#1A56C4]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
            {/* Header band */}
            <div className="bg-[#07255A] px-8 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
                <Lock className="w-8 h-8 text-[#F47B20]" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">YagwaTech</h1>
              <p className="text-white/60 text-sm mt-1">Employee Portal — Secure Access</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
              {loginError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#1A1A2E]">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6680]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#1A1A2E]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6680]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6680] hover:text-[#1A1A2E] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#F47B20] hover:bg-[#F99A50] text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-[#F47B20]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In to Portal'
                )}
              </button>

              <p className="text-center text-xs text-[#5A6680]">
                Demo: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">employee</span> / <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">yagwa2024</span>
              </p>
            </form>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            © 2024 Yagwa Tech Solutions Ltd · Karen, Nairobi
          </p>
        </div>
      </div>
    );
  }

  const moduleMap: Record<Module, React.ReactNode> = {
    dashboard: <PortalDashboard setActiveModule={(m) => setActiveModule(m as Module)} />,
    projects: <PortalProjects />,
    tasks: <PortalTasks />,
    team: <PortalTeam />,
    leave: <PortalLeave />,
    announcements: <PortalAnnouncements />,
    attendance: <PortalAttendance />,
    documents: <PortalDocuments />,
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      <PortalSidebar
        activeModule={activeModule}
        setActiveModule={(m) => setActiveModule(m as Module)}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E] capitalize">{activeModule}</h2>
            <p className="text-xs text-[#5A6680]">
              {new Date().toLocaleDateString('en-KE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-[#5A6680] hidden sm:block">System Online</span>
          </div>
        </header>

        <div className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">
          {moduleMap[activeModule]}
        </div>
      </main>
    </div>
  );
}

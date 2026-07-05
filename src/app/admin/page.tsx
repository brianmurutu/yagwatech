'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminBlogManager from '@/components/admin/AdminBlogManager';
import AdminContentManager from '@/components/admin/AdminContentManager';
import AdminEmployeeManager from '@/components/admin/AdminEmployeeManager';
import AdminLeaveApprovals from '@/components/admin/AdminLeaveApprovals';
import AdminProjectsManager from '@/components/admin/AdminProjectsManager';
import AdminMediaLibrary from '@/components/admin/AdminMediaLibrary';
import AdminSettings from '@/components/admin/AdminSettings';
import { Eye, EyeOff, Shield, LogIn, AlertTriangle } from 'lucide-react';

type AdminModule =
  | 'dashboard'
  | 'blog'
  | 'content'
  | 'employees'
  | 'leaves'
  | 'projects'
  | 'media'
  | 'settings';

// ── No credentials stored in the client. Authentication is handled
//    entirely by the /api/admin/login endpoint which reads from env vars
//    and responds with a signed HttpOnly session cookie. ──────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');

  /** Verify session against the server (cookie is HttpOnly — we ask the API) */
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session', { method: 'GET', credentials: 'include' });
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      } else if (res.status === 429) {
        setLoginError('Too many login attempts. Please wait 15 minutes before trying again.');
      } else {
        // Generic error — do NOT tell the user which field was wrong
        setLoginError('Invalid credentials. Please check your username and password.');
      }
    } catch {
      setLoginError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Best-effort
    }
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07255A] via-[#0B3D91] to-[#1A56C4] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#07255A] to-[#0B3D91] px-8 py-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">YagwaTech Admin</h1>
              <div className="mt-2 inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                Admin Portal
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeDark disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm"
              >
                {isLoggingIn ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoggingIn ? 'Signing in…' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-gray-400 pt-2">
                Restricted access — authorised personnel only
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-white/50 mt-6">
            © {new Date().getFullYear()} YagwaTech Solutions. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':  return <AdminDashboard onNavigate={setActiveModule} />;
      case 'blog':       return <AdminBlogManager />;
      case 'content':    return <AdminContentManager />;
      case 'employees':  return <AdminEmployeeManager />;
      case 'leaves':     return <AdminLeaveApprovals />;
      case 'projects':   return <AdminProjectsManager />;
      case 'media':      return <AdminMediaLibrary />;
      case 'settings':   return <AdminSettings />;
      default:           return <AdminDashboard onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC]">
      <AdminSidebar
        activeModule={activeModule}
        onNavigate={setActiveModule}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">{renderModule()}</div>
      </main>
    </div>
  );
}

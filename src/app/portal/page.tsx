'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, Phone, FileText, Check } from 'lucide-react';
import PortalSidebar from '@/components/portal/PortalSidebar';
import PortalDashboard from '@/components/portal/PortalDashboard';
import PortalProjects from '@/components/portal/PortalProjects';
import PortalTasks from '@/components/portal/PortalTasks';
import PortalDocuments from '@/components/portal/PortalDocuments';

type Module =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'documents';

export default function PortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [isSignupMode, setIsSignupMode] = useState(false);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [kycRequired, setKycRequired] = useState(false);
  const [kycEmail, setKycEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('portal_auth');
    if (auth === 'true') setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    setKycRequired(false);
    setKycEmail('');

    try {
      const response = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('portal_auth', 'true');
        localStorage.setItem('employee_user', JSON.stringify(data.employee));
        setIsAuthenticated(true);
      } else {
        if (response.status === 403 && data.kycRequired) {
          setKycRequired(true);
          setKycEmail(data.email || username);
        }
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch {
      setLoginError('Server connectivity issue. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/portal/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signupName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSignupSuccess(true);
        // Automatically switch back to login with pre-populated email
        setUsername(signupEmail);
        setTimeout(() => {
          setIsSignupMode(false);
          setSignupSuccess(false);
          setSignupName('');
          setSignupEmail('');
          setSignupPhone('');
          setSignupPassword('');
          setSignupConfirm('');
        }, 3000);
      } else {
        setSignupError(data.error || 'Failed to complete registration.');
      }
    } catch {
      setSignupError('Failed to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portal_auth');
    localStorage.removeItem('employee_user');
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
            <div className="bg-[#07255A] px-8 py-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur mb-2">
                <Lock className="w-6 h-6 text-[#F47B20]" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">YagwaTech</h1>
              <p className="text-white/65 text-xs mt-0.5">
                {isSignupMode ? 'Create Employee Account' : 'Employee Portal — Secure Access'}
              </p>
            </div>

            {/* Signup Form */}
            {isSignupMode ? (
              <form onSubmit={handleSignup} className="px-8 py-6 space-y-4">
                {signupSuccess && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-250 rounded-xl px-4 py-3 text-emerald-800 text-xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Registration Successful!</p>
                      <p className="mt-0.5">Welcome notifications sent. Redirecting to login...</p>
                    </div>
                  </div>
                )}

                {signupError && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p>{signupError}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1A1A2E]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Dennis Mutua"
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1A1A2E]">Email Address</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. employee@company.com"
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1A1A2E]">Phone Number (For SMS)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="e.g. +254 712 345678"
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#1A1A2E]">Password</label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#1A1A2E]">Confirm</label>
                    <input
                      type="password"
                      required
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#F47B20] hover:bg-[#d46512] text-white font-semibold text-xs rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register Employee'}
                </button>

                <div className="text-center pt-2 text-xs">
                  <span className="text-slate-500">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignupMode(false);
                      setSignupError('');
                    }}
                    className="font-bold text-brand-blue hover:underline"
                  >
                    Login
                  </button>
                </div>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
                {loginError && (
                  <div className="flex flex-col gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-655">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="flex-1">{loginError}</p>
                    </div>
                    {kycRequired && (
                      <a
                        href={`/kyc?email=${encodeURIComponent(kycEmail)}`}
                        className="mt-1 font-bold text-center bg-white hover:bg-slate-50 text-[#0B3D91] py-2 rounded-lg border border-slate-200 block transition-colors"
                      >
                        Complete KYC Verification Now &rarr;
                      </a>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#1A1A2E]">Email or Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6680]" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2"
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
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2"
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
                  className="w-full py-3 bg-[#F47B20] hover:bg-[#d46512] text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Signing in…' : 'Sign In to Portal'}
                </button>

                <div className="text-center text-xs">
                  <span className="text-slate-500">Need an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignupMode(true);
                      setLoginError('');
                    }}
                    className="font-bold text-brand-blue hover:underline"
                  >
                    Sign Up
                  </button>
                </div>

                <p className="text-center text-[10px] text-[#5A6680]">
                  Demo: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">employee</span> / <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">yagwa2024</span>
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            © 2026 Yagwa Tech Solutions Ltd &middot; Karen, Nairobi
          </p>
        </div>
      </div>
    );
  }

  const moduleMap: Record<Module, React.ReactNode> = {
    dashboard: <PortalDashboard setActiveModule={(m) => setActiveModule(m as Module)} />,
    projects: <PortalProjects />,
    tasks: <PortalTasks />,
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

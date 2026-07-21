'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Lock, Camera, CheckCircle, AlertCircle, Key } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80', // BM
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80', // AW
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80', // JO
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80', // FA
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80', // KK
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80', // LA
];

export default function PortalProfile() {
  const [user, setUser] = useState({ id: '', fullName: '', email: '', phone: '', avatarUrl: '' });
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userSaved = localStorage.getItem('employee_user');
    if (userSaved) {
      try {
        const parsed = JSON.parse(userSaved);
        // Fallback for avatar from localStorage in case DB column doesn't exist
        const localAvatar = localStorage.getItem(`yagwa_avatar_${parsed.email}`) || '';
        const initialUser = {
          id: parsed.id || '',
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          avatarUrl: parsed.avatarUrl || localAvatar || '',
        };
        setUser(initialUser);
        setFullName(initialUser.fullName);
        setPhone(initialUser.phone);
        setAvatarUrl(initialUser.avatarUrl);
      } catch (e) {
        console.error('Failed to load user in profile component:', e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('You must enter your current password to save changes.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/portal/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          fullName,
          phone,
          currentPassword,
          newPassword: newPassword || undefined,
          avatarUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Cache the avatar locally in case database column doesn't exist
        if (avatarUrl) {
          localStorage.setItem(`yagwa_avatar_${user.email}`, avatarUrl);
        }
        
        // Update user session object
        const updatedSession = {
          ...data.employee,
          avatarUrl: avatarUrl || data.employee.avatarUrl,
        };
        localStorage.setItem('employee_user', JSON.stringify(updatedSession));

        setSuccess('Profile updated successfully! Reloading...');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Connectivity issue. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h3 className="text-lg font-bold text-[#1A1A2E]">My Profile Settings</h3>
        <p className="text-sm text-[#5A6680]">Manage your personal details, profile photo, and password</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-250 rounded-xl px-4 py-3 text-emerald-800 text-xs shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-bold">{success}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-655 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        {/* Left column: Avatar picker */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="relative group mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-28 h-28 rounded-3xl object-cover border-4 border-slate-100 shadow-md transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#0B3D91] to-[#1A56C4] flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-100 shadow-md">
                {initials || 'YT'}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowAvatarPresets(!showAvatarPresets)}
              className="absolute -bottom-2 -right-2 bg-[#F47B20] text-white p-2.5 rounded-2xl shadow-lg hover:bg-[#d46512] transition-colors"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-semibold text-slate-800 text-sm mt-2">{fullName || 'User'}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>

          {showAvatarPresets && (
            <div className="mt-5 p-3 bg-slate-50 rounded-2xl border border-slate-200 w-full animate-fade-in">
              <p className="text-[11px] font-semibold text-slate-500 mb-2.5">Select a profile picture</p>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(url);
                      setShowAvatarPresets(false);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 ${
                      avatarUrl === url ? 'border-[#0B3D91] scale-95' : 'border-transparent hover:border-slate-350'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Or paste an image URL..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-[#0B3D91]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right columns: Profile info + Password update */}
        <div className="md:col-span-2 space-y-6">
          {/* General details Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="font-semibold text-[#1A1A2E] text-sm pb-2 border-b border-gray-50 flex items-center gap-2">
              <User className="w-4 h-4 text-[#0B3D91]" />
              Account Details
            </h4>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="font-semibold text-[#1A1A2E] text-sm pb-2 border-b border-gray-50 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#F47B20]" />
              Change Password
            </h4>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91] transition-all text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Security confirmation Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div>
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                Confirm Changes
              </h4>
              <p className="text-[11px] text-[#5A6680] mt-0.5">Please provide your current password to authorize edits.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white text-slate-800"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#F47B20] hover:bg-[#d46512] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-[#F47B20]/15"
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

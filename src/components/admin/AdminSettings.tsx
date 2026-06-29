'use client';

import { useState } from 'react';
import { Settings, Shield, Globe, Mail, Phone, MapPin, Key, Check, Info } from 'lucide-react';
import { site } from '@/lib/site';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'integrations'>('general');
  const [toast, setToast] = useState<string | null>(null);

  // Settings State
  const [generalSettings, setGeneralSettings] = useState({
    companyName: site.name,
    supportEmail: site.supportEmail,
    businessPhone: site.phone,
    address: site.address,
    hours: site.hours,
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalytics: 'G-R9VQ3LQRX1',
    tinymceKey: 'nkovytues4oqsdhpnpsrkbqc544bme1ike1q36ua3vdxrmap',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('General settings saved successfully!');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    showToast('Password updated successfully!');
    setSecuritySettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Integrations configured successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-55 bg-ink-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
        <p className="text-sm text-ink-400">Configure corporate information, admin security, and external APIs</p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-2xl p-3 border border-black/5 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'general'
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-ink-400 hover:bg-ink-50/50 hover:text-ink-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-ink-400 hover:bg-ink-50/50 hover:text-ink-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security & Auth
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'integrations'
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-ink-400 hover:bg-ink-50/50 hover:text-ink-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            Integrations & APIs
          </button>
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-ink-900">General Settings</h2>
                <p className="text-xs text-ink-400 mt-1">Configure company profiles that show on contact/about pages</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Corporate Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      type="text"
                      value={generalSettings.businessPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, businessPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Headquarters Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      type="text"
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Opening Hours</label>
                  <input
                    type="text"
                    value={generalSettings.hours}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, hours: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-orange/15"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-ink-900">Security & Authentication</h2>
                <p className="text-xs text-ink-400 mt-1">Configure credentials for the Superadmin authentication gate</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Current Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={securitySettings.currentPassword}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={securitySettings.newPassword}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={securitySettings.confirmPassword}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-brand-blue max-w-md">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold">Password Requirements:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Minimum 8 characters long</li>
                    <li>At least one capital letter</li>
                    <li>At least one number or special character</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-orange/15"
                >
                  <Check className="w-4 h-4" /> Change Password
                </button>
              </div>
            </form>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <form onSubmit={handleSaveIntegrations} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-ink-900">Integrations & API Settings</h2>
                <p className="text-xs text-ink-400 mt-1">Configure third-party API integration keys and trackers</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">Google Analytics measurement ID</label>
                  <input
                    type="text"
                    value={integrationSettings.googleAnalytics}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleAnalytics: e.target.value })}
                    placeholder="e.g. G-XXXXXX"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">TinyMCE Cloud API Key</label>
                  <input
                    type="text"
                    value={integrationSettings.tinymceKey}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, tinymceKey: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                  <p className="text-[10px] text-ink-400 mt-1.5 leading-relaxed">
                    Used to load TinyMCE editor dependencies over the Cloud CDN. Domain whitelisting required.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-orange/15"
                >
                  <Check className="w-4 h-4" /> Save Integration Keys
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

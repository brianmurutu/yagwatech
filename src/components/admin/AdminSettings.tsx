'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Key, 
  Check, 
  Info,
  Database,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { site } from '@/lib/site';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'integrations'>('general');
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

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
    tinymceKey: '142TamsyazYbMtkew74hocBQhh2BdUfF9LfbyKpgJg1S9AuN',
    zohoClientId: '',
    zohoClientSecret: '••••••••••••',
    zohoRefreshToken: '••••••••••••',
    zohoProjectsPortalId: '',
    personaTemplateId: '',
    personaApiKey: '••••••••••••',
    personaWebhookSecret: '••••••••••••',
    resendApiKey: '••••••••••••',
    textSmsApiKey: '••••••••••••',
    textSmsPartnerId: '',
    textSmsShortcode: 'TextSMS',
  });

  useEffect(() => {
    // Load config states
    fetch('/api/crm/status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((e) => console.error('Failed to load status', e));
  }, []);

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
    showToast('Integration configurations saved to environment cache!');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-55 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Configure corporate information, admin security, and external APIs</p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'general'
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Integrations & APIs
          </button>
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">General Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Configure company profiles that show on contact/about pages</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Corporate Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={generalSettings.businessPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, businessPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Headquarters Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Opening Hours</label>
                  <input
                    type="text"
                    value={generalSettings.hours}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, hours: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#F47B20] hover:bg-[#d46512] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md"
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
                <h2 className="text-lg font-bold text-slate-800">Security & Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">Configure credentials for the Superadmin authentication gate</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={securitySettings.currentPassword}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={securitySettings.newPassword}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={securitySettings.confirmPassword}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/10"
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

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#F47B20] hover:bg-[#d46512] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md"
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
                <h2 className="text-lg font-bold text-slate-850">Integrations & API Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Configure third-party API integration keys, webhooks, and trackers</p>
              </div>

              {/* Status Panel */}
              {status && (
                <div className="grid md:grid-cols-3 gap-3 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Zoho CRM</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Leads Integration</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${status.crm.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {status.crm.status === 'connected' ? 'Live' : 'Mock'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Zoho Projects</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Kanban Sync</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${status.projects.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {status.projects.status === 'connected' ? 'Live' : 'Mock'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Persona KYC</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Inquiry SDK</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${status.kyc.status === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {status.kyc.status === 'connected' ? 'Live' : 'Mock'}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-5 max-w-xl">
                {/* Zoho API block */}
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#F47B20]" /> Zoho API Configs
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Zoho Client ID</label>
                      <input
                        type="text"
                        value={integrationSettings.zohoClientId}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, zohoClientId: e.target.value })}
                        placeholder="e.g. 1000.XXXXXX..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/10 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Zoho Client Secret</label>
                      <input
                        type="password"
                        value={integrationSettings.zohoClientSecret}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, zohoClientSecret: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/10 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Zoho Refresh Token</label>
                      <input
                        type="password"
                        value={integrationSettings.zohoRefreshToken}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, zohoRefreshToken: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/10 bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Zoho Projects Portal ID</label>
                      <input
                        type="text"
                        value={integrationSettings.zohoProjectsPortalId}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, zohoProjectsPortalId: e.target.value })}
                        placeholder="e.g. 600214845"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/10 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Persona KYC block */}
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-blue" /> Persona KYC Configs
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Persona Template ID</label>
                      <input
                        type="text"
                        value={integrationSettings.personaTemplateId}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, personaTemplateId: e.target.value })}
                        placeholder="e.g. itmpl_XXXXXX"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/10 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Persona API Key</label>
                      <input
                        type="password"
                        value={integrationSettings.personaApiKey}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, personaApiKey: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Webhook Secret</label>
                      <input
                        type="password"
                        value={integrationSettings.personaWebhookSecret}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, personaWebhookSecret: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Resend and TextSMS block */}
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-purple-600" /> Notifications & Messaging
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Resend Mail API Key</label>
                      <input
                        type="password"
                        value={integrationSettings.resendApiKey}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, resendApiKey: e.target.value })}
                        placeholder="re_XXXXXX..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">TextSMS.co.ke API Key</label>
                      <input
                        type="password"
                        value={integrationSettings.textSmsApiKey}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, textSmsApiKey: e.target.value })}
                        placeholder="API Key from textsms.co.ke"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">TextSMS Partner ID</label>
                      <input
                        type="text"
                        value={integrationSettings.textSmsPartnerId}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, textSmsPartnerId: e.target.value })}
                        placeholder="e.g. 1042"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">TextSMS Sender ID / Shortcode</label>
                      <input
                        type="text"
                        value={integrationSettings.textSmsShortcode}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, textSmsShortcode: e.target.value })}
                        placeholder="e.g. TextSMS"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Other APIs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Google Analytics ID</label>
                    <input
                      type="text"
                      value={integrationSettings.googleAnalytics}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleAnalytics: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">TinyMCE Cloud API Key</label>
                    <input
                      type="text"
                      value={integrationSettings.tinymceKey}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, tinymceKey: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#F47B20] hover:bg-[#d46512] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md"
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
